# 🧪 Guia de Teste Manual

Este guia contém instruções para testar manualmente todas as funcionalidades do sistema.

## 🚀 Setup Inicial

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente**:
   ```bash
   cp env.example .env.local
   # Edite o .env.local com suas configurações
   ```

3. **Setup do banco de dados**:
   ```bash
   npm run prisma:migrate
   npm run prisma:seed
   ```

4. **Iniciar aplicação**:
   ```bash
   npm run dev
   ```

## 🔐 Teste de Autenticação

### 1. Cadastro de Cliente
- Acesse: `http://localhost:3000/auth/register`
- Preencha o formulário com dados válidos
- Verifique se o usuário é criado com sucesso
- Teste validações (email inválido, senha curta, etc.)

### 2. Login
- Acesse: `http://localhost:3000/auth/login`
- Use as credenciais de teste:
  - **Cliente**: cliente1@email.com / 123456
  - **Admin**: admin@barbeariaelite.com / 123456
  - **Barbeiro**: joao@barbeariaelite.com / 123456

### 3. Logout
- Faça login e clique em "Sair"
- Verifique se é redirecionado para a página inicial

## 🏠 Teste das Páginas Públicas

### 1. Página Inicial
- Acesse: `http://localhost:3000`
- Verifique se todos os elementos estão visíveis
- Teste os botões de navegação
- Verifique responsividade em mobile

### 2. Página Sobre
- Acesse: `http://localhost:3000/sobre`
- Verifique informações da empresa
- Teste seção de equipe

### 3. Página Serviços
- Acesse: `http://localhost:3000/servicos`
- Verifique lista de serviços
- Teste botões de agendamento

### 4. Página Contato
- Acesse: `http://localhost:3000/contato`
- Preencha o formulário de contato
- Verifique se a mensagem é enviada

## 👤 Teste do Dashboard do Cliente

### 1. Acesso ao Dashboard
- Faça login como cliente
- Acesse: `http://localhost:3000/dashboard`
- Verifique estatísticas pessoais

### 2. Criar Agendamento
- Clique em "Novo Agendamento"
- Siga o wizard de agendamento:
  - **Etapa 1**: Escolha um serviço
  - **Etapa 2**: Escolha um barbeiro (ou deixe em branco)
  - **Etapa 3**: Escolha data e horário
  - **Etapa 4**: Confirme o agendamento
- Verifique se o agendamento é criado

### 3. Visualizar Agendamentos
- Verifique se o novo agendamento aparece na lista
- Teste filtros e ordenação

### 4. Cancelar Agendamento
- Clique em "Cancelar" em um agendamento
- Confirme o cancelamento
- Verifique se o status muda para "Cancelado"

## 🛠️ Teste do Dashboard Admin

### 1. Acesso ao Admin
- Faça login como admin
- Acesse: `http://localhost:3000/admin`
- Verifique estatísticas gerais

### 2. Gerenciar Agendamentos
- Vá para a aba "Agendamentos"
- Teste filtros por status e data
- Confirme um agendamento pendente
- Recuse um agendamento pendente
- Marque um agendamento como concluído

### 3. Gerenciar Serviços
- Vá para a aba "Serviços"
- Verifique lista de serviços
- Teste botões de edição e exclusão

### 4. Gerenciar Barbeiros
- Vá para a aba "Barbeiros"
- Verifique lista de barbeiros
- Teste funcionalidades de edição

## 📧 Teste de Notificações

### 1. Email de Confirmação
- Crie um novo agendamento
- Verifique se o email de confirmação é enviado
- Verifique o conteúdo do email

### 2. Email de Cancelamento
- Cancele um agendamento
- Verifique se o email de cancelamento é enviado

### 3. Lembretes Automáticos
- Crie um agendamento para amanhã
- Execute o endpoint de lembretes:
  ```bash
  curl -X POST http://localhost:3000/api/notifications/reminders \
    -H "Authorization: Bearer YOUR_CRON_SECRET"
  ```

## 🔌 Teste das APIs

### 1. Health Check
```bash
curl http://localhost:3000/api/health
```

### 2. Listar Serviços
```bash
curl http://localhost:3000/api/services
```

### 3. Listar Barbeiros
```bash
curl http://localhost:3000/api/barbers
```

### 4. Verificar Disponibilidade
```bash
curl "http://localhost:3000/api/appointments/availability?date=2024-01-15&serviceId=SERVICE_ID"
```

### 5. Criar Agendamento (com token)
```bash
curl -X POST http://localhost:3000/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "serviceId": "service-id",
    "date": "2024-01-15",
    "startTime": "10:00"
  }'
```

## 📱 Teste de Responsividade

### 1. Desktop
- Teste em resoluções: 1920x1080, 1366x768
- Verifique se todos os elementos estão visíveis
- Teste hover effects

### 2. Tablet
- Teste em resolução: 768x1024
- Verifique adaptação do layout
- Teste navegação mobile

### 3. Mobile
- Teste em resolução: 375x667 (iPhone SE)
- Verifique botão flutuante
- Teste menu hambúrguer
- Verifique formulários

## 🐛 Cenários de Erro

### 1. Tentar Agendar em Horário Ocupado
- Crie um agendamento para um horário específico
- Tente criar outro agendamento no mesmo horário
- Verifique se retorna erro apropriado

### 2. Cancelar com Menos de 2 Horas
- Crie um agendamento para daqui a 1 hora
- Tente cancelar
- Verifique se retorna erro

### 3. Acesso Não Autorizado
- Tente acessar `/admin` sem ser admin
- Tente acessar APIs sem autenticação
- Verifique redirecionamentos

### 4. Dados Inválidos
- Tente criar agendamento sem dados obrigatórios
- Tente cadastrar com email inválido
- Verifique mensagens de erro

## 🧪 Testes Automatizados

Execute os testes automatizados:

```bash
# Todos os testes
npm test

# Testes em modo watch
npm run test:watch

# Testes com coverage
npm test -- --coverage
```

## 📊 Verificação de Performance

### 1. Tempo de Carregamento
- Meça tempo de carregamento das páginas
- Verifique se está abaixo de 3 segundos

### 2. Queries do Banco
- Monitore queries executadas
- Verifique se não há N+1 queries

### 3. Bundle Size
```bash
npm run build
# Verifique o tamanho dos bundles
```

## 🔍 Checklist Final

- [ ] Todas as páginas carregam corretamente
- [ ] Autenticação funciona em todos os cenários
- [ ] Agendamentos são criados e gerenciados corretamente
- [ ] Emails são enviados nas situações corretas
- [ ] Interface é responsiva em todos os dispositivos
- [ ] APIs retornam dados corretos
- [ ] Validações funcionam adequadamente
- [ ] Testes automatizados passam
- [ ] Performance está adequada
- [ ] Não há erros no console

## 🆘 Troubleshooting

### Problema: Erro de conexão com banco
- Verifique se PostgreSQL está rodando
- Confirme string de conexão no .env

### Problema: Emails não são enviados
- Verifique configurações SMTP
- Teste com credenciais válidas

### Problema: Páginas não carregam
- Verifique se Next.js está rodando
- Confirme se não há erros no console

### Problema: Testes falham
- Execute `npm run prisma:reset`
- Execute `npm run prisma:seed`
- Execute testes novamente
