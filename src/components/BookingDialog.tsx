import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner@2.0.3";

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", 
  "14:00", "15:00", "16:00", "17:00"
];

const services = [
  "Revisão Completa",
  "Mudança de Óleo",
  "Travões (pastilhas e discos)",
  "Pneus e Rodas",
  "Diagnóstico Eletrónico",
  "Corrente e Transmissão",
  "Suspensão",
  "Escape",
  "Outro"
];

export function BookingDialog({ open, onOpenChange }: BookingDialogProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("");
  const [service, setService] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [vehicle, setVehicle] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !time || !service || !name || !phone || !vehicle) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    // Aqui pode integrar com um backend/Supabase
    toast.success(`Agendamento confirmado para ${date.toLocaleDateString('pt-PT')} às ${time}!`);
    
    // Reset form
    setDate(undefined);
    setTime("");
    setService("");
    setName("");
    setPhone("");
    setVehicle("");
    setNotes("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agendar Revisão</DialogTitle>
          <DialogDescription>
            Escolha a data, horário e preencha os dados para agendar o seu serviço
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Calendário */}
            <div className="space-y-2">
              <Label>Data do Agendamento *</Label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => date < new Date() || date.getDay() === 0}
                className="rounded-md border"
              />
            </div>

            {/* Formulário */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="service">Serviço *</Label>
                <Select value={service} onValueChange={setService}>
                  <SelectTrigger id="service">
                    <SelectValue placeholder="Selecione o serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
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
                <Label htmlFor="vehicle">Mota (Marca/Modelo/Ano) *</Label>
                <Input
                  id="vehicle"
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  placeholder="Ex: Honda CB 500 2020"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Descreva o problema ou serviço pretendido..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Confirmar Agendamento
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
