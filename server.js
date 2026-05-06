import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const dbPath = path.join(__dirname, 'motorcycles.db');
const db = new sqlite3.Database(dbPath);

// Initialize database
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS motorcycles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    year INTEGER NOT NULL,
    km INTEGER,
    horas INTEGER,
    image TEXT NOT NULL,
    specs TEXT NOT NULL,
    condition TEXT NOT NULL,
    description TEXT,
    images TEXT,
    fuel TEXT,
    transmission TEXT,
    color TEXT,
    owners INTEGER
  )`);

  // Insert initial data if table is empty
  db.get("SELECT COUNT(*) as count FROM motorcycles", (err, row) => {
    if (err) {
      console.error(err);
      return;
    }
    if (row.count === 0) {
      const initialData = [
        {
          name: "Yamaha Yz 125 2025",
          category: "motocross",
          price: 8200,
          year: 2025,
          horas: 0,
          image: "https://cdpcdn.dx1app.com/products/USA/YA/2025/MC/MX/YZ125/50/MONSTER_ENERGY_YAMAHA_RACING_EDITION/2000000001.jpg",
          specs: '["125cc", "35cv"]',
          condition: "nova",
          description: "Algumas corridas são ganhas antes mesmo de cair a grelha de partida, e a mais recente YZ125 dá-lhe a vantagem para fazer isso. A Yamaha fabrica e compete com motos de motocross a 2 tempos há mais de 50 anos. Esta experiência inigualável permitiu à empresa melhorar mais uma vez a mais recente YZ125 e convertê-la numa moto criada para o levar ao lugar mais alto do pódio.",
          images: '["https://cdpcdn.dx1app.com/products/USA/YA/2025/MC/MX/YZ125/50/MONSTER_ENERGY_YAMAHA_RACING_EDITION/2000000002.jpg", "https://cdpcdn.dx1app.com/products/USA/YA/2025/MC/MX/YZ125/50/MONSTER_ENERGY_YAMAHA_RACING_EDITION/2000000003.jpg"]',
          fuel: "Gasolina",
          transmission: "Manual",
          color: "Azul",
          owners: 0
        },
        {
          name: "Yamaha YZ125 Monster Energy Edition",
          category: "Motocross",
          price: 8500,
          year: 2025,
          horas: 0,
          image: "https://cdpcdn.dx1app.com/products/USA/YA/2025/MC/MX/YZ125_MONSTER_ENERGY_EDITION/50/MONSTER_ENERGY_YAMAHA_RACING_EDITION/2000000001.jpg",
          specs: '["125cc", "35cv"]',
          condition: "Nova",
          description: "Edição especial Monster Energy.",
          images: '["https://cdpcdn.dx1app.com/products/USA/YA/2025/MC/MX/YZ125_MONSTER_ENERGY_EDITION/50/MONSTER_ENERGY_YAMAHA_RACING_EDITION/2000000002.jpg"]',
          fuel: "Gasolina",
          transmission: "Manual",
          color: "Preto",
          owners: 0
        },
        {
          name: "TMAX Tech MAX",
          category: "Sport",
          price: 15700,
          year: 2025,
          km: 0,
          image: "https://cdn2.yamaha-motor.eu/prod/product-assets/2025/XP500ADX/2025-Yamaha-XP500ADX-EU-Ceramic_Grey-360-Degrees-001-03.jpg",
          specs: '["560cc", "47,6cv", "ABS"]',
          condition: " Nova",
          description: "Scooter desportivo de alta performance.",
          images: '["https://cdn2.yamaha-motor.eu/prod/product-assets/2025/XP500ADX/2025-Yamaha-XP500ADX-EU-Ceramic_Grey-360-Degrees-001-03.jpg"]',
          fuel: "Gasolina",
          transmission: "Automática",
          color: "Cinza",
          owners: 0
        },
        {
          name: "Yamaha YZ 85",
          category: "Motocross",
          price: 5650.00,
          year: 2026,
          horas: 0,
          image: "https://trooperlumotorcycles.com.au/wp-content/uploads/2025/07/WEBSITE-IMAGE-SIZE-8.png",
          specs: '["85cc", "29cv"]',
          condition: "nova",
          description: "Moto de motocross para jovens.",
          images: '["https://trooperlumotorcycles.com.au/wp-content/uploads/2025/07/WEBSITE-IMAGE-SIZE-8.png"]',
          fuel: "Gasolina",
          transmission: "Manual",
          color: "Vermelho",
          owners: 0
        },
        {
          name: "BMW F 850 GS",
          category: "Adventure",
          price: 12500,
          year: 2022,
          km: 18000,
          image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZHZlbnR1cmUlMjBtb3RvcmN5Y2xlfGVufDF8fHx8MTc2MDExMzE1MHww&ixlib=rb-4.1.0&q=80&w=1080",
          specs: '["853cc", "95cv", "ABS", "TCS", "Quickshifter"]',
          condition: "Seminova",
          description: "Moto de aventura versátil.",
          images: '["https://images.unsplash.com/photo-1609630875171-b1321377ee65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZHZlbnR1cmUlMjBtb3RvcmN5Y2xlfGVufDF8fHx8MTc2MDExMzE1MHww&ixlib=rb-4.1.0&q=80&w=1080"]',
          fuel: "Gasolina",
          transmission: "Manual",
          color: "Branco",
          owners: 1
        },
        {
          name: "Honda Gold Wing",
          category: "Touring",
          price: 18500,
          year: 2021,
          km: 22000,
          image: "https://images.unsplash.com/photo-1558980664-10e7170b5df9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
          specs: '["1833cc", "126cv", "DCT", "Airbag", "Navegação"]',
          condition: "Seminova",
          description: "Moto touring de luxo.",
          images: '["https://images.unsplash.com/photo-1558980664-10e7170b5df9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"]',
          fuel: "Gasolina",
          transmission: "Automática",
          color: "Preto",
          owners: 1
        }
      ];

      const stmt = db.prepare(`INSERT INTO motorcycles (name, category, price, year, km, horas, image, specs, condition, description, images, fuel, transmission, color, owners) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
      initialData.forEach(moto => {
        stmt.run(moto.name, moto.category, moto.price, moto.year, moto.km, moto.horas, moto.image, moto.specs, moto.condition, moto.description, moto.images, moto.fuel, moto.transmission, moto.color, moto.owners);
      });
      stmt.finalize();
      console.log('Initial data inserted');
    }
  });
});

// API Routes
app.get('/api/motorcycles', (req, res) => {
  db.all("SELECT * FROM motorcycles", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    // Parse specs and images from JSON strings
    const motorcycles = rows.map(row => ({
      ...row,
      specs: JSON.parse(row.specs),
      images: JSON.parse(row.images)
    }));
    res.json(motorcycles);
  });
});

app.get('/api/motorcycles/:id', (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM motorcycles WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Motorcycle not found' });
      return;
    }
    // Parse specs and images
    const motorcycle = {
      ...row,
      specs: JSON.parse(row.specs),
      images: JSON.parse(row.images)
    };
    res.json(motorcycle);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});