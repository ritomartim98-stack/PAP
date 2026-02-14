import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { ArrowLeft, Heart, Share2, Phone, Mail, MapPin, Calendar, Gauge, Fuel, Cog, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Separator } from "../components/ui/separator";

interface MotorcycleDetailPageProps {
  motorcycleId: number;
  onNavigate: (page: string, motorcycleId?: number) => void;
}

interface Motorcycle {
  id: number;
  name: string;
  category: string;
  price: number;
  year: number;
  km?: number;
  horas?: number;
  image: string;
  specs: string[];
  condition: string;
  description: string;
  images: string[];
  fuel: string;
  transmission: string;
  color: string;
  owners: number;
}

// Dados das motas (mesmo array do ShopPage)
const motorcycles: Motorcycle[] = [
  {
    id: 1,
    name: "Yamaha YZ125 ",
    category: "motocross",
    price: 8200,
    year: 2025,
    horas: 0,
    image: "https://cdpcdn.dx1app.com/products/USA/YA/2025/MC/MX/YZ125/50/MONSTER_ENERGY_YAMAHA_RACING_EDITION/2000000001.jpg",
    specs: ["125cc", "35cv", ],
    condition: "nova",
    description: "Algumas corridas são ganhas antes mesmo de cair a grelha de partida, e a mais recente YZ125 dá-lhe a vantagem para fazer isso. A Yamaha fabrica e compete com motos de motocross a 2 tempos há mais de 50 anos. Esta experiência inigualável permitiu à empresa melhorar mais uma vez a mais recente YZ125 e convertê-la numa moto criada para o levar ao lugar mais alto do pódio.",
    images: [
      "https://cdpcdn.dx1app.com/products/USA/YA/2025/MC/MX/YZ125/50/MONSTER_ENERGY_YAMAHA_RACING_EDITION/2000000002.jpg",
      "https://cdpcdn.dx1app.com/products/USA/YA/2025/MC/MX/YZ125/50/MONSTER_ENERGY_YAMAHA_RACING_EDITION/2000000003.jpg",
      "https://cdpcdn.dx1app.com/products/USA/YA/2025/MC/MX/YZ125/50/MONSTER_ENERGY_YAMAHA_RACING_EDITION/2000000004.jpg",
      "https://cdpcdn.dx1app.com/products/USA/YA/2025/MC/MX/YZ125/50/MONSTER_ENERGY_YAMAHA_RACING_EDITION/2000000005.jpg",
      "https://cdpcdn.dx1app.com/products/USA/YA/2025/MC/MX/YZ125/50/MONSTER_ENERGY_YAMAHA_RACING_EDITION/2000000006.jpg"
        ],
    fuel: "Gasolina",
    transmission: "Manual 6 velocidades",
    color: "Azul",
    owners: 1
  },
  {
    id: 2,
    name: "Yamaha YZ125 Monster Energy Edition",
    category: "Motocross",
    price: 8500,
    year: 2025,
    horas: 0,
    image: "https://cdpcdn.dx1app.com/products/USA/YA/2025/MC/MX/YZ125_MONSTER_ENERGY_EDITION/50/MONSTER_ENERGY_YAMAHA_RACING_EDITION/2000000001.jpg",
    specs: ["125cc", "35cv"],
    condition: "Nova",
    description: "A Yamaha fabrica motos de motocross a 2 tempos há 50 anos e tem uma história igualmente longa na competição. Foi esta experiência sem paralelo que permitiu à empresa desenvolver a mais recente YZ125 Monster Energy Yamaha Racing Edition: uma moto fabricada para o levar à victorYZone!",
    images: [
      "https://cdpcdn.dx1app.com/products/USA/YA/2025/MC/MX/YZ125_MONSTER_ENERGY_EDITION/50/MONSTER_ENERGY_YAMAHA_RACING_EDITION/2000000001.jpg",
      "https://cdpcdn.dx1app.com/products/USA/YA/2025/MC/MX/YZ125_MONSTER_ENERGY_EDITION/50/MONSTER_ENERGY_YAMAHA_RACING_EDITION/2000000002.jpg",
      "https://cdpcdn.dx1app.com/products/USA/YA/2025/MC/MX/YZ125_MONSTER_ENERGY_EDITION/50/MONSTER_ENERGY_YAMAHA_RACING_EDITION/2000000003.jpg"
    ],
    fuel: "Gasolina",
    transmission: "Manual 6 velocidades",
    color: "Preto",
    owners: 1
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
    condition: "Como Nova",
    description: "A Kawasaki Ninja 650 combina o estilo desportivo das supersport com a praticidade de uma mota de uso diário. Equipada com ABS e controlo de tração, oferece segurança e confiança em todas as condições. Praticamente nova, com apenas 3.000 km.",
    images: [
      "https://images.unsplash.com/photo-1558980664-10e7170b5df9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
      "https://images.unsplash.com/photo-1558980664-3a031cf67ea8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
    ],
    fuel: "Gasolina",
    transmission: "Manual 6 velocidades",
    color: "Verde Kawasaki",
    owners: 1
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
    condition: "Seminova",
    description: "A Harley-Davidson Street 750 é a porta de entrada para o mundo Harley. Com o icónico motor V-Twin refrigerado a líquido, oferece o som e a sensação característicos da marca. Posição de condução relaxada e estilo inconfundível.",
    images: [
      "https://images.unsplash.com/photo-1671272971942-cafd81c70e68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
      "https://images.unsplash.com/photo-1558980664-10e7170b5df9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
    ],
    fuel: "Gasolina",
    transmission: "Manual 6 velocidades",
    color: "Preto Fosco",
    owners: 2
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
    condition: "Seminova",
    description: "A BMW F 850 GS é uma verdadeira adventure pronta para qualquer desafio. Motor bicilíndrico paralelo de 853cc com 95cv, suspensões de longo curso e eletrónica completa. Equipada com quickshifter, ABS Pro e modos de condução. Perfeita para viagens e todo-o-terreno.",
    images: [
      "https://images.unsplash.com/photo-1609630875171-b1321377ee65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
      "https://images.unsplash.com/photo-1558980664-10e7170b5df9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
    ],
    fuel: "Gasolina",
    transmission: "Manual 6 velocidades",
    color: "Branco/Azul",
    owners: 1
  },
  {
    id: 6,
    name: "Honda Gold Wing",
    category: "Touring",
    price: 18500,
    year: 2021,
    km: 22000,
    image: "https://images.unsplash.com/photo-1558980664-10e7170b5df9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    specs: ["1833cc", "126cv", "DCT", "Airbag", "Navegação"],
    condition: "Seminova",
    description: "A Honda Gold Wing é o topo de gama das motas de turismo. Motor flat-six de 1833cc, transmissão DCT (automática), airbag, sistema de navegação integrado e conforto incomparável. Perfeita para grandes viagens com passageiro e bagagem.",
    images: [
      "https://images.unsplash.com/photo-1558980664-10e7170b5df9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
      "https://images.unsplash.com/photo-1558980664-3a031cf67ea8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
    ],
    fuel: "Gasolina",
    transmission: "DCT (Automática)",
    color: "Vermelho",
    owners: 1
  }
];

