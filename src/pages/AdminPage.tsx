import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";

const API_URL = "http://localhost:3001/api";

interface Booking {
  id: number;
  service: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
  vehicle: string;
  notes: string;
  status: string;
  created_at: string;
}

export function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${API_URL}/bookings`);
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Erro ao carregar agendamentos:", error);
      toast.error("Erro ao carregar agendamentos");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const booking = bookings.find(b => b.id === id);
      if (!booking) return;

      await fetch(`${API_URL}/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...booking, status }),
      });

      toast.success(`Status alterado para ${status}`);
      fetchBookings();
    } catch (error) {
      toast.error("Erro ao atualizar status");
    }
  };

  const deleteBooking = async (id: number) => {
    if (!confirm("Tem a certeza que deseja eliminar este agendamento?")) return;

    try {
      await fetch(`${API_URL}/bookings/${id}`, {
        method: "DELETE",
      });
      toast.success("Agendamento eliminado");
      fetchBookings();
    } catch (error) {
      toast.error("Erro ao eliminar agendamento");
    }
  };

  const filteredBookings = bookings.filter(
    (b) =>
      b.name.toLowerCase().includes(filter.toLowerCase()) ||
      b.vehicle.toLowerCase().includes(filter.toLowerCase()) ||
      b.service.toLowerCase().includes(filter.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500";
      case "confirmed": return "bg-blue-500";
      case "completed": return "bg-green-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Administração</h1>
            <p className="text-gray-600">Gerir agendamentos</p>
          </div>
          <Button onClick={fetchBookings} variant="outline">
            Atualizar
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <Input
              placeholder="Pesquisar por nome, mota ou serviço..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="max-w-md"
            />
          </CardContent>
        </Card>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">A carregar...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum agendamento encontrado</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{booking.name}</h3>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Serviço:</span> {booking.service}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Data/Hora:</span>{" "}
                        {new Date(booking.date).toLocaleDateString("pt-PT")} às {booking.time}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Mota:</span> {booking.vehicle}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Telemóvel:</span> {booking.phone}
                      </p>
                      {booking.email && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Email:</span> {booking.email}
                        </p>
                      )}
                      {booking.notes && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Observações:</span> {booking.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {booking.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={() => updateStatus(booking.id, "confirmed")}
                        >
                          Confirmar
                        </Button>
                      )}
                      {booking.status === "confirmed" && (
                        <Button
                          size="sm"
                          onClick={() => updateStatus(booking.id, "completed")}
                        >
                          Concluir
                        </Button>
                      )}
                      {booking.status !== "cancelled" && booking.status !== "completed" && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateStatus(booking.id, "cancelled")}
                        >
                          Cancelar
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteBooking(booking.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
