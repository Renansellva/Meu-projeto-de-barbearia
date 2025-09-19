#!/bin/bash

# Script de deploy para a Barbearia Elite
# Uso: ./scripts/deploy.sh [ambiente]
# Ambientes: dev, staging, prod

set -e

ENVIRONMENT=${1:-dev}
PROJECT_NAME="barbearia-elite"

echo "🚀 Iniciando deploy para ambiente: $ENVIRONMENT"

# Verificar se o Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker e tente novamente."
    exit 1
fi

# Verificar se o arquivo .env existe
if [ ! -f .env ]; then
    echo "❌ Arquivo .env não encontrado. Copie o env.example e configure as variáveis."
    exit 1
fi

case $ENVIRONMENT in
    "dev")
        echo "🔧 Deploy para desenvolvimento..."
        
        # Parar containers existentes
        docker-compose -f docker-compose.dev.yml down
        
        # Iniciar apenas o banco de dados
        docker-compose -f docker-compose.dev.yml up -d postgres
        
        # Aguardar o banco estar pronto
        echo "⏳ Aguardando banco de dados..."
        sleep 10
        
        # Executar migrações
        echo "📊 Executando migrações..."
        npm run prisma:migrate
        
        # Executar seed
        echo "🌱 Populando banco com dados de teste..."
        npm run prisma:seed
        
        echo "✅ Deploy de desenvolvimento concluído!"
        echo "📱 Acesse: http://localhost:3000"
        echo "🗄️ pgAdmin: http://localhost:5050 (admin@barbearia.com / admin123)"
        ;;
        
    "staging")
        echo "🔧 Deploy para staging..."
        
        # Build da aplicação
        echo "🏗️ Fazendo build da aplicação..."
        npm run build
        
        # Parar containers existentes
        docker-compose down
        
        # Iniciar aplicação
        docker-compose up -d
        
        # Aguardar aplicação estar pronta
        echo "⏳ Aguardando aplicação..."
        sleep 15
        
        # Executar migrações
        echo "📊 Executando migrações..."
        docker-compose exec app npm run prisma:migrate
        
        echo "✅ Deploy de staging concluído!"
        echo "📱 Acesse: http://localhost:3000"
        ;;
        
    "prod")
        echo "🔧 Deploy para produção..."
        
        # Verificar se todas as variáveis de ambiente estão configuradas
        required_vars=("DATABASE_URL" "NEXTAUTH_SECRET" "SMTP_HOST" "SMTP_USER" "SMTP_PASS")
        for var in "${required_vars[@]}"; do
            if [ -z "${!var}" ]; then
                echo "❌ Variável de ambiente $var não está configurada"
                exit 1
            fi
        done
        
        # Build da aplicação
        echo "🏗️ Fazendo build da aplicação..."
        npm run build
        
        # Parar containers existentes
        docker-compose down
        
        # Iniciar aplicação
        docker-compose up -d
        
        # Aguardar aplicação estar pronta
        echo "⏳ Aguardando aplicação..."
        sleep 20
        
        # Executar migrações
        echo "📊 Executando migrações..."
        docker-compose exec app npm run prisma:migrate
        
        # Verificar saúde da aplicação
        echo "🏥 Verificando saúde da aplicação..."
        if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
            echo "✅ Aplicação está funcionando corretamente!"
        else
            echo "⚠️ Aplicação pode não estar funcionando corretamente"
        fi
        
        echo "✅ Deploy de produção concluído!"
        echo "📱 Acesse: http://localhost:3000"
        ;;
        
    *)
        echo "❌ Ambiente inválido. Use: dev, staging ou prod"
        exit 1
        ;;
esac

echo ""
echo "🎉 Deploy concluído com sucesso!"
echo "📋 Próximos passos:"
echo "   1. Verifique se a aplicação está funcionando"
echo "   2. Teste as funcionalidades principais"
echo "   3. Configure o monitoramento se necessário"
echo ""
echo "🔧 Comandos úteis:"
echo "   - Ver logs: docker-compose logs -f app"
echo "   - Acessar banco: docker-compose exec postgres psql -U barbearia_user -d barbearia_db"
echo "   - Parar aplicação: docker-compose down"
