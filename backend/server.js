const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');

const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envLines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);

  envLines.forEach((line) => {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith('#')) {
      return;
    }

    const separatorIndex = trimmedLine.indexOf('=');

    if (separatorIndex === -1) {
      return;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const value = trimmedLine.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, '');

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  });
}

const { sendWelcomeEmail, sendOrderSuccessEmail } = require('./sendEmail');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'pap-dev-secret';
const defaultServices = [
  ['Revisao Completa', 'Revisao geral da mota', 150, 150.00],
  ['Mudanca de Oleo', 'Mudanca de oleo e filtro', 30, 50.00],
  ['Travoes', 'Pastilhas e discos', 90, 120.00],
  ['Pneus e Rodas', 'Servico de pneus e rodas', 60, 80.00],
  ['Diagnostico Eletronico', 'Diagnostico com equipamento', 60, 60.00],
  ['Corrente e Transmissao', 'Ajuste ou troca de transmissao', 60, 90.00],
  ['Suspensao', 'Revisao de suspensao', 120, 180.00],
  ['Escape', 'Servico de escape', 90, 100.00],
  ['Outro', 'Servico a combinar', null, 0.00]
];

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

db.getConnection((err, connection) => {
  if (err) {
    console.error('Erro na ligacao a base de dados:', err.message);
    return;
  }

  console.log('Ligado a base de dados com sucesso!');
  connection.release();
});

db.query('SELECT COUNT(*) AS total FROM servico', (err, results) => {
  if (err || results[0].total > 0) {
    return;
  }

  db.query(
    'INSERT INTO servico (nome, descricao, duracaoestimada, preco, ativo) VALUES ?',
    [defaultServices.map((service) => [...service, 1])],
    (insertErr) => {
      if (insertErr) {
        console.error('Erro ao criar servicos iniciais:', insertErr.message);
      }
    }
  );
});

function formatMotorcycle(row, req) {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const rawImage = row.imagem || '';
  const image = rawImage.startsWith('http')
    ? rawImage
    : `${baseUrl}/${rawImage.replace(/\\/g, '/').replace(/^\/+/, '')}`;

  const extras = row.extras
    ? row.extras.split(',').map((extra) => extra.trim()).filter(Boolean)
    : [];

  const specs = [
    row.cilindrada ? `${row.cilindrada}cc` : null,
    row.potencia ? `${row.potencia}cv` : null,
    ...extras
  ].filter(Boolean);

  const isMotocross = (row.tipo || '').toLowerCase() === 'motocross';

  return {
    id: row.id,
    marca: row.marca,
    modelo: row.modelo,
    name: `${row.marca} ${row.modelo}`,
    tipo: row.tipo || 'Sem categoria',
    category: row.tipo || 'Sem categoria',
    price: Number(row.preco),
    preco: Number(row.preco),
    year: Number(row.ano),
    ano: Number(row.ano),
    km: isMotocross ? undefined : row.quilometragem,
    quilometragem: row.quilometragem,
    horas: isMotocross ? row.horas : undefined,
    image,
    imagem: row.imagem || '',
    cilindrada: row.cilindrada,
    potencia: row.potencia,
    extras: row.extras || '',
    specs,
    condition: row.quilometragem > 0 || row.horas > 0 ? 'Usada' : 'Nova',
    description: row.descricao || '',
    descricao: row.descricao || '',
    images: [image],
    fuel: 'Gasolina',
    transmission: 'Manual',
    color: 'Nao especificada',
    owners: row.quilometragem > 0 || row.horas > 0 ? 1 : 0
  };
}

function formatPart(row, req) {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const rawImage = row.imagem || '';
  let image = 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1080&q=80';

  if (rawImage) {
    if (rawImage.startsWith('http')) {
      image = rawImage;
    } else {
      const normalizedImage = rawImage.replace(/\\/g, '/').replace(/^\/+/, '');
      image = normalizedImage.includes('/')
        ? `${baseUrl}/${normalizedImage}`
        : `${baseUrl}/uploads/${normalizedImage}`;
    }
  }

  return {
    id: row.idpeca,
    idpeca: row.idpeca,
    name: row.nome,
    nome: row.nome,
    category: row.categoria,
    categoria: row.categoria,
    reference: row.referencia || '',
    referencia: row.referencia || '',
    price: Number(row.preco),
    preco: Number(row.preco),
    stock: Number(row.stock),
    image,
    imagem: image,
    brand: row.referencia || row.categoria
  };
}

