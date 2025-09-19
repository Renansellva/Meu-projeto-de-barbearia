# Meu-projeto-de-barbearia
Sistema de reservas para barbearias com Next.js, Prisma e PostgreSQL. Inclui autenticação com roles (cliente, barbeiro, admin), dashboards completos, agendamento online, gerenciamento de serviços e notificações por email. Projeto responsivo, containerizado com Docker e pronto para deploy em produção.
=======
# 🪒 Barbearia Elite - Sistema de Reservas

Sistema completo de agendamento para barbearia desenvolvido com Next.js, Prisma e PostgreSQL. Inclui autenticação, dashboard para clientes e administradores, sistema de notificações por email e muito mais.

## 🚀 Tecnologias Utilizadas

- **Frontend & Backend**: Next.js 14 (App Router)
- **Estilização**: Tailwind CSS + shadcn/ui
- **Banco de Dados**: PostgreSQL com Prisma ORM
- **Autenticação**: NextAuth.js com roles (Cliente, Barbeiro, Admin)
- **Email**: Nodemailer (SMTP)
- **Testes**: Jest + Supertest
- **Containerização**: Docker + Docker Compose

## ✨ Funcionalidades

### 📱 Páginas Públicas
- **Home**: Landing page com informações da barbearia
- **Sobre**: História, equipe e valores da empresa
- **Serviços**: Lista completa de serviços com preços e duração
- **Contato**: Formulário de contato e informações

### 👤 Dashboard do Cliente
- Visualizar agendamentos futuros e passados
- Criar novas reservas com seleção de serviço, barbeiro e horário
- Cancelar reservas (até 2 horas antes)
- Histórico completo de atendimentos
- Interface de agendamento em etapas (wizard)
- Estatísticas pessoais (total gasto, visitas, etc.)

### 🛠️ Dashboard Admin
- Gerenciar todos os agendamentos
- Confirmar/recusar reservas
- CRUD completo de serviços e barbeiros
- Relatórios de faturamento e ocupação
- Configurações do sistema
- Sistema de notificações por email
- Filtros avançados para agendamentos
- Estatísticas em tempo real

### 🔐 Sistema de Autenticação
- Cadastro e login de clientes
- Login para barbeiros e administradores
- Controle de acesso baseado em roles
- Proteção de rotas sensíveis

### 📧 Notificações
- Email de confirmação ao criar reserva
- Notificação de cancelamento
- Lembretes de agendamentos
- Templates HTML responsivos
- Sistema de lembretes automáticos
- Notificações customizadas pelo admin
- API para envio de emails

### ⚡ Recursos Técnicos
- Verificação de disponibilidade em tempo real
- Prevenção de overbooking
- Validação de dados no frontend e backend
- Interface responsiva (mobile-first)
- Internacionalização em português brasileiro
- Botão flutuante para mobile
- Health check para monitoramento
- Scripts de backup e restore
- Configuração Nginx para produção

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- PostgreSQL 15+
- npm ou yarn

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/barbearia-reservas.git
cd barbearia-reservas
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Copie o arquivo de exemplo e configure suas variáveis:
```bash
cp env.example .env.local
```

Edite o arquivo `.env.local` com suas configurações:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/barbearia_db?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# SMTP Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Application
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Barbearia Elite"

# Business Configuration
BUSINESS_NAME="Barbearia Elite"
BUSINESS_PHONE="(89) 981040653"
BUSINESS_EMAIL="renancostadasilva@gmail.com"
BUSINESS_ADDRESS="piaui"
```

### 4. Configure o banco de dados
```bash
# Gerar o cliente Prisma
npm run prisma:generate

# Executar as migrações
npm run prisma:migrate

# Popular o banco com dados de teste
npm run prisma:seed
```

### 5. Execute o projeto
```bash
npm run dev
```

O projeto estará disponível em `http://localhost:3000`

## 🐳 Docker

### Desenvolvimento
Para rodar apenas o banco de dados em desenvolvimento:
```bash
docker-compose -f docker-compose.dev.yml up -d
```

### Produção
Para rodar a aplicação completa:
```bash
docker-compose up -d
```

## 🧪 Testes

Execute os testes automatizados:
```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com coverage
npm test -- --coverage
```

## 📊 Credenciais de Teste

Após executar o seed, você pode usar estas credenciais:

### 👑 Administrador
- **Email**: admin@barbeariaelite.com
- **Senha**: 123456

### ✂️ Barbeiros
- **Email**: joao@barbeariaelite.com
- **Senha**: 123456

- **Email**: pedro@barbeariaelite.com
- **Senha**: 123456

### 👤 Clientes
- **Email**: cliente1@email.com
- **Senha**: 123456

- **Email**: cliente2@email.com
- **Senha**: 123456

## 🔌 APIs Disponíveis

### Autenticação
- `POST /api/auth/register` - Cadastro de usuário
- `POST /api/auth/login` - Login (via NextAuth)

