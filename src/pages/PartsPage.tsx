import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Search, ShoppingCart, Plus, Minus, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner@2.0.3";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../components/ui/sheet";
import { Separator } from "../components/ui/separator";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const parts = [
  {
    id: 1,
    name: "Pastilhas de Travão Brembo",
    category: "Travões",
    price: 45.99,
    stock: 12,
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwcGFydHMlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAxMTMxNTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    brand: "Brembo"
  },
  {
    id: 2,
    name: "Filtro de Óleo K&N",
    category: "Motor",
    price: 18.50,
    stock: 25,
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwcGFydHMlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAxMTMxNTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    brand: "K&N"
  },
  {
    id: 3,
    name: "Corrente DID 520",
    category: "Transmissão",
    price: 89.90,
    stock: 8,
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwcGFydHMlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAxMTMxNTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    brand: "DID"
  },
  {
    id: 4,
    name: "Pneu Michelin Road 5",
    category: "Pneus",
    price: 145.00,
    stock: 15,
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwcGFydHMlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAxMTMxNTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    brand: "Michelin"
  },
  {
    id: 5,
    name: "Óleo Motul 7100 10W40",
    category: "Lubrificantes",
    price: 52.90,
    stock: 30,
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwcGFydHMlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAxMTMxNTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    brand: "Motul"
  },
  {
    id: 6,
    name: "Velas de Ignição NGK",
    category: "Motor",
    price: 12.50,
    stock: 40,
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwcGFydHMlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAxMTMxNTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    brand: "NGK"
  }
];

export function PartsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const filteredParts = parts.filter(part => {
    const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || part.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (part: typeof parts[0]) => {
    const existingItem = cart.find(item => item.id === part.id);
    
    if (existingItem) {
      if (existingItem.quantity < part.stock) {
        setCart(cart.map(item =>
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
    const item = cart.find(item => item.id === id);
    const part = parts.find(p => p.id === id);
    
    if (!item || !part) return;

    const newQuantity = item.quantity + delta;

    if (newQuantity <= 0) {
      removeFromCart(id);
    } else if (newQuantity <= part.stock) {
      setCart(cart.map(item =>
        item.id === id
          ? { ...item, quantity: newQuantity }
          : item
      ));
    } else {
      toast.error("Stock insuficiente");
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
    toast.success("Removido do carrinho");
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-white mb-4">Loja de Peças</h1>
            <p className="text-blue-100 max-w-2xl">
              Encontre todas as peças e acessórios que precisa para a sua mota. 
              Só trabalhamos com marcas de confiança.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b sticky top-[73px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Pesquisar peças..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                <SelectItem value="Travões">Travões</SelectItem>
                <SelectItem value="Motor">Motor</SelectItem>
                <SelectItem value="Transmissão">Transmissão</SelectItem>
                <SelectItem value="Pneus">Pneus</SelectItem>
                <SelectItem value="Lubrificantes">Lubrificantes</SelectItem>
              </SelectContent>
            </Select>

            <Sheet open={cartOpen} onOpenChange={setCartOpen}>
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
                  <SheetTitle>Carrinho de Compras</SheetTitle>
                  <SheetDescription>
                    {cartItemsCount} {cartItemsCount === 1 ? 'item' : 'itens'} no carrinho
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-8 flex flex-col h-full">
                  <div className="flex-1 overflow-y-auto">
                    {cart.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        O seu carrinho está vazio
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
                                <p className="text-blue-600 mb-2">€{item.price.toFixed(2)}</p>
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
                        <span className="text-gray-900">€{cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mb-4">
                        <span className="text-gray-600">IVA (23%)</span>
                        <span className="text-gray-900">€{(cartTotal * 0.23).toFixed(2)}</span>
                      </div>
                      <Separator className="my-4" />
                      <div className="flex justify-between mb-6">
                        <span>Total</span>
                        <span className="text-blue-600">€{(cartTotal * 1.23).toFixed(2)}</span>
                      </div>
                      <Button 
                        className="w-full" 
                        size="lg"
                        onClick={() => {
                          toast.success("Encomenda enviada! Entraremos em contacto em breve.");
                          setCart([]);
                          setCartOpen(false);
                        }}
                      >
                        Finalizar Encomenda
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </section>

      {/* Parts Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-gray-600">
              {filteredParts.length} {filteredParts.length === 1 ? 'peça encontrada' : 'peças encontradas'}
            </p>
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
                    <div className="flex items-start justify-between">
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
                        <span className="text-blue-600 text-xl">€{part.price.toFixed(2)}</span>
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
                      {part.stock > 0 ? 'Adicionar ao Carrinho' : 'Sem Stock'}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredParts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">Nenhuma peça encontrada com esses critérios.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