function createToken(user) {
  return jwt.sign(
    {
      id: user.idutilizador,
      email: user.email,
      perfil: user.perfil || 'cliente'
    },
    JWT_SECRET,
    { expiresIn: '1d' }
  );
}

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token em falta' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token invalido' });
    }

    req.user = user;
    next();
  });
}

function verifyAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user?.perfil !== 'admin') {
      return res.status(403).json({ message: 'Acesso reservado ao administrador.' });
    }

    next();
  });
}

app.get('/api/health', (req, res) => {
  db.query('SELECT 1 AS ok', (err) => {
    if (err) {
      return res.status(500).json({
        api: 'ok',
        database: 'erro',
        message: err.message
      });
    }

    res.json({
      api: 'ok',
      database: 'ok'
    });
  });
});

app.post(['/api/register', '/register'], async (req, res) => {
  const nome = (req.body.nome || req.body.name || '').trim();
  const email = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password || req.body.pass || '';

  if (!nome || !email || !password) {
    return res.status(400).json({ message: 'Preencha todos os campos.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'A password deve ter pelo menos 6 caracteres.' });
  }

  db.getConnection(async (connectionErr, connection) => {
    if (connectionErr) {
      return res.status(500).json({ message: 'Erro ao ligar a base de dados.' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      connection.beginTransaction((transactionErr) => {
        if (transactionErr) {
          connection.release();
          return res.status(500).json({ message: 'Erro ao iniciar registo.' });
        }

        connection.query(
          'SELECT idutilizador FROM utilizador WHERE email = ? LIMIT 1',
          [email],
          (selectErr, existingUsers) => {
            if (selectErr) {
              return connection.rollback(() => {
                connection.release();
                res.status(500).json({ message: 'Erro ao verificar email.' });
              });
            }

            if (existingUsers.length > 0) {
              return connection.rollback(() => {
                connection.release();
                res.status(409).json({ message: 'Este email ja esta registado.' });
              });
            }

            connection.query(
              'INSERT INTO utilizador (email, pass, perfil, ativo, data_registo) VALUES (?, ?, "cliente", 1, NOW())',
              [email, hashedPassword],
              (userErr, userResult) => {
                if (userErr) {
                  return connection.rollback(() => {
                    connection.release();
                    res.status(500).json({ message: 'Erro ao criar utilizador.' });
                  });
                }

                const userId = userResult.insertId;

                connection.query(
                  'INSERT INTO cliente (idutilizador, nome) VALUES (?, ?)',
                  [userId, nome],
                  (clientErr, clientResult) => {
                    if (clientErr) {
                      return connection.rollback(() => {
                        connection.release();
                        res.status(500).json({ message: 'Erro ao criar cliente.' });
                      });
                    }

                    connection.commit((commitErr) => {
                      connection.release();

                      if (commitErr) {
                        return res.status(500).json({ message: 'Erro ao finalizar registo.' });
                      }

                      const user = { idutilizador: userId, email, perfil: 'cliente' };
                      sendWelcomeEmail(email, nome).catch((emailErr) => {
                        console.error('Erro ao enviar email de boas-vindas:', emailErr.message);
                      });

                      res.status(201).json({
                        message: 'Utilizador criado com sucesso.',
                        token: createToken(user),
                        userId,
                        clientId: clientResult.insertId,
                        user: {
                          id: userId,
                          nome,
                          email,
                          perfil: 'cliente'
                        }
                      });
                    });
                  }
                );
              }
            );
          }
        );
      });
    } catch (err) {
      connection.release();
      res.status(500).json({ message: 'Erro ao proteger password.' });
    }
  });
});

app.post(['/api/login', '/login'], (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password || req.body.pass || '';

  if (!email || !password) {
    return res.status(400).json({ message: 'Preencha todos os campos.' });
  }

  const sql = `
    SELECT
      u.idutilizador,
      u.email,
      u.pass,
      u.perfil,
      u.ativo,
      c.idcliente,
      c.nome
    FROM utilizador u
    LEFT JOIN cliente c ON c.idutilizador = u.idutilizador
    WHERE u.email = ?
    LIMIT 1
  `;

  db.query(sql, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao procurar utilizador.' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Email ou password incorretos.' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.pass);

    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou password incorretos.' });
    }

    if (user.ativo !== 1) {
      return res.status(403).json({ message: 'Conta desativada.' });
    }

    res.json({
      message: 'Login efetuado com sucesso.',
      token: createToken(user),
      userId: user.idutilizador,
      clientId: user.idcliente,
      user: {
        id: user.idutilizador,
        nome: user.nome,
        email: user.email,
        perfil: user.perfil || 'cliente'
      }
    });
  });
});

app.get('/api/perfil', verifyToken, (req, res) => {
  res.json({
    message: 'Acesso autorizado.',
    user: req.user
  });
});

app.get('/api/servicos', (req, res) => {
  db.query('SELECT idservico, nome, descricao, duracaoestimada, preco FROM servico WHERE ativo = 1 ORDER BY nome', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar servicos.' });
    }

    res.json(results.map((row) => ({
      id: String(row.idservico),
      idservico: row.idservico,
      name: row.nome,
      nome: row.nome,
      description: row.descricao,
      durationMinutes: row.duracaoestimada,
      duration: formatDuration(row.duracaoestimada),
      priceValue: Number(row.preco),
      price: Number(row.preco) > 0 ? `${Number(row.preco).toFixed(2)} EUR` : 'A consultar'
    })));
  });
});

