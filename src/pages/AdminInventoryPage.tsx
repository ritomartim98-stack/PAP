import { useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Bike, Package, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../components/ui/table";
import { DEFAULT_MOTORCYCLE_IMAGE } from "../data/motorcycles";
import { apiUrl } from "../lib/api";

interface AdminInventoryPageProps {
  onNavigate: (page: string) => void;
}

interface Motorcycle {
  id: number;
  marca: string;
  modelo: string;
  tipo: string;
  ano: number;
  preco: number;
  imagem: string;
  cilindrada: number;
  potencia: number;
  quilometragem: number;
  horas?: number;
  extras: string;
  descricao: string;
}

interface Part {
  id: number;
  idpeca: number;
  nome: string;
  categoria: string;
  referencia: string;
  preco: number;
  imagem: string;
  stock: number;
}

type Section = "motorcycles" | "parts";

const emptyMotorcycle = {
  marca: "",
  modelo: "",
  tipo: "",
  ano: new Date().getFullYear(),
  preco: 0,
  imagem: "",
  cilindrada: 0,
  potencia: 0,
  quilometragem: 0,
  horas: 0,
  extras: "",
  descricao: ""
};

const emptyPart = {
  nome: "",
  categoria: "",
  referencia: "",
  preco: 0,
  imagem: "",
  stock: 0
};

const motorcycleCategoryOptions = ["Sport", "Motocross", "Cruiser", "Adventure", "Touring", "Scooter"];
const partCategoryOptions = ["Travoes", "Motor", "Transmissao", "Pneus", "Lubrificantes", "Eletronica", "Suspensao", "Escape"];

function normalizeImagePath(image: string) {
  const trimmedImage = image.trim();

  if (!trimmedImage) {
    return DEFAULT_MOTORCYCLE_IMAGE;
  }

  if (trimmedImage.startsWith("http") || trimmedImage.startsWith("uploads/")) {
    return trimmedImage;
  }

  return `uploads/${trimmedImage}`;
}

export function AdminInventoryPage({ onNavigate }: AdminInventoryPageProps) {
  const [section, setSection] = useState<Section>("motorcycles");
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingMotorcycleId, setEditingMotorcycleId] = useState<number | null>(null);
  const [editingPartId, setEditingPartId] = useState<number | null>(null);
  const [motorcycleForm, setMotorcycleForm] = useState(emptyMotorcycle);
  const [partForm, setPartForm] = useState(emptyPart);

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`
  });

  const motorcycleCategories = useMemo(
    () => Array.from(new Set([...motorcycleCategoryOptions, ...motorcycles.map((motorcycle) => motorcycle.tipo).filter(Boolean)])),
    [motorcycles]
  );
  const partCategories = useMemo(
    () => Array.from(new Set([...partCategoryOptions, ...parts.map((part) => part.categoria).filter(Boolean)])),
    [parts]
  );

  const loadInventory = async () => {
    setLoading(true);

    try {
      const [motorcyclesRes, partsRes] = await Promise.all([
        fetch(apiUrl("/api/motorcycles"), { cache: "no-store" }),
        fetch(apiUrl("/api/pecas"), { cache: "no-store" })
      ]);

      if (!motorcyclesRes.ok || !partsRes.ok) {
        throw new Error("Erro ao carregar stock");
      }

      setMotorcycles(await motorcyclesRes.json());
      setParts(await partsRes.json());
    } catch (error) {
      console.error(error);
      toast.error("Nao foi possivel carregar as motas e peças.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const resetMotorcycleForm = () => {
    setEditingMotorcycleId(null);
    setMotorcycleForm(emptyMotorcycle);
  };

  const resetPartForm = () => {
    setEditingPartId(null);
    setPartForm(emptyPart);
  };

  const editMotorcycle = (motorcycle: Motorcycle) => {
    setSection("motorcycles");
    setEditingMotorcycleId(motorcycle.id);
    setMotorcycleForm({
      marca: motorcycle.marca || "",
      modelo: motorcycle.modelo || "",
      tipo: motorcycle.tipo || "",
      ano: motorcycle.ano || new Date().getFullYear(),
      preco: motorcycle.preco || 0,
      imagem: motorcycle.imagem || "",
      cilindrada: motorcycle.cilindrada || 0,
      potencia: motorcycle.potencia || 0,
      quilometragem: motorcycle.quilometragem || 0,
      horas: motorcycle.horas || 0,
      extras: motorcycle.extras || "",
      descricao: motorcycle.descricao || ""
    });
  };

  const editPart = (part: Part) => {
    setSection("parts");
    setEditingPartId(part.idpeca || part.id);
    setPartForm({
      nome: part.nome || "",
      categoria: part.categoria || "",
      referencia: part.referencia || "",
      preco: part.preco || 0,
      imagem: part.imagem || "",
      stock: part.stock || 0
    });
  };

  const saveMotorcycle = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    const payload = {
      ...motorcycleForm,
      imagem: normalizeImagePath(motorcycleForm.imagem)
    };

    const url = editingMotorcycleId
      ? apiUrl(`/api/admin/motorcycles/${editingMotorcycleId}`)
      : apiUrl("/api/admin/motorcycles");

    try {
      const res = await fetch(url, {
        method: editingMotorcycleId ? "PUT" : "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erro ao guardar mota");
      }

      toast.success(editingMotorcycleId ? "Mota atualizada." : "Mota adicionada.");
      resetMotorcycleForm();
      await loadInventory();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao guardar mota.");
    } finally {
      setSaving(false);
    }
  };

  const savePart = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);

    const url = editingPartId
      ? apiUrl(`/api/admin/pecas/${editingPartId}`)
      : apiUrl("/api/admin/pecas");

    try {
      const res = await fetch(url, {
        method: editingPartId ? "PUT" : "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(partForm)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erro ao guardar peça");
      }

      toast.success(editingPartId ? "Peça atualizada." : "Peça adicionada.");
      resetPartForm();
      await loadInventory();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao guardar peça.");
    } finally {
      setSaving(false);
    }
  };

  const deleteMotorcycle = async (id: number) => {
    if (!window.confirm("Eliminar esta mota da loja?")) return;

    try {
      const res = await fetch(apiUrl(`/api/admin/motorcycles/${id}`), {
        method: "DELETE",
        headers: getAuthHeaders()
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erro ao eliminar mota");
      }

      toast.success("Mota eliminada.");
      await loadInventory();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao eliminar mota.");
    }
  };

  const deletePart = async (id: number) => {
    if (!window.confirm("Eliminar esta peça da loja?")) return;

    try {
      const res = await fetch(apiUrl(`/api/admin/pecas/${id}`), {
        method: "DELETE",
        headers: getAuthHeaders()
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erro ao eliminar peça");
      }

      toast.success("Peça eliminada.");
      await loadInventory();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao eliminar peça.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Gerir loja</h1>
              <p className="text-slate-300">Adicionar e atualizar motas e peças do site</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => onNavigate("admin-bookings")}>
                Marcacoes
              </Button>
              <Button variant="outline" onClick={() => onNavigate("home")}>
                Voltar ao site
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={section === "motorcycles" ? "default" : "outline"}
              onClick={() => setSection("motorcycles")}
            >
              <Bike className="w-4 h-4 mr-2" />
              Motas
            </Button>
            <Button
              variant={section === "parts" ? "default" : "outline"}
              onClick={() => setSection("parts")}
            >
              <Package className="w-4 h-4 mr-2" />
              Peças
            </Button>
          </div>

          {section === "motorcycles" ? (
            <div className="grid lg:grid-cols-[380px_1fr] gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{editingMotorcycleId ? "Editar mota" : "Adicionar mota"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={saveMotorcycle} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <FormInput label="Marca" value={motorcycleForm.marca} onChange={(value) => setMotorcycleForm({ ...motorcycleForm, marca: value })} />
                      <FormInput label="Modelo" value={motorcycleForm.modelo} onChange={(value) => setMotorcycleForm({ ...motorcycleForm, modelo: value })} />
                    </div>
                    <FormSelect
                      label="Tipo"
                      placeholder="Escolher tipo"
                      value={motorcycleForm.tipo}
                      options={motorcycleCategories}
                      onChange={(value) => setMotorcycleForm({ ...motorcycleForm, tipo: value })}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <FormInput label="Ano" type="number" value={motorcycleForm.ano} onChange={(value) => setMotorcycleForm({ ...motorcycleForm, ano: Number(value) })} />
                      <FormInput label="Preco" type="number" value={motorcycleForm.preco} onChange={(value) => setMotorcycleForm({ ...motorcycleForm, preco: Number(value) })} />
                    </div>
                    <FormInput label="Imagem" placeholder="uploads/mota.jpg ou https://..." value={motorcycleForm.imagem} onChange={(value) => setMotorcycleForm({ ...motorcycleForm, imagem: value })} />
                    <div className="grid grid-cols-2 gap-3">
                      <FormInput label="Cilindrada" type="number" value={motorcycleForm.cilindrada} onChange={(value) => setMotorcycleForm({ ...motorcycleForm, cilindrada: Number(value) })} />
                      <FormInput label="Potencia" type="number" value={motorcycleForm.potencia} onChange={(value) => setMotorcycleForm({ ...motorcycleForm, potencia: Number(value) })} />
                      <FormInput label="Km" type="number" value={motorcycleForm.quilometragem} onChange={(value) => setMotorcycleForm({ ...motorcycleForm, quilometragem: Number(value) })} />
                      <FormInput label="Horas" type="number" value={motorcycleForm.horas} onChange={(value) => setMotorcycleForm({ ...motorcycleForm, horas: Number(value) })} />
                    </div>
                    <FormInput label="Extras" placeholder="ABS,TCS,Quickshifter" value={motorcycleForm.extras} onChange={(value) => setMotorcycleForm({ ...motorcycleForm, extras: value })} />
                    <div className="space-y-2">
                      <Label>Descricao</Label>
                      <Textarea value={motorcycleForm.descricao} onChange={(event) => setMotorcycleForm({ ...motorcycleForm, descricao: event.target.value })} />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" disabled={saving}>
                        {editingMotorcycleId ? <Save className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                        {editingMotorcycleId ? "Guardar" : "Adicionar"}
                      </Button>
                      {editingMotorcycleId && (
                        <Button type="button" variant="outline" onClick={resetMotorcycleForm}>
                          <X className="w-4 h-4 mr-2" />
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <InventoryTable loading={loading} emptyText="Ainda nao existem motas.">
                {motorcycles.map((motorcycle) => (
                  <TableRow key={motorcycle.id}>
                    <TableCell>
                      <div className="font-medium">{motorcycle.marca} {motorcycle.modelo}</div>
                      <div className="text-sm text-gray-500">{motorcycle.ano}</div>
                    </TableCell>
                    <TableCell><Badge variant="outline">{motorcycle.tipo}</Badge></TableCell>
                    <TableCell>EUR {Number(motorcycle.preco).toFixed(2)}</TableCell>
                    <TableCell>{motorcycle.quilometragem || 0} km</TableCell>
                    <TableCell className="text-right">
                      <RowActions onEdit={() => editMotorcycle(motorcycle)} onDelete={() => deleteMotorcycle(motorcycle.id)} />
                    </TableCell>
                  </TableRow>
                ))}
              </InventoryTable>
            </div>
          ) : (
            <div className="grid lg:grid-cols-[380px_1fr] gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{editingPartId ? "Editar peça" : "Adicionar peça"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={savePart} className="space-y-4">
                    <FormInput label="Nome" value={partForm.nome} onChange={(value) => setPartForm({ ...partForm, nome: value })} />
                    <div className="grid grid-cols-2 gap-3">
                      <FormSelect
                        label="Categoria"
                        placeholder="Escolher categoria"
                        value={partForm.categoria}
                        options={partCategories}
                        onChange={(value) => setPartForm({ ...partForm, categoria: value })}
                      />
                      <FormInput label="Referencia" value={partForm.referencia} onChange={(value) => setPartForm({ ...partForm, referencia: value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <FormInput label="Preco" type="number" value={partForm.preco} onChange={(value) => setPartForm({ ...partForm, preco: Number(value) })} />
                      <FormInput label="Stock" type="number" value={partForm.stock} onChange={(value) => setPartForm({ ...partForm, stock: Number(value) })} />
                    </div>
                    <FormInput label="Imagem" placeholder="brembo.jpg ou https://..." value={partForm.imagem} onChange={(value) => setPartForm({ ...partForm, imagem: value })} />
                    <div className="flex gap-2">
                      <Button type="submit" disabled={saving}>
                        {editingPartId ? <Save className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                        {editingPartId ? "Guardar" : "Adicionar"}
                      </Button>
                      {editingPartId && (
                        <Button type="button" variant="outline" onClick={resetPartForm}>
                          <X className="w-4 h-4 mr-2" />
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <InventoryTable loading={loading} emptyText="Ainda nao existem peças.">
                {parts.map((part) => (
                  <TableRow key={part.idpeca || part.id}>
                    <TableCell>
                      <div className="font-medium">{part.nome}</div>
                      <div className="text-sm text-gray-500">{part.referencia || "Sem referencia"}</div>
                    </TableCell>
                    <TableCell><Badge variant="outline">{part.categoria}</Badge></TableCell>
                    <TableCell>EUR {Number(part.preco).toFixed(2)}</TableCell>
                    <TableCell>{part.stock}</TableCell>
                    <TableCell className="text-right">
                      <RowActions onEdit={() => editPart(part)} onDelete={() => deletePart(part.idpeca || part.id)} />
                    </TableCell>
                  </TableRow>
                ))}
              </InventoryTable>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function FormInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder
}: {
  label: string;
  value: string | number | undefined;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        type={type}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

function FormSelect({
  label,
  value,
  options,
  onChange,
  placeholder
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function InventoryTable({
  children,
  loading,
  emptyText
}: {
  children: ReactNode;
  loading: boolean;
  emptyText: string;
}) {
  const hasRows = Array.isArray(children) ? children.length > 0 : Boolean(children);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Itens atuais</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preco</TableHead>
              <TableHead>Stock/Km</TableHead>
              <TableHead className="text-right">Acoes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">A carregar...</TableCell>
              </TableRow>
            ) : hasRows ? (
              children
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">{emptyText}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex justify-end gap-2">
      <Button size="icon" variant="ghost" onClick={onEdit}>
        <Pencil className="w-4 h-4" />
      </Button>
      <Button size="icon" variant="ghost" className="text-red-600" onClick={onDelete}>
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
