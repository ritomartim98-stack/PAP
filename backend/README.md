# Backend - API para Sistema de Agendamentos

## Configuração

### 1. Instalar dependências

```bash
cd backend
npm install
```

### 2. Configurar banco de dados MySQL

Abra o phpMyAdmin e:
1. Crie um novo banco de dados chamado `mecanica_db`
2. Importe o arquivo `database.sql` ou execute o SQL

### 3. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e preencha com suas credenciais:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_mysql
DB_NAME=mecanica_db
PORT=3001
```

### 4. Iniciar o servidor

```bash
npm run dev
```

O servidor irá rodar em `http://localhost:3001`

## Endpoints da API

### Agendamentos

- **GET** `/api/bookings` - Listar todos os agendamentos
- **POST** `/api/bookings` - Criar novo agendamento
- **PUT** `/api/bookings/:id` - Atualizar agendamento
- **DELETE** `/api/bookings/:id` - Excluir agendamento

### Serviços

- **GET** `/api/services` - Listar todos os serviços

## Estrutura do Banco de Dados

### Tabela `bookings`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT | ID automático |
| service | VARCHAR(100) | Tipo de serviço |
| date | DATE | Data do agendamento |
| time | VARCHAR(10) | Hora do agendamento |
| name | VARCHAR(150) | Nome do cliente |
| phone | VARCHAR(20) | Telemóvel |
| email | VARCHAR(150) | E-mail |
| vehicle | VARCHAR(200) | Mota |
| notes | TEXT | Observações |
| status | ENUM | Estado do agendamento |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data de atualização |