app.get('/api/pecas', (req, res) => {
  const sql = `
    SELECT idpeca, categoria, nome, referencia, preco, imagem, stock
    FROM peca
    WHERE ativo = 1 OR ativo IS NULL
    ORDER BY datacriacao DESC, idpeca DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar peças.' });
    }

    res.json(results.map((row) => formatPart(row, req)));
  });
});

app.post('/api/admin/pecas', verifyAdmin, (req, res) => {
  const nome = (req.body.nome || req.body.name || '').trim();
  const categoria = (req.body.categoria || req.body.category || '').trim();
  const referencia = (req.body.referencia || req.body.reference || '').trim();
  const imagem = (req.body.imagem || req.body.image || '').trim();
  const preco = Number(req.body.preco ?? req.body.price);
  const stock = Number(req.body.stock);

  if (!nome || !categoria || !Number.isFinite(preco) || !Number.isFinite(stock)) {
    return res.status(400).json({ message: 'Preencha nome, categoria, preco e stock.' });
  }

  const sql = `
    INSERT INTO peca (categoria, nome, referencia, preco, imagem, stock, datacriacao, ativo)
    VALUES (?, ?, ?, ?, ?, ?, NOW(), 1)
  `;

  db.query(sql, [categoria, nome, referencia, preco, imagem, stock], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao criar peça.' });
    }

    db.query('SELECT * FROM peca WHERE idpeca = ?', [result.insertId], (selectErr, rows) => {
      if (selectErr) {
        return res.status(500).json({ message: 'Peça criada, mas nao foi possivel carregar os dados.' });
      }

      res.status(201).json(formatPart(rows[0], req));
    });
  });
});

app.put('/api/admin/pecas/:id', verifyAdmin, (req, res) => {
  const nome = (req.body.nome || req.body.name || '').trim();
  const categoria = (req.body.categoria || req.body.category || '').trim();
  const referencia = (req.body.referencia || req.body.reference || '').trim();
  const imagem = (req.body.imagem || req.body.image || '').trim();
  const preco = Number(req.body.preco ?? req.body.price);
  const stock = Number(req.body.stock);

  if (!nome || !categoria || !Number.isFinite(preco) || !Number.isFinite(stock)) {
    return res.status(400).json({ message: 'Preencha nome, categoria, preco e stock.' });
  }

  const sql = `
    UPDATE peca
    SET categoria = ?, nome = ?, referencia = ?, preco = ?, imagem = ?, stock = ?, ativo = 1
    WHERE idpeca = ?
  `;

  db.query(sql, [categoria, nome, referencia, preco, imagem, stock, req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao atualizar peça.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Peça nao encontrada.' });
    }

    db.query('SELECT * FROM peca WHERE idpeca = ?', [req.params.id], (selectErr, rows) => {
      if (selectErr) {
        return res.status(500).json({ message: 'Peça atualizada, mas nao foi possivel carregar os dados.' });
      }

      res.json(formatPart(rows[0], req));
    });
  });
});

app.delete('/api/admin/pecas/:id', verifyAdmin, (req, res) => {
  db.query('UPDATE peca SET ativo = 0 WHERE idpeca = ?', [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao eliminar peça.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Peça nao encontrada.' });
    }

    res.json({ message: 'Peça eliminada.' });
  });
});

function formatDuration(minutes) {
  if (!minutes) {
    return 'Variavel';
  }

  if (minutes < 60) {
    return `${minutes}min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
}

function toApiStatus(status) {
  const statusMap = {
    pendente: 'pending',
    confirmado: 'confirmed',
    concluido: 'completed',
    cancelado: 'cancelled'
  };

  return statusMap[(status || '').toLowerCase()] || 'pending';
}

function toDbStatus(status) {
  const statusMap = {
    pending: 'pendente',
    confirmed: 'confirmado',
    completed: 'concluido',
    cancelled: 'cancelado'
  };

  return statusMap[status] || 'pendente';
}

app.get('/api/motorcycles', (req, res) => {
  db.query('SELECT * FROM motas ORDER BY data_adicionado DESC, id DESC', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar motas.' });
    }

    res.json(results.map((row) => formatMotorcycle(row, req)));
  });
});

