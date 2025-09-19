# 🛠️ Comandos Úteis

Este arquivo contém comandos úteis para desenvolvimento e manutenção do projeto.

## 📦 Instalação e Setup

```bash
# Instalar dependências
npm install

# Gerar cliente Prisma
npm run prisma:generate

# Executar migrações
npm run prisma:migrate

# Popular banco com dados de teste
npm run prisma:seed

# Iniciar em modo desenvolvimento
npm run dev
```

## 🗄️ Banco de Dados

```bash
# Resetar banco de dados (CUIDADO: apaga todos os dados)
npm run prisma:reset

# Abrir Prisma Studio (interface visual do banco)
npm run prisma:studio

# Criar nova migração
npx prisma migrate dev --name nome-da-migracao

# Aplicar migrações em produção
npx prisma migrate deploy

# Gerar cliente Prisma após mudanças no schema
npx prisma generate
```

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com coverage
npm test -- --coverage

# Executar testes específicos
npm test -- --testNamePattern="appointments"
```

## 🐳 Docker

```bash
# Desenvolvimento (apenas banco)
docker-compose -f docker-compose.dev.yml up -d

# Parar containers de desenvolvimento
docker-compose -f docker-compose.dev.yml down

# Produção (aplicação completa)
docker-compose up -d

# Parar containers de produção
docker-compose down

# Ver logs da aplicação
docker-compose logs -f app

# Executar comandos dentro do container
docker-compose exec app npm run prisma:seed
```

## 🔧 Desenvolvimento

```bash
# Build para produção
npm run build

# Iniciar em modo produção
npm start

# Lint do código
npm run lint

# Verificar tipos TypeScript
npx tsc --noEmit
```

## 📧 Email (Desenvolvimento)

Para testar emails em desenvolvimento, você pode usar:

1. **Mailtrap** (recomendado para desenvolvimento):
   - Crie uma conta em https://mailtrap.io
   - Use as credenciais fornecidas no .env

2. **Gmail** (para testes reais):
   - Ative a autenticação de 2 fatores
   - Gere uma senha de app
   - Use no .env

## 🚀 Deploy

### Vercel
```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy para produção
vercel --prod
```

### Docker (VPS)
```bash
# Build da imagem
docker build -t barbearia-app .

# Executar container
docker run -p 3000:3000 --env-file .env barbearia-app
```

## 🐛 Debug

```bash
# Ver logs do Prisma
DEBUG=prisma:* npm run dev

# Ver logs do Next.js
DEBUG=next:* npm run dev

# Ver logs do NextAuth
DEBUG=nextauth:* npm run dev
```

## 📊 Monitoramento

```bash
# Verificar status do banco
npx prisma db pull

# Verificar conexão com banco
npx prisma db execute --stdin
# Digite: SELECT 1;

# Backup do banco (PostgreSQL)
pg_dump -h localhost -U username -d barbearia_db > backup.sql

# Restaurar backup
psql -h localhost -U username -d barbearia_db < backup.sql
```

## 🔍 Troubleshooting

### Problema: Erro de conexão com banco
```bash
# Verificar se PostgreSQL está rodando
pg_isready -h localhost -p 5432

# Verificar variáveis de ambiente
echo $DATABASE_URL
```

### Problema: Erro de migração
```bash
# Resetar migrações
npx prisma migrate reset

# Aplicar migrações manualmente
npx prisma db push
```

### Problema: Erro de build
```bash
# Limpar cache do Next.js
rm -rf .next

# Limpar node_modules
rm -rf node_modules package-lock.json
npm install
```

## 📝 Logs Úteis

```bash
# Logs do sistema (Linux/Mac)
tail -f /var/log/syslog

# Logs do Docker
docker logs -f container_name

# Logs do Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```
