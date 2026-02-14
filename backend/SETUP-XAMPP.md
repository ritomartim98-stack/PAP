# Como Configurar com XAMPP/WAMP

## Passo 1: Iniciar o XAMPP/WAMP

1. Abra o XAMPP Control Panel
2. Clique em **Start** nos módulos:
   - **Apache** (servidor web)
   - **MySQL** (base de dados)

## Passo 2: Criar a Base de Dados no phpMyAdmin

1. Abra o navegador e vá para: **http://localhost/phpmyadmin**
2. Clique em **Novo** (New) no menu lateral esquerdo
3. Em **Nome da base de dados**, digite: `moto_oficina`
4. Clique em **Criar**

## Passo 3: Importar as Tabelas

1. Clique em `mecanica_db` no menu lateral esquerdo
2. Clique na aba **Importar** (Import)
3. Clique em **Escolher arquivo** e selecione o arquivo `database.sql` desta pasta
4. Clique em **Executar** (Go) no final da página

## Passo 4: Configurar o Backend

1. Abra esta pasta no terminal (VS Code ou Command Prompt)
2. Instale as dependências:
   ```bash
   cd backend
   npm install
   ```

3. Crie o arquivo `.env`:
   ```bash
   copy .env.example .env
   ```

4. Edite o arquivo `.env` com as configurações do XAMPP:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=moto_oficina
   PORT=3001
   ```
   ⚠️ **Nota:** No XAMPP, o `password` geralmente está vazio para o usuário `root`

## Passo 5: Iniciar o Servidor Backend

```bash
npm run dev
```

Se funcionar, verá:
```
Servidor rodando na porta 3001
```

## Passo 6: Testar o Frontend

1. Abra outro terminal
2. Volte à pasta principal do projeto
3. Inicie o frontend:
   ```bash
   npm run dev
   ```

## Para Acessar a Administração

Vá para: **http://localhost:5173/admin** (ou a porta que aparecer no terminal)

## Problemas Comuns

| Problema | Solução |
|----------|---------|
| "Access denied" | Verifique se o `password` está vazio no `.env` |
| "Cannot connect" | Verifique se o MySQL está a correr no XAMPP |
| "Table doesn't exist" | Verifique se importou o `database.sql` corretamente |
| Porta 3001 ocupada | Mude a porta no `.env` para `3002` |

## Estrutura das Tabelas Criadas

### Tabela `bookings` (Agendamentos)
- id, service, date, time, name, phone, email, vehicle, notes, status

### Tabela `services` (Serviços)
- id, name, duration, price, description
