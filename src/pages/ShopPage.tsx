import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Search, SlidersHorizontal, Heart, Eye } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner@2.0.3";

const motorcycles = [
  {
    id: 1,
    name: "Honda CB 500F",
    category: "Sport",
    price: 7500,
    year: 2021,
    km: 12000,
    image: "https://images.unsplash.com/photo-1558980664-10e7170b5df9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydCUyMG1vdG9yY3ljbGUlMjBzaG93cm9vbXxlbnwxfHx8fDE3NjAxMTMxNDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    specs: ["500cc", "47cv", "ABS"],
    condition: "Seminova"
  },
  {
    id: 2,
    name: "Yamaha MT-07",
    category: "Sport",
    price: 8200,
    year: 2022,
    km: 8500,
    image: "https://images.unsplash.com/photo-1558980664-10e7170b5df9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydCUyMG1vdG9yY3ljbGUlMjBzaG93cm9vbXxlbnwxfHx8fDE3NjAxMTMxNDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    specs: ["689cc", "75cv", "ABS"],
    condition: "Seminova"
  },
  {
    id: 3,
    name: "Kawasaki Ninja 650",
    category: "Sport",
    price: 9500,
    year: 2023,
    km: 3000,
    image: "https://images.unsplash.com/photo-1558980664-10e7170b5df9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydCUyMG1vdG9yY3ljbGUlMjBzaG93cm9vbXxlbnwxfHx8fDE3NjAxMTMxNDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    specs: ["649cc", "68cv", "ABS", "TCS"],
    condition: "Como Nova"
  },
  {
    id: 4,
    name: "Harley-Davidson Street 750",
    category: "Cruiser",
    price: 8900,
    year: 2020,
    km: 15000,
    image: "https://images.unsplash.com/photo-1671272971942-cafd81c70e68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcnVpc2VyJTIwbW90b3JjeWNsZXxlbnwxfHx8fDE3NjAxMTMxNDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    specs: ["749cc", "53cv", "ABS"],
    condition: "Seminova"
  },
  {
    id: 5,
    name: "BMW F 850 GS",
    category: "Adventure",
    price: 12500,
    year: 2022,
    km: 18000,
    image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZHZlbnR1cmUlMjBtb3RvcmN5Y2xlfGVufDF8fHx8MTc2MDExMzE1MHww&ixlib=rb-4.1.0&q=80&w=1080",
    specs: ["853cc", "95cv", "ABS", "TCS", "Quickshifter"],
    condition: "Seminova"
  },
  {
    id: 6,
    name: "Honda Gold Wing",
    category: "Touring",
    price: 18500,
    year: 2021,
    km: 22000,
    image: "https://images.unsplash.com/photo-1598808503491-01d81d8f6b0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3VyaW5nJTIwbW90b3JjeWNsZXxlbnwxfHx8fDE3NjAxMTMxNTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    specs: ["1833cc", "126cv", "DCT", "Airbag", "Navegação"],
    condition: "Seminova"
  }
];

export function ShopPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [favorites, setFavorites] = useState<number[]>([]);

  const filteredMotorcycles = motorcycles.filter(moto => {
    const matchesSearch = moto.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || moto.category === categoryFilter;
    const matchesPrice = 
      priceFilter === "all" ||
      (priceFilter === "low" && moto.price < 8000) ||
      (priceFilter === "medium" && moto.price >= 8000 && moto.price < 12000) ||
      (priceFilter === "high" && moto.price >= 12000);
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(fav => fav !== id));
      toast.success("Removido dos favoritos");
    } else {
      setFavorites([...favorites, id]);
      toast.success("Adicionado aos favoritos");
    }
  };

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
            <h1 className="text-white mb-4">Loja de Motas</h1>
            <p className="text-blue-100 max-w-2xl">
              Encontre a mota perfeita para si. Todas as nossas motas são cuidadosamente 
              inspecionadas e vêm com garantia.
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
                placeholder="Pesquisar motas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                <SelectItem value="Sport">Sport</SelectItem>
                <SelectItem value="Cruiser">Cruiser</SelectItem>
                <SelectItem value="Adventure">Adventure</SelectItem>
                <SelectItem value="Touring">Touring</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Preço" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Preços</SelectItem>
                <SelectItem value="low">Até €8.000</SelectItem>
                <SelectItem value="medium">€8.000 - €12.000</SelectItem>
                <SelectItem value="high">Acima de €12.000</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Motorcycles Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-gray-600">
              {filteredMotorcycles.length} {filteredMotorcycles.length === 1 ? 'mota encontrada' : 'motas encontradas'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMotorcycles.map((moto, index) => (
              <motion.div
                key={moto.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative group">
                    <ImageWithFallback
                      src={moto.image}
                      alt={moto.name}
                      className="w-full h-56 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-full"
                        onClick={() => toggleFavorite(moto.id)}
                      >
                        <Heart 
                          className={`w-5 h-5 ${favorites.includes(moto.id) ? 'fill-red-500 text-red-500' : ''}`} 
                        />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-full"
                      >
                        <Eye className="w-5 h-5" />
                      </Button>
                    </div>
                    <Badge className="absolute top-4 right-4">
                      {moto.condition}
                    </Badge>
                  </div>

                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{moto.name}</CardTitle>
                        <CardDescription>{moto.category}</CardDescription>
                      </div>
                      <Badge variant="outline">{moto.year}</Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {moto.specs.map((spec, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">
                        {moto.km.toLocaleString('pt-PT')} km
                      </div>
                      <div className="text-blue-600 text-xl">
                        €{moto.price.toLocaleString('pt-PT')}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="gap-2">
                    <Button className="flex-1" onClick={() => toast.success("Contactaremos em breve!")}>
                      Contactar
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Ver Detalhes
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredMotorcycles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">Nenhuma mota encontrada com esses critérios.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
