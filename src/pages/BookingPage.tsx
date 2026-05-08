import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner";
import { motion } from "motion/react";
import { Calendar as CalendarIcon, Clock, CheckCircle2 } from "lucide-react";
import { Badge } from "../components/ui/badge";

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00",
  "14:00", "15:00", "16:00", "17:00", "18:00"
];

interface Service {
  id: string;
  idservico: number;
  name: string;
  duration: string;
  price: string;
}

export function BookingPage() {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("");
  const [service, setService] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [vehicle, setVehicle] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const selectedService = services.find((s) => s.id === service);

  useEffect(() => {
    fetch("http://localhost:3001/api/servicos")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erro ao carregar servicos");
        }

        return res.json();
      })
      .then((data) => setServices(data))
      .catch(() => toast.error("Nao foi possivel carregar os servicos da base de dados"))
      .finally(() => setServicesLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !time || !service || !name || !phone || !vehicle) {
      toast.error("Por favor, preencha todos os campos obrigatorios");
      return;
    }

    const clientId = localStorage.getItem("clientId");
    if (!clientId) {
      toast.error("Tem de iniciar sessao antes de marcar um servico");
      return;
    }

    if (!selectedService) {
      toast.error("Selecione um servico valido");
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch("http://localhost:3001/api/marcacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idcliente: clientId,
          idservico: selectedService.idservico,
          datahora: formatDateTimeForMysql(date, time),
          name,
          phone,
          email,
          vehicle,
          notes
        })
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Erro ao criar marcacao");
        return;
      }

      toast.success(`Agendamento confirmado para ${date.toLocaleDateString("pt-PT")} as ${time}!`);

      setStep(1);
      setDate(undefined);
      setTime("");
      setService("");
      setName("");
      setPhone("");
      setEmail("");
      setVehicle("");
      setNotes("");
    } catch {
      toast.error("Erro ao ligar ao servidor");
    } finally {
      setSubmitting(false);
    }
  };

  const canProceedToStep2 = date && time && service;
  const canSubmit = canProceedToStep2 && name && phone && vehicle;

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl text-white mb-4">Agendar Servico</h1>
            <p className="text-gray-300 max-w-2xl">
              Escolha o melhor horario para si e agende o servico da sua mota de forma rapida e facil.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4">
              <div className={`flex items-center gap-2 ${step >= 1 ? "text-blue-600" : "text-gray-400"}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
                  {step > 1 ? <CheckCircle2 className="w-6 h-6" /> : "1"}
                </div>
                <span className="hidden sm:inline">Servico e Data</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-300"></div>
              <div className={`flex items-center gap-2 ${step >= 2 ? "text-blue-600" : "text-gray-400"}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
                  2
                </div>
                <span className="hidden sm:inline">Dados Pessoais</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatedStep show={step === 1}>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Escolha o Servico</CardTitle>
                    <CardDescription>Selecione o tipo de servico que precisa</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="service">Servico *</Label>
                      <Select value={service} onValueChange={setService} disabled={servicesLoading}>
                        <SelectTrigger id="service">
                          <SelectValue placeholder={servicesLoading ? "A carregar servicos..." : "Selecione o servico"} />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedService && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-blue-50 p-4 rounded-lg space-y-2"
                      >
                        <h4 className="text-blue-900">{selectedService.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-blue-700">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {selectedService.duration}
                          </div>
                          <Badge variant="secondary">{selectedService.price}</Badge>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Data e Horario</CardTitle>
                    <CardDescription>Escolha quando quer trazer a sua mota</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Data *</Label>
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(calendarDate: Date) => calendarDate < new Date() || calendarDate.getDay() === 0}
                        className="rounded-md border"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time">Horario *</Label>
                      <Select value={time} onValueChange={setTime}>
                        <SelectTrigger id="time">
                          <SelectValue placeholder="Selecione o horario" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              {slot}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  type="button"
                  size="lg"
                  onClick={() => setStep(2)}
                  disabled={!canProceedToStep2}
                >
                  Continuar
                </Button>
              </div>
            </AnimatedStep>

            <AnimatedStep show={step === 2}>
              <Card>
                <CardHeader>
                  <CardTitle>Dados Pessoais</CardTitle>
                  <CardDescription>Precisamos dos seus dados para confirmar o agendamento</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo *</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Seu nome completo"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Telemovel *</Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="9XX XXX XXX"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.pt"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vehicle">Mota (Marca/Modelo/Ano) *</Label>
                      <Input
                        id="vehicle"
                        value={vehicle}
                        onChange={(e) => setVehicle(e.target.value)}
                        placeholder="Ex: Honda CB 500 2020"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="notes">Observacoes</Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Descreva o problema ou servico pretendido..."
                        rows={4}
                      />
                    </div>
                  </div>

                  {canProceedToStep2 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 bg-gray-50 p-6 rounded-lg"
                    >
                      <h4 className="text-gray-900 mb-4">Resumo do Agendamento</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Servico:</span>
                          <span className="text-gray-900">{selectedService?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Data:</span>
                          <span className="text-gray-900">{date?.toLocaleDateString("pt-PT")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Horario:</span>
                          <span className="text-gray-900">{time}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duracao:</span>
                          <span className="text-gray-900">{selectedService?.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Preco:</span>
                          <span className="text-blue-600">{selectedService?.price}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>

              <div className="mt-6 flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setStep(1)}
                >
                  Voltar
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  disabled={!canSubmit || submitting}
                >
                  <CalendarIcon className="w-5 h-5 mr-2" />
                  {submitting ? "A confirmar..." : "Confirmar Agendamento"}
                </Button>
              </div>
            </AnimatedStep>
          </form>
        </div>
      </section>
    </div>
  );
}

function formatDateTimeForMysql(date: Date, time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const dateTime = new Date(date);
  dateTime.setHours(hours, minutes, 0, 0);

  const year = dateTime.getFullYear();
  const month = String(dateTime.getMonth() + 1).padStart(2, "0");
  const day = String(dateTime.getDate()).padStart(2, "0");
  const hour = String(dateTime.getHours()).padStart(2, "0");
  const minute = String(dateTime.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hour}:${minute}:00`;
}

function AnimatedStep({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: show ? 1 : 0, x: show ? 0 : 20 }}
      style={{ display: show ? "block" : "none" }}
    >
      {children}
    </motion.div>
  );
}
