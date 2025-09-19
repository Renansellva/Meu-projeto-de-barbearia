#!/bin/bash

# Script de restore para a Barbearia Elite
# Uso: ./scripts/restore.sh [arquivo_backup]

set -e

BACKUP_FILE=$1
BACKUP_DIR="./backups"

if [ -z "$BACKUP_FILE" ]; then
    echo "❌ Por favor, especifique o arquivo de backup"
    echo "Uso: ./scripts/restore.sh [arquivo_backup]"
    echo ""
    echo "📋 Backups disponíveis:"
    ls -lh "$BACKUP_DIR"/barbearia_backup_*.sql.gz 2>/dev/null || echo "Nenhum backup encontrado"
    exit 1
fi

# Verificar se o arquivo de backup existe
if [ ! -f "$BACKUP_DIR/$BACKUP_FILE" ]; then
    echo "❌ Arquivo de backup não encontrado: $BACKUP_DIR/$BACKUP_FILE"
    echo ""
    echo "📋 Backups disponíveis:"
    ls -lh "$BACKUP_DIR"/barbearia_backup_*.sql.gz 2>/dev/null || echo "Nenhum backup encontrado"
    exit 1
fi

echo "🔄 Iniciando restore do backup: $BACKUP_FILE"

# Verificar se o Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker e tente novamente."
    exit 1
fi

# Verificar se o container do PostgreSQL está rodando
if ! docker-compose ps postgres | grep -q "Up"; then
    echo "❌ Container do PostgreSQL não está rodando. Inicie o banco de dados primeiro."
    exit 1
fi

# Confirmar a operação
echo "⚠️ ATENÇÃO: Esta operação irá substituir todos os dados atuais do banco!"
echo "📁 Arquivo: $BACKUP_DIR/$BACKUP_FILE"
read -p "Tem certeza que deseja continuar? (digite 'sim' para confirmar): " confirm

if [ "$confirm" != "sim" ]; then
    echo "❌ Operação cancelada pelo usuário"
    exit 1
fi

# Fazer backup do estado atual antes do restore
echo "💾 Fazendo backup do estado atual..."
CURRENT_BACKUP="barbearia_backup_before_restore_$(date +"%Y%m%d_%H%M%S").sql"
docker-compose exec -T postgres pg_dump -U barbearia_user -d barbearia_db > "$BACKUP_DIR/$CURRENT_BACKUP"
gzip "$BACKUP_DIR/$CURRENT_BACKUP"
echo "✅ Backup do estado atual salvo como: $CURRENT_BACKUP.gz"

# Restaurar o backup
echo "🔄 Restaurando backup..."

# Se o arquivo estiver comprimido, descomprimir temporariamente
if [[ "$BACKUP_FILE" == *.gz ]]; then
    echo "🗜️ Descomprimindo backup..."
    gunzip -c "$BACKUP_DIR/$BACKUP_FILE" | docker-compose exec -T postgres psql -U barbearia_user -d barbearia_db
else
    docker-compose exec -T postgres psql -U barbearia_user -d barbearia_db < "$BACKUP_DIR/$BACKUP_FILE"
fi

# Verificar se o restore foi bem-sucedido
if [ $? -eq 0 ]; then
    echo "✅ Restore concluído com sucesso!"
    
    # Executar migrações para garantir que o schema esteja atualizado
    echo "📊 Executando migrações..."
    npm run prisma:migrate
    
    echo ""
    echo "🎉 Restore concluído com sucesso!"
    echo "📱 A aplicação deve estar funcionando normalmente"
    echo "💡 Se houver problemas, você pode restaurar o backup anterior:"
    echo "   ./scripts/restore.sh $CURRENT_BACKUP.gz"
    
else
    echo "❌ Erro durante o restore"
    echo "💡 Você pode restaurar o backup anterior:"
    echo "   ./scripts/restore.sh $CURRENT_BACKUP.gz"
    exit 1
fi
