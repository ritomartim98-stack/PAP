const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'pap-dev-secret';

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
    name: `${row.marca} ${row.modelo}`,
    category: row.tipo || 'Sem categoria',
    price: Number(row.preco),
    year: Number(row.ano),
    km: isMotocross ? undefined : row.quilometragem,
    horas: isMotocross ? row.horas : undefined,
    image,
    specs,
    condition: row.quilometragem > 0 || row.horas > 0 ? 'Usada' : 'Nova',
    description: row.descricao || '',
    images: [image],
    fuel: 'Gasolina',
    transmission: 'Manual',
    color: 'Nao especificada',
    owners: row.quilometragem > 0 || row.horas > 0 ? 1 : 0
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
  db.query('SELECT * FROM servico WHERE ativo = 1', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar servicos.' });
    }

    res.json(results);
  });
});

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

app.post('/api/marcacao', (req, res) => {
  const { idcliente, idveiculo, datahora } = req.body;

  if (!idcliente || !idveiculo || !datahora) {
    return res.status(400).json({ message: 'Dados da marcacao em falta.' });
  }

  db.query(
    'INSERT INTO marcacao (idcliente, idveiculo, datahora, estado, motas_cliente, datacriacao) VALUES (?, ?, ?, "pendente", "", NOW())',
    [idcliente, idveiculo, datahora],
    (err) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao criar marcacao.' });
      }

      res.status(201).json({ message: 'Marcacao criada.' });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Servidor a correr na porta ${PORT}`);
});
