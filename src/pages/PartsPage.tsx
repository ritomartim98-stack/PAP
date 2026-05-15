import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Search, ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../components/ui/sheet";
import { Separator } from "../components/ui/separator";

interface Part {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  brand: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export function PartsPage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [loadingParts, setLoadingParts] = useState(true);
  const [partsError, setPartsError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutMode, setCheckoutMode] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    fetch("http://localhost:3001/api/pecas", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao buscar peças");
        }

        return response.json();
      })
      .then((data: Part[]) => {
        setParts(data);
        setPartsError("");
      })
      .catch((error) => {
        console.error("Error fetching parts:", error);
        setPartsError("Nao foi possivel carregar as peças da base de dados.");
      })
      .finally(() => {
        setLoadingParts(false);
      });
  }, []);

  const categories = Array.from(new Set(parts.map((part) => part.category))).filter(Boolean);
  const filteredParts = parts.filter((part) => {
    const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || part.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (part: Part) => {
    const existingItem = cart.find((item) => item.id === part.id);

    if (existingItem) {
      if (existingItem.quantity < part.stock) {
        setCart(cart.map((item) =>
          item.id === part.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
        toast.success("Quantidade atualizada no carrinho");
      } else {
        toast.error("Stock insuficiente");
      }
    } else {
      setCart([...cart, {
        id: part.id,
        name: part.name,
        price: part.price,
        quantity: 1,
        image: part.image
      }]);
      toast.success("Adicionado ao carrinho");
    }
  };

  const updateQuantity = (id: number, delta: number) => {
    const item = cart.find((item) => item.id === id);
    const part = parts.find((part) => part.id === id);

    if (!item || !part) return;

    const newQuantity = item.quantity + delta;

    if (newQuantity <= 0) {
      removeFromCart(id);
    } else if (newQuantity <= part.stock) {
      setCart(cart.map((item) =>
        item.id === id
          ? { ...item, quantity: newQuantity }
          : item
      ));
    } else {
      toast.error("Stock insuficiente");
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
    toast.success("Removido do carrinho");
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const orderTotal = cartTotal * 1.23;

  const openCheckout = () => {
    setCheckoutMode(true);
  };

  const handleCheckout = async (event: FormEvent) => {
    event.preventDefault();

    if (!checkoutForm.name || !checkoutForm.email || !checkoutForm.phone || !checkoutForm.address) {
      toast.error("Preencha todos os dados pessoais.");
      return;
    }

    try {
      setCheckoutLoading(true);

      const response = await fetch("http://localhost:3001/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: checkoutForm,
          items: cart
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Nao foi possivel finalizar a compra.");
      }

      toast.success("Compra finalizada! Enviamos a confirmacao para o seu email.");
      setCart([]);
      setCartOpen(false);
      setCheckoutMode(false);
      setCheckoutForm({ name: "", email: "", phone: "", address: "" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Nao foi possivel finalizar a compra.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl text-white mb-4">Loja de Peças</h1>
            <p className="text-green-100 max-w-2xl">
              Encontre todas as peças e acessorios que precisa para a sua mota.
              So trabalhamos com marcas de confianca.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-white border-b sticky top-[73px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Pesquisar peças..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Sheet
              open={cartOpen}
              onOpenChange={(open) => {
                setCartOpen(open);
                if (!open) {
                  setCheckoutMode(false);
                }
              }}
            >
              <SheetTrigger asChild>
                <Button className="relative">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Carrinho
                  {cartItemsCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0">
                      {cartItemsCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle>{checkoutMode ? "Dados para entrega" : "Carrinho de Compras"}</SheetTitle>
                  <SheetDescription>
                    {checkoutMode
                      ? "Preencha os seus dados para concluir a compra e receber a confirmacao por email."
                      : `${cartItemsCount} ${cartItemsCount === 1 ? "item" : "itens"} no carrinho`}
                  </SheetDescription>
                </SheetHeader>

                {checkoutMode ? (
                  <form onSubmit={handleCheckout} className="mt-8 flex h-full flex-col space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nome</Label>
                        <Input
                          value={checkoutForm.name}
                          onChange={(event) => setCheckoutForm({ ...checkoutForm, name: event.target.value })}
                          placeholder="O seu nome"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Telemovel</Label>
                        <Input
                          value={checkoutForm.phone}
                          onChange={(event) => setCheckoutForm({ ...checkoutForm, phone: event.target.value })}
                          placeholder="912 345 678"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={checkoutForm.email}
                        onChange={(event) => setCheckoutForm({ ...checkoutForm, email: event.target.value })}
                        placeholder="email@exemplo.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Morada</Label>
                      <Input
                        value={checkoutForm.address}
                        onChange={(event) => setCheckoutForm({ ...checkoutForm, address: event.target.value })}
                        placeholder="Rua, numero, codigo postal e localidade"
                      />
                    </div>

                    <div className="rounded-lg bg-gray-50 p-4 text-sm">
                      <div className="flex justify-between text-gray-600 mb-2">
                        <span>Subtotal</span>
                        <span>EUR {cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600 mb-2">
                        <span>IVA (23%)</span>
                        <span>EUR {(cartTotal * 0.23).toFixed(2)}</span>
                      </div>
                      <Separator className="my-3" />
                      <div className="flex justify-between font-semibold text-gray-900">
                        <span>Total</span>
                        <span>EUR {orderTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="mt-auto flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                      <Button type="button" variant="outline" onClick={() => setCheckoutMode(false)}>
                        Voltar ao carrinho
                      </Button>
                      <Button type="submit" disabled={checkoutLoading}>
                        {checkoutLoading ? "A finalizar..." : "Confirmar compra"}
                      </Button>
                    </div>
                  </form>
                ) : (
                <div className="mt-8 flex flex-col h-full">
                  <div className="flex-1 overflow-y-auto">
                    {cart.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        O seu carrinho esta vazio
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <AnimatePresence>
                          {cart.map((item) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="flex gap-4 bg-gray-50 p-4 rounded-lg"
                            >
                              <ImageWithFallback
                                src={item.image}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded"
                              />
                              <div className="flex-1">
                                <h4 className="text-gray-900 mb-1">{item.name}</h4>
                                <p className="text-blue-600 mb-2">EUR {item.price.toFixed(2)}</p>
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-8 w-8"
                                    onClick={() => updateQuantity(item.id, -1)}
                                  >
                                    <Minus className="w-4 h-4" />
                                  </Button>
                                  <span className="w-8 text-center">{item.quantity}</span>
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-8 w-8"
                                    onClick={() => updateQuantity(item.id, 1)}
                                  >
                                    <Plus className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 ml-auto text-red-600"
                                    onClick={() => removeFromCart(item.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>

                  {cart.length > 0 && (
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between mb-4">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="text-gray-900">EUR {cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mb-4">
                        <span className="text-gray-600">IVA (23%)</span>
                        <span className="text-gray-900">EUR {(cartTotal * 0.23).toFixed(2)}</span>
                      </div>
                      <Separator className="my-4" />
                      <div className="flex justify-between mb-6">
                        <span>Total</span>
                        <span className="text-blue-600">EUR {orderTotal.toFixed(2)}</span>
                      </div>
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={openCheckout}
                      >
                        Finalizar Encomenda
                      </Button>
                    </div>
                  )}
                </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-gray-600">
              {loadingParts
                ? "A carregar peças..."
                : `${filteredParts.length} ${filteredParts.length === 1 ? "peça encontrada" : "peças encontradas"}`}
            </p>
            {partsError && (
              <p className="text-red-600 mt-2">{partsError}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredParts.map((part, index) => (
              <motion.div
                key={part.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <ImageWithFallback
                    src={part.image}
                    alt={part.name}
                    className="w-full h-48 object-cover"
                  />

                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{part.name}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{part.brand}</p>
                      </div>
                      <Badge variant="outline">{part.category}</Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-blue-600 text-xl">EUR {part.price.toFixed(2)}</span>
                        <span className="text-sm text-gray-600">
                          Stock: {part.stock}
                        </span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => addToCart(part)}
                      disabled={part.stock === 0}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {part.stock > 0 ? "Adicionar ao Carrinho" : "Sem Stock"}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>

          {!loadingParts && filteredParts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">Nenhuma peça encontrada com esses criterios.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
