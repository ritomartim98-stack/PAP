import { API_BASE_URL } from "../lib/api";

export { API_BASE_URL };
export const DEFAULT_MOTORCYCLE_IMAGE =
  "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1080&q=80";

const uploadImage = (fileName: string) => `${API_BASE_URL}/uploads/${fileName}`;

export interface Motorcycle {
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

export const fallbackMotorcycles: Motorcycle[] = [
  {
    id: 1,
    name: "Yamaha YZ 125",
    category: "Motocross",
    price: 8200,
    year: 2025,
    horas: 0,
    image: uploadImage("yz125.jpg"),
    specs: ["125cc", "35cv"],
    condition: "Nova",
    description: "Mota nova de motocross, leve e potente.",
    images: [uploadImage("yz125.jpg")],
    fuel: "Gasolina",
    transmission: "Manual",
    color: "Azul",
    owners: 0
  },
  {
    id: 2,
    name: "Yamaha YZ125 Monster Energy Edition",
    category: "Motocross",
    price: 8500,
    year: 2025,
    horas: 0,
    image: uploadImage("yz125_monster.jpg"),
    specs: ["125cc", "35cv"],
    condition: "Nova",
    description: "Edição especial Monster Energy.",
    images: [uploadImage("yz125_monster.jpg")],
    fuel: "Gasolina",
    transmission: "Manual",
    color: "Preto",
    owners: 0
  },
  {
    id: 3,
    name: "Yamaha TMAX Tech MAX",
    category: "Sport",
    price: 15700,
    year: 2025,
    km: 0,
    image: uploadImage("tmax.jpg"),
    specs: ["560cc", "47cv", "ABS"],
    condition: "Nova",
    description: "Scooter topo de gama com tecnologia avançada.",
    images: [uploadImage("tmax.jpg")],
    fuel: "Gasolina",
    transmission: "Automática",
    color: "Cinza",
    owners: 0
  },
  {
    id: 4,
    name: "Harley-Davidson Street 750",
    category: "Cruiser",
    price: 8900,
    year: 2020,
    km: 15000,
    image: uploadImage("harley750.jpg"),
    specs: ["749cc", "53cv", "ABS"],
    condition: "Usada",
    description: "Mota confortável ideal para estrada.",
    images: [uploadImage("harley750.jpg")],
    fuel: "Gasolina",
    transmission: "Manual",
    color: "Preto",
    owners: 1
  },
  {
    id: 5,
    name: "BMW F 850 GS",
    category: "Adventure",
    price: 12500,
    year: 2022,
    km: 18000,
    image: uploadImage("bmw850gs.jpg"),
    specs: ["853cc", "95cv", "ABS", "TCS", "Quickshifter"],
    condition: "Usada",
    description: "Perfeita para aventura e longas viagens.",
    images: [uploadImage("bmw850gs.jpg")],
    fuel: "Gasolina",
    transmission: "Manual",
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
    image: uploadImage("goldwing.jpg"),
    specs: ["1833cc", "125cv", "DCT", "Airbag", "Navegação"],
    condition: "Usada",
    description: "Luxo e conforto máximo para viagens.",
    images: [uploadImage("goldwing.jpg")],
    fuel: "Gasolina",
    transmission: "DCT (Automática)",
    color: "Vermelho",
    owners: 1
  }
];

export const motorcycles = fallbackMotorcycles;
