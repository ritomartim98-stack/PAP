import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../components/ui/table";
import { Calendar, Search, Filter, CheckCircle, XCircle, Clock, Trash2 } from "lucide-react";
import { motion } from "motion/react";

interface Booking {
  id: string;
  service: string;
  serviceName: string;
  date: string;
  time: string;
  duration: string;
  price: string;
  name: string;
  phone: string;
  email: string;
  vehicle: string;
  notes: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

const serviceNames: Record<string, string> = {
  revisao: "Revisão Completa",
  oleo: "Mudança de Óleo",
  travoes: "Travões (pastilhas e discos)",
  pneus: "Pneus e Rodas",
  diagnostico: "Diagnóstico Eletrónico",
  corrente: "Corrente e Transmissão",
  suspensao: "Suspensão",
  escape: "Escape",
  outro: "Outro"
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500",
  confirmed: "bg-blue-500",
  completed: "bg-green-500",
  cancelled: "bg-red-500"
};

const statusLabels: Record<string, string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  completed: "Concluído",
  cancelled: "Cancelado"
};

export function AdminBookingsPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authPassword, setAuthPassword] = useState("");

  useEffect(() => {
    const savedBookings = localStorage.getItem("admin_bookings");
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }
    const auth = localStorage.getItem("admin_auth") === "true";
    setIsAuthenticated(auth);
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (authPassword === "admin123") {
      setIsAuthenticated(true);
      localStorage.setItem("admin_auth", "true");
    }
  };

  const updateBookingStatus = (id: string, status: Booking["status"]) => {
    const updatedBookings = bookings.map(b => 
      b.id === id ? { ...b, status } : b
    );
    setBookings(updatedBookings);
    localStorage.setItem("admin_bookings", JSON.stringify(updatedBookings));
  };

  const deleteBooking = (id: string) => {
    const updatedBookings = bookings.filter(b => b.id !== id);
    setBookings(updatedBookings);
    localStorage.setItem("admin_bookings", JSON.stringify(updatedBookings));
    setSelectedBooking(null);
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.phone.includes(searchTerm) ||
      booking.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === "pending").length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    completed: bookings.filter(b => b.status === "completed").length,
    cancelled: bookings.filter(b => b.status === "cancelled").length
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Área Administrativa</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Password de admin"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                Entrar
              </Button>
              <p className="text-sm text-gray-500 text-center">
                Password padrão: admin123
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Área Administrativa</h1>
              <p className="text-slate-300">Gerir marcações de clientes</p>
            </div>
            <Button variant="outline" onClick={() => onNavigate("home")}>
              Voltar ao Site
            </Button>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-gray-500">Total</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                <div className="text-sm text-gray-500">Pendentes</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.confirmed}</div>
                <div className="text-sm text-gray-500">Confirmados</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                <div className="text-sm text-gray-500">Concluídos</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
                <div className="text-sm text-gray-500">Cancelados</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle>Todas as Marcações</CardTitle>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Pesquisar..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="all">Todos os estados</option>
                    <option value="pending">Pendente</option>
                    <option value="confirmed">Confirmado</option>
                    <option value="completed">Concluído</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Mota</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        {bookings.length === 0 
                          ? "Nenhuma marcação encontrada. As marcações aparecerão aqui quando os clientes efetuarem marcações no site." 
                          : "Nenhuma marcação corresponde aos filtros selecionados."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBookings
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <div>
                                <div className="font-medium">
                                  {new Date(booking.date).toLocaleDateString("pt-PT")}
                                </div>
                                <div className="text-sm text-gray-500">{booking.time}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{booking.name}</div>
                              <div className="text-sm text-gray-500">{booking.phone}</div>
                            </div>
                          </TableCell>
                          <TableCell>{booking.serviceName}</TableCell>
                          <TableCell className="text-sm">{booking.vehicle}</TableCell>
                          <TableCell>
                            <Badge className={statusColors[booking.status]}>
                              {statusLabels[booking.status]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedBooking(booking)}
                            >
                              Ver Detalhes
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </section>

      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Detalhes da Marcação</h2>
                <Button variant="ghost" onClick={() => setSelectedBooking(null)}>
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Serviço</div>
                    <div className="font-medium">{selectedBooking.serviceName}</div>
                    <div className="text-sm text-gray-600">{selectedBooking.duration} - {selectedBooking.price}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Data e Hora</div>
                    <div className="font-medium">{new Date(selectedBooking.date).toLocaleDateString("pt-PT")}</div>
                    <div className="text-sm text-gray-600">{selectedBooking.time}</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Dados do Cliente</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Nome:</span> {selectedBooking.name}
                    </div>
                    <div>
                      <span className="text-gray-500">Telemóvel:</span> {selectedBooking.phone}
                    </div>
                    <div>
                      <span className="text-gray-500">Email:</span> {selectedBooking.email || "Não informado"}
                    </div>
                    <div>
                      <span className="text-gray-500">Mota:</span> {selectedBooking.vehicle}
                    </div>
                  </div>
                </div>

                {selectedBooking.notes && (
                  <div>
                    <h3 className="font-semibold mb-2">Observações</h3>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedBooking.notes}</p>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold mb-3">Atualizar Estado</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      size="sm"
                      variant={selectedBooking.status === "pending" ? "default" : "outline"}
                      onClick={() => updateBookingStatus(selectedBooking.id, "pending")}
                    >
                      <Clock className="w-4 h-4 mr-1" />
                      Pendente
                    </Button>
                    <Button 
                      size="sm"
                      variant={selectedBooking.status === "confirmed" ? "default" : "outline"}
                      onClick={() => updateBookingStatus(selectedBooking.id, "confirmed")}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Confirmar
                    </Button>
                    <Button 
                      size="sm"
                      variant={selectedBooking.status === "completed" ? "default" : "outline"}
                      onClick={() => updateBookingStatus(selectedBooking.id, "completed")}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Concluir
                    </Button>
                    <Button 
                      size="sm"
                      variant={selectedBooking.status === "cancelled" ? "destructive" : "outline"}
                      onClick={() => updateBookingStatus(selectedBooking.id, "cancelled")}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Cancelar
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button 
                    variant="destructive"
                    onClick={() => deleteBooking(selectedBooking.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar Marcação
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}