app.get('/api/motorcycles/:id', (req, res) => {
  db.query('SELECT * FROM motas WHERE id = ?', [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar mota.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Mota nao encontrada.' });
    }

    res.json(formatMotorcycle(results[0], req));
  });
});

app.post('/api/admin/motorcycles', verifyAdmin, (req, res) => {
  const marca = (req.body.marca || '').trim();
  const modelo = (req.body.modelo || '').trim();
  const imagem = (req.body.imagem || req.body.image || '').trim();
  const tipo = (req.body.tipo || req.body.category || '').trim();
  const extras = (req.body.extras || '').trim();
  const descricao = (req.body.descricao || req.body.description || '').trim();
  const ano = Number(req.body.ano ?? req.body.year);
  const preco = Number(req.body.preco ?? req.body.price);
  const cilindrada = Number(req.body.cilindrada || 0);
  const potencia = Number(req.body.potencia || 0);
  const quilometragem = Number(req.body.quilometragem || req.body.km || 0);
  const horas = Number(req.body.horas || 0);

  if (!marca || !modelo || !imagem || !tipo || !Number.isFinite(ano) || !Number.isFinite(preco)) {
    return res.status(400).json({ message: 'Preencha marca, modelo, ano, preco, imagem e tipo.' });
  }

  const sql = `
    INSERT INTO motas (marca, modelo, ano, preco, imagem, tipo, cilindrada, potencia, quilometragem, horas, extras, descricao)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [marca, modelo, ano, preco, imagem, tipo, cilindrada, potencia, quilometragem, horas, extras, descricao],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao criar mota.' });
      }

      db.query('SELECT * FROM motas WHERE id = ?', [result.insertId], (selectErr, rows) => {
        if (selectErr) {
          return res.status(500).json({ message: 'Mota criada, mas nao foi possivel carregar os dados.' });
        }

        res.status(201).json(formatMotorcycle(rows[0], req));
      });
    }
  );
});

app.put('/api/admin/motorcycles/:id', verifyAdmin, (req, res) => {
  const marca = (req.body.marca || '').trim();
  const modelo = (req.body.modelo || '').trim();
  const imagem = (req.body.imagem || req.body.image || '').trim();
  const tipo = (req.body.tipo || req.body.category || '').trim();
  const extras = (req.body.extras || '').trim();
  const descricao = (req.body.descricao || req.body.description || '').trim();
  const ano = Number(req.body.ano ?? req.body.year);
  const preco = Number(req.body.preco ?? req.body.price);
  const cilindrada = Number(req.body.cilindrada || 0);
  const potencia = Number(req.body.potencia || 0);
  const quilometragem = Number(req.body.quilometragem || req.body.km || 0);
  const horas = Number(req.body.horas || 0);

  if (!marca || !modelo || !imagem || !tipo || !Number.isFinite(ano) || !Number.isFinite(preco)) {
    return res.status(400).json({ message: 'Preencha marca, modelo, ano, preco, imagem e tipo.' });
  }

  const sql = `
    UPDATE motas
    SET marca = ?, modelo = ?, ano = ?, preco = ?, imagem = ?, tipo = ?, cilindrada = ?,
        potencia = ?, quilometragem = ?, horas = ?, extras = ?, descricao = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [marca, modelo, ano, preco, imagem, tipo, cilindrada, potencia, quilometragem, horas, extras, descricao, req.params.id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao atualizar mota.' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Mota nao encontrada.' });
      }

      db.query('SELECT * FROM motas WHERE id = ?', [req.params.id], (selectErr, rows) => {
        if (selectErr) {
          return res.status(500).json({ message: 'Mota atualizada, mas nao foi possivel carregar os dados.' });
        }

        res.json(formatMotorcycle(rows[0], req));
      });
    }
  );
});