### Serviços
- `GET /api/services` - Listar serviços
- `POST /api/services` - Criar serviço (admin)
- `GET /api/services/[id]` - Buscar serviço
- `PUT /api/services/[id]` - Atualizar serviço (admin)
- `DELETE /api/services/[id]` - Deletar serviço (admin)

### Agendamentos
- `GET /api/appointments` - Listar agendamentos
- `POST /api/appointments` - Criar agendamento
- `GET /api/appointments/[id]` - Buscar agendamento
- `PUT /api/appointments/[id]` - Atualizar agendamento
- `DELETE /api/appointments/[id]` - Cancelar agendamento
- `GET /api/appointments/availability` - Verificar disponibilidade

### Notificações
- `POST /api/notifications/send` - Enviar notificação personalizada
- `POST /api/notifications/reminders` - Enviar lembretes automáticos

### Sistema
- `GET /api/health` - Health check da aplicação
- `GET /api/barbers` - Listar barbeiros disponíveis

## 📝 Exemplos de Uso

### Criar um agendamento
```bash
curl -X POST http://localhost:3000/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "serviceId": "service-id",
    "barberId": "barber-id",
    "date": "2024-01-15",
    "startTime": "10:00",
    "notes": "Primeira vez na barbearia"
  }'
```

### Verificar disponibilidade
```bash
curl "http://localhost:3000/api/appointments/availability?date=2024-01-15&serviceId=service-id&barberId=barber-id"
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "cliente1@email.com",
    "password": "123456"
  }'
```

## 🚀 Deploy

### Scripts Automatizados

O projeto inclui scripts para facilitar o deploy e manutenção:

```bash
# Deploy para desenvolvimento
./scripts/deploy.sh dev

# Deploy para staging
./scripts/deploy.sh staging

# Deploy para produção
./scripts/deploy.sh prod

# Backup do banco de dados
./scripts/backup.sh full

# Restore de backup
./scripts/restore.sh backup_file.sql.gz
```

### Vercel + PostgreSQL (Render/Supabase)

1. **Configure o banco de dados**:
   - Crie uma instância PostgreSQL no Render ou Supabase
   - Copie a string de conexão

2. **Deploy no Vercel**:
   ```bash
   npm install -g vercel
   vercel
   ```

3. **Configure as variáveis de ambiente** no Vercel:
   - `DATABASE_URL`: String de conexão do PostgreSQL
   - `NEXTAUTH_SECRET`: Chave secreta para NextAuth
   - `SMTP_*`: Configurações do email
   - Outras variáveis conforme necessário

4. **Execute as migrações**:
   ```bash
   vercel env pull .env.local
   npm run prisma:migrate
   npm run prisma:seed
   ```

### Docker (VPS/Servidor)

1. **Clone e configure**:
   ```bash
   git clone https://github.com/seu-usuario/barbearia-reservas.git
   cd barbearia-reservas
   cp env.example .env
   # Edite o .env com suas configurações
   ```

2. **Execute com Docker**:
   ```bash
   docker-compose up -d
   ```

3. **Execute as migrações**:
   ```bash
   docker-compose exec app npm run prisma:migrate
   docker-compose exec app npm run prisma:seed
   ```

## 📁 Estrutura do Projeto

```
barbearia-reservas/
├── app/                    # App Router do Next.js
│   ├── api/               # APIs
│   ├── auth/              # Páginas de autenticação
│   ├── contato/           # Página de contato
│   ├── servicos/          # Página de serviços
│   ├── sobre/             # Página sobre
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página inicial
├── components/            # Componentes React
│   ├── ui/               # Componentes base (shadcn/ui)
│   ├── forms/            # Formulários
│   └── layout/           # Layout components
├── lib/                  # Utilitários e configurações
│   ├── auth.ts           # Configuração NextAuth
│   ├── email.ts          # Configuração email
│   ├── prisma.ts         # Cliente Prisma
│   └── utils.ts          # Funções utilitárias
├── prisma/               # Schema e migrações
│   ├── schema.prisma     # Schema do banco
│   └── seed.ts           # Dados de teste
├── __tests__/            # Testes automatizados
├── docker-compose.yml    # Docker para produção
├── docker-compose.dev.yml # Docker para desenvolvimento
├── Dockerfile            # Imagem Docker
└── README.md             # Este arquivo
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique se seguiu todos os passos de instalação
2. Consulte a documentação do [Next.js](https://nextjs.org/docs)
3. Consulte a documentação do [Prisma](https://www.prisma.io/docs)
4. Abra uma [issue](https://github.com/seu-usuario/barbearia-reservas/issues)

## 🎯 Roadmap

- [ ] Dashboard para barbeiros
- [ ] Sistema de avaliações
- [ ] Integração com pagamentos
- [ ] App mobile (React Native)
- [ ] Sistema de fidelidade
- [ ] Relatórios avançados
- [ ] Integração com WhatsApp
- [ ] Sistema de notificações push

---

Desenvolvido com ❤️ para barbearias modernas
>>>>>>> f12397f (Primeira versão do sistema de reservas da barbearia)
