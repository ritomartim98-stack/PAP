import { useState } from "react";
import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner@2.0.3";
import { motion } from "motion/react";
import { Calendar as CalendarIcon, Clock, CheckCircle2 } from "lucide-react";
import { Badge } from "../components/ui/badge";

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", 
  "14:00", "15:00", "16:00", "17:00", "18:00"
];

const services = [
  { id: "revisao", name: "Revisão Completa", duration: "2-3h", price: "150€" },
  { id: "oleo", name: "Mudança de Óleo", duration: "30min", price: "50€" },
  { id: "travoes", name: "Travões (pastilhas e discos)", duration: "1-2h", price: "120€" },
  { id: "pneus", name: "Pneus e Rodas", duration: "1h", price: "80€" },
  { id: "diagnostico", name: "Diagnóstico Eletrónico", duration: "1h", price: "60€" },
  { id: "corrente", name: "Corrente e Transmissão", duration: "1h", price: "90€" },
  { id: "suspensao", name: "Suspensão", duration: "2h", price: "180€" },
  { id: "escape", name: "Escape", duration: "1-2h", price: "100€" },
  { id: "outro", name: "Outro", duration: "Variável", price: "A consultar" }
];

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

  const selectedService = services.find(s => s.id === service);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !time || !service || !name || !phone || !vehicle) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    toast.success(`Agendamento confirmado para ${date.toLocaleDateString('pt-PT')} às ${time}!`);
    
    // Reset form
    setStep(1);
    setDate(undefined);
    setTime("");
    setService("");
    setName("");
    setPhone("");
    setEmail("");
    setVehicle("");
    setNotes("");
  };

  const canProceedToStep2 = date && time && service;
  const canSubmit = canProceedToStep2 && name && phone && vehicle;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-white mb-4">Agendar Serviço</h1>
            <p className="text-purple-100 max-w-2xl">
              Escolha o melhor horário para si e agende o serviço da sua mota de forma rápida e fácil.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Steps Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-purple-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
                  {step > 1 ? <CheckCircle2 className="w-6 h-6" /> : '1'}
                </div>
                <span className="hidden sm:inline">Serviço e Data</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-300"></div>
              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-purple-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
                  2
                </div>
                <span className="hidden sm:inline">Dados Pessoais</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatedStep show={step === 1}>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Service Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle>Escolha o Serviço</CardTitle>
                    <CardDescription>Selecione o tipo de serviço que precisa</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="service">Serviço *</Label>
                      <Select value={service} onValueChange={setService}>
                        <SelectTrigger id="service">
                          <SelectValue placeholder="Selecione o serviço" />
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
                        className="bg-purple-50 p-4 rounded-lg space-y-2"
                      >
                        <h4 className="text-purple-900">{selectedService.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-purple-700">
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

                {/* Date and Time Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle>Data e Horário</CardTitle>
                    <CardDescription>Escolha quando quer trazer a sua mota</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Data *</Label>
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) => date < new Date() || date.getDay() === 0}
                        className="rounded-md border"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time">Horário *</Label>
                      <Select value={time} onValueChange={setTime}>
                        <SelectTrigger id="time">
                          <SelectValue placeholder="Selecione o horário" />
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
                      <Label htmlFor="phone">Telemóvel *</Label>
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
                      <Label htmlFor="notes">Observações</Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Descreva o problema ou serviço pretendido..."
                        rows={4}
                      />
                    </div>
                  </div>

                  {/* Summary */}
                  {canProceedToStep2 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 bg-gray-50 p-6 rounded-lg"
                    >
                      <h4 className="text-gray-900 mb-4">Resumo do Agendamento</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Serviço:</span>
                          <span className="text-gray-900">{selectedService?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Data:</span>
                          <span className="text-gray-900">{date?.toLocaleDateString('pt-PT')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Horário:</span>
                          <span className="text-gray-900">{time}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duração:</span>
                          <span className="text-gray-900">{selectedService?.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Preço:</span>
                          <span className="text-purple-600">{selectedService?.price}</span>
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
                  disabled={!canSubmit}
                >
                  <CalendarIcon className="w-5 h-5 mr-2" />
                  Confirmar Agendamento
                </Button>
              </div>
            </AnimatedStep>
          </form>
        </div>
      </section>
    </div>
  );
}

function AnimatedStep({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: show ? 1 : 0, x: show ? 0 : 20 }}
      style={{ display: show ? 'block' : 'none' }}
    >
      {children}
    </motion.div>
  );
}