app.delete('/api/admin/motorcycles/:id', verifyAdmin, (req, res) => {
  db.query('DELETE FROM motas WHERE id = ?', [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao eliminar mota.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Mota nao encontrada.' });
    }

    res.json({ message: 'Mota eliminada.' });
  });
});

app.post('/api/checkout', async (req, res) => {
  const customer = req.body.customer || {};
  const items = Array.isArray(req.body.items) ? req.body.items : [];
  const name = (customer.name || '').trim();
  const email = (customer.email || '').trim().toLowerCase();
  const phone = (customer.phone || '').trim();
  const address = (customer.address || '').trim();

  if (!name || !email || !phone || !address) {
    return res.status(400).json({ message: 'Preencha nome, email, telemovel e morada.' });
  }

  if (items.length === 0) {
    return res.status(400).json({ message: 'O carrinho esta vazio.' });
  }

  const orderItems = items.map((item) => ({
    id: Number(item.id),
    name: String(item.name || ''),
    price: Number(item.price),
    quantity: Number(item.quantity)
  }));

  const hasInvalidItem = orderItems.some((item) => (
    !item.id ||
    !item.name ||
    !Number.isFinite(item.price) ||
    !Number.isFinite(item.quantity) ||
    item.quantity <= 0
  ));

  if (hasInvalidItem) {
    return res.status(400).json({ message: 'Existem produtos invalidos no carrinho.' });
  }

  const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0) * 1.23;

  try {
    await sendOrderSuccessEmail(email, name, {
      customer: { name, email, phone, address },
      items: orderItems,
      total
    });

    res.status(201).json({ message: 'Compra finalizada com sucesso.' });
  } catch (err) {
    console.error('Erro ao enviar email da encomenda:', err.message);
    res.status(500).json({ message: 'Compra registada, mas houve erro ao enviar o email.' });
  }
});

