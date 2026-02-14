const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 3306,
    multipleStatements: true
  });

  try {
    // Create database and tables
    const sql = `
      CREATE DATABASE IF NOT EXISTS moto_oficina;
      USE moto_oficina;

      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        service VARCHAR(100) NOT NULL,
        date DATE NOT NULL,
        time VARCHAR(10) NOT NULL,
        name VARCHAR(150) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(150),
        vehicle VARCHAR(200) NOT NULL,
        notes TEXT,
        status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        duration VARCHAR(50),
        price VARCHAR(50),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      INSERT IGNORE INTO services (name, duration, price, description) VALUES
      ('Revisão Completa', '2-3h', '150€', 'Revisão completa da mota'),
      ('Mudança de Óleo', '30min', '50€', 'Troca de óleo e filtro'),
      ('Travões (pastilhas e discos)', '1-2h', '120€', 'Substituição de pastilhas e verificação de discos'),
      ('Pneus e Rodas', '1h', '80€', 'Troca de pneus e balanceamento'),
      ('Diagnóstico Eletrónico', '1h', '60€', 'Diagnóstico com equipamento eletrónico'),
      ('Corrente e Transmissão', '1h', '90€', 'Ajuste e lubrificação da corrente'),
      ('Suspensão', '2h', '180€', 'Manutenção da suspensão'),
      ('Escape', '1-2h', '100€', 'Substituição ou reparação do escape'),
      ('Outro', 'Variável', 'A consultar', 'Outros serviços');
    `;

    await connection.query(sql);
    console.log('✅ Database setup completed successfully!');
  } catch (err) {
    console.error('❌ Error setting up database:', err.message);
  } finally {
    await connection.end();
  }
}

setupDatabase();
