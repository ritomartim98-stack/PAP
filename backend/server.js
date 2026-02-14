const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// GET - Listar agendamentos
app.get('/api/bookings', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM bookings ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// POST - Criar novo agendamento
app.post('/api/bookings', async (req, res) => {
  try {
    const { service, date, time, name, phone, email, vehicle, notes } = req.body;
    const [result] = await pool.query(
      'INSERT INTO bookings (service, date, time, name, phone, email, vehicle, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [service, date, time, name, phone, email, vehicle, notes, 'pending']
    );
    res.status(201).json({ 
      id: result.insertId, 
      message: 'Agendamento criado com sucesso' 
    });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// PUT - Atualizar agendamento
app.put('/api/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { service, date, time, name, phone, email, vehicle, notes, status } = req.body;
    await pool.query(
      'UPDATE bookings SET service=?, date=?, time=?, name=?, phone=?, email=?, vehicle=?, notes=?, status=? WHERE id=?',
      [service, date, time, name, phone, email, vehicle, notes, status || 'pending', id]
    );
    res.json({ message: 'Agendamento atualizado com sucesso' });
  } catch (err) {
    console.error('Error updating booking:', err);
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

// DELETE - Excluir agendamento
app.delete('/api/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM bookings WHERE id = ?', [id]);
    res.json({ message: 'Agendamento excluído com sucesso' });
  } catch (err) {
    console.error('Error deleting booking:', err);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

// GET - Listar serviços
app.get('/api/services', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM services ORDER BY name');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching services:', err);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