app.post('/api/marcacao', (req, res) => {
  const { idcliente, idservico, datahora, vehicle } = req.body;
  const clientId = Number(idcliente);
  const serviceId = Number(idservico);
  const vehicleText = (vehicle || '').trim();
  const clientName = (req.body.name || '').trim();
  const clientPhone = (req.body.phone || '').trim();

  if (!clientId || !serviceId || !datahora || !vehicleText) {
    return res.status(400).json({ message: 'Dados da marcacao em falta.' });
  }

  db.getConnection((connectionErr, connection) => {
    if (connectionErr) {
      return res.status(500).json({ message: 'Erro ao ligar a base de dados.' });
    }

    connection.beginTransaction((transactionErr) => {
      if (transactionErr) {
        connection.release();
        return res.status(500).json({ message: 'Erro ao iniciar marcacao.' });
      }

      connection.query(
        'SELECT idservico, preco, duracaoestimada FROM servico WHERE idservico = ? AND ativo = 1 LIMIT 1',
        [serviceId],
        (serviceErr, services) => {
          if (serviceErr || services.length === 0) {
            return connection.rollback(() => {
              connection.release();
              res.status(serviceErr ? 500 : 404).json({ message: serviceErr ? 'Erro ao validar servico.' : 'Servico nao encontrado.' });
            });
          }

          const selectedService = services[0];

          connection.query(
            'UPDATE cliente SET nome = ?, tlm = ? WHERE idcliente = ?',
            [clientName || 'Cliente', clientPhone, clientId],
            (clientErr, clientResult) => {
              if (clientErr || clientResult.affectedRows === 0) {
                return connection.rollback(() => {
                  connection.release();
                  res.status(clientErr ? 500 : 404).json({ message: clientErr ? 'Erro ao atualizar cliente.' : 'Cliente nao encontrado.' });
                });
              }

              connection.query(
                'INSERT INTO veiculo_cliente (idcliente, matricula, modelo) VALUES (?, ?, ?)',
                [clientId, '', vehicleText],
                (vehicleErr, vehicleResult) => {
                  if (vehicleErr) {
                    return connection.rollback(() => {
                      connection.release();
                      res.status(500).json({ message: 'Erro ao criar veiculo.' });
                    });
                  }

                  connection.query(
                    'INSERT INTO marcacao (idcliente, idveiculo, datahora, estado, motas_cliente, datacriacao) VALUES (?, ?, ?, "pendente", ?, NOW())',
                    [clientId, vehicleResult.insertId, datahora, vehicleText],
                    (bookingErr, bookingResult) => {
                      if (bookingErr) {
                        return connection.rollback(() => {
                          connection.release();
                          res.status(500).json({ message: 'Erro ao criar marcacao.' });
                        });
                      }

                      connection.query(
                        'INSERT INTO marcacao_servico (idmarcacao, idservico, preco, duracao_min) VALUES (?, ?, ?, ?)',
                        [bookingResult.insertId, serviceId, selectedService.preco, selectedService.duracaoestimada],
                        (bookingServiceErr) => {
                          if (bookingServiceErr) {
                            return connection.rollback(() => {
                              connection.release();
                              res.status(500).json({ message: 'Erro ao associar servico.' });
                            });
                          }

                          connection.commit((commitErr) => {
                            connection.release();

                            if (commitErr) {
                              return res.status(500).json({ message: 'Erro ao finalizar marcacao.' });
                            }

                            res.status(201).json({
                              message: 'Marcacao criada.',
                              idmarcacao: bookingResult.insertId,
                              idveiculo: vehicleResult.insertId
                            });
                          });
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        }
      );
    });
  });
});

app.get('/api/marcacoes', (req, res) => {
  const sql = `
    SELECT
      m.idmarcacao,
      m.datahora,
      m.estado,
      m.motas_cliente,
      m.datacriacao,
      c.nome,
      c.tlm,
      u.email,
      v.modelo,
      s.idservico,
      s.nome AS servico_nome,
      ms.preco,
      ms.duracao_min
    FROM marcacao m
    INNER JOIN cliente c ON c.idcliente = m.idcliente
    LEFT JOIN utilizador u ON u.idutilizador = c.idutilizador
    INNER JOIN veiculo_cliente v ON v.idveiculo = m.idveiculo
    INNER JOIN marcacao_servico ms ON ms.idmarcacao = m.idmarcacao
    INNER JOIN servico s ON s.idservico = ms.idservico
    ORDER BY m.datahora DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar marcacoes.' });
    }

    res.json(results.map((row) => {
      const date = new Date(row.datahora);

      return {
        id: String(row.idmarcacao),
        service: String(row.idservico),
        serviceName: row.servico_nome,
        date: date.toISOString(),
        time: date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
        duration: formatDuration(row.duracao_min),
        price: Number(row.preco) > 0 ? `${Number(row.preco).toFixed(2)} EUR` : 'A consultar',
        name: row.nome,
        phone: row.tlm || '',
        email: row.email || '',
        vehicle: row.motas_cliente || row.modelo || '',
        notes: '',
        status: toApiStatus(row.estado),
        createdAt: row.datacriacao ? new Date(row.datacriacao).toISOString() : ''
      };
    }));
  });
});

app.patch('/api/marcacoes/:id/status', (req, res) => {
  const status = toDbStatus(req.body.status);

  db.query(
    'UPDATE marcacao SET estado = ? WHERE idmarcacao = ?',
    [status, req.params.id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao atualizar marcacao.' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Marcacao nao encontrada.' });
      }

      res.json({ message: 'Marcacao atualizada.' });
    }
  );
});

app.delete('/api/marcacoes/:id', (req, res) => {
  db.query('DELETE FROM marcacao WHERE idmarcacao = ?', [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao eliminar marcacao.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Marcacao nao encontrada.' });
    }

    res.json({ message: 'Marcacao eliminada.' });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor a correr na porta ${PORT}`);
});