export function MotorcycleDetailPage({ motorcycleId, onNavigate }: MotorcycleDetailPageProps) {
  const motorcycle = motorcycles.find(m => m.id === motorcycleId);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play slider
  useEffect(() => {
    if (!motorcycle || !isAutoPlaying) return;

    const interval = setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % motorcycle.images.length);
    }, 2000); // Muda a cada 2 segundos

    return () => clearInterval(interval);
  }, [motorcycle, isAutoPlaying]);

  if (!motorcycle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Mota não encontrada</h2>
          <Button onClick={() => onNavigate("shop")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar à Loja
          </Button>
        </div>
      </div>
    );
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos");
  };

  const handleShare = () => {
    toast.success("Link copiado para a área de transferência!");
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % motorcycle.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + motorcycle.images.length) % motorcycle.images.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b sticky top-[73px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button variant="ghost" onClick={() => onNavigate("shop")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar à Loja
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div 
                  className="relative group"
                  onMouseEnter={() => setIsAutoPlaying(false)}
                  onMouseLeave={() => setIsAutoPlaying(true)}
                >
                  {/* Imagem Principal com Animação */}
                  <div className="relative h-[500px] overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={selectedImage}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0"
                      >
                        <ImageWithFallback
                          src={motorcycle.images[selectedImage]}
                          alt={`${motorcycle.name} - Imagem ${selectedImage + 1}`}
                          className="w-full h-[500px] object-cover"
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Badge de Condição */}
                  <Badge className="absolute top-4 right-4 z-10">
                    {motorcycle.condition}
                  </Badge>

                  {/* Botões de Navegação */}
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
                    aria-label="Imagem anterior"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
                    aria-label="Próxima imagem"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Indicadores de Posição */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                    {motorcycle.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          selectedImage === idx 
                            ? "bg-white w-8" 
                            : "bg-white/50 hover:bg-white/75"
                        }`}
                        aria-label={`Ir para imagem ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Miniaturas */}
                <div className="grid grid-cols-3 gap-2 p-4">
                  {motorcycle.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === idx ? "border-blue-600 scale-95" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <ImageWithFallback
                        src={img}
                        alt={`${motorcycle.name} - Miniatura ${idx + 1}`}
                        className="w-full h-24 object-cover"
                      />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl">{motorcycle.name}</CardTitle>
                    <CardDescription className="text-lg mt-2">{motorcycle.category}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="outline" onClick={toggleFavorite}>
                      <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                    <Button size="icon" variant="outline" onClick={handleShare}>
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Price */}
                <div>
                  <p className="text-4xl font-bold text-blue-600">
                    €{motorcycle.price.toLocaleString('pt-PT')}
                  </p>
                </div>

                <Separator />

                {/* Description */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">Descrição</h3>
                  <p className="text-gray-600 leading-relaxed">{motorcycle.description}</p>
                </div>

                <Separator />

                {/* Specifications */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">Especificações</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Ano</p>
                        <p className="font-semibold">{motorcycle.year}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Gauge className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">{motorcycle.km !== undefined ? 'Quilómetros' : 'Horas'}</p>
                        <p className="font-semibold">
                          {motorcycle.km !== undefined 
                            ? `${motorcycle.km.toLocaleString('pt-PT')} km` 
                            : `${motorcycle.horas} horas`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Fuel className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Combustível</p>
                        <p className="font-semibold">{motorcycle.fuel}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Cog className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Transmissão</p>
                        <p className="font-semibold">{motorcycle.transmission}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Features */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Características</h3>
                  <div className="flex flex-wrap gap-2">
                    {motorcycle.specs.map((spec, idx) => (
                      <Badge key={idx} variant="secondary">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Additional Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Cor</p>
                    <p className="font-semibold">{motorcycle.color}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Proprietários</p>
                    <p className="font-semibold">{motorcycle.owners}</p>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex-col gap-3">
                <Button className="w-full" size="lg" onClick={() => toast.success("Contactaremos em breve!")}>
                  <Phone className="w-4 h-4 mr-2" />
                  Contactar Vendedor
                </Button>
                <div className="flex gap-2 w-full">
                  <Button variant="outline" className="flex-1" onClick={() => onNavigate("booking")}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Agendar Visita
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => onNavigate("contact")}>
                    <Mail className="w-4 h-4 mr-2" />
                    Enviar Email
                  </Button>
                </div>
              </CardFooter>
            </Card>

            {/* Location Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Localização
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Oficina de Mecânica - Batalha, Portugal</p>
                <p className="text-sm text-gray-500 mt-2">
                  Visite-nos para ver esta mota pessoalmente e fazer um test drive.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}