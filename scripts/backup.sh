#!/bin/bash

# Script de backup para a Barbearia Elite
# Uso: ./scripts/backup.sh [tipo]
# Tipos: full, data, schema

set -e

BACKUP_TYPE=${1:-full}
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="barbearia_backup_${BACKUP_TYPE}_${TIMESTAMP}.sql"

echo "💾 Iniciando backup do tipo: $BACKUP_TYPE"

# Criar diretório de backup se não existir
mkdir -p $BACKUP_DIR

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

case $BACKUP_TYPE in
    "full")
        echo "📊 Fazendo backup completo do banco de dados..."
        docker-compose exec -T postgres pg_dump -U barbearia_user -d barbearia_db > "$BACKUP_DIR/$BACKUP_FILE"
        ;;
        
    "data")
        echo "📊 Fazendo backup apenas dos dados..."
        docker-compose exec -T postgres pg_dump -U barbearia_user -d barbearia_db --data-only > "$BACKUP_DIR/$BACKUP_FILE"
        ;;
        
    "schema")
        echo "📊 Fazendo backup apenas do schema..."
        docker-compose exec -T postgres pg_dump -U barbearia_user -d barbearia_db --schema-only > "$BACKUP_DIR/$BACKUP_FILE"
        ;;
        
    *)
        echo "❌ Tipo de backup inválido. Use: full, data ou schema"
        exit 1
        ;;
esac

# Comprimir o backup
echo "🗜️ Comprimindo backup..."
gzip "$BACKUP_DIR/$BACKUP_FILE"
BACKUP_FILE="${BACKUP_FILE}.gz"

# Verificar se o backup foi criado com sucesso
if [ -f "$BACKUP_DIR/$BACKUP_FILE" ]; then
    BACKUP_SIZE=$(du -h "$BACKUP_DIR/$BACKUP_FILE" | cut -f1)
    echo "✅ Backup criado com sucesso!"
    echo "📁 Arquivo: $BACKUP_DIR/$BACKUP_FILE"
    echo "📏 Tamanho: $BACKUP_SIZE"
    
    # Manter apenas os últimos 10 backups
    echo "🧹 Limpando backups antigos..."
    ls -t "$BACKUP_DIR"/barbearia_backup_*.sql.gz | tail -n +11 | xargs -r rm
    
    echo ""
    echo "📋 Lista de backups disponíveis:"
    ls -lh "$BACKUP_DIR"/barbearia_backup_*.sql.gz 2>/dev/null || echo "Nenhum backup encontrado"
    
else
    echo "❌ Erro ao criar backup"
    exit 1
fi

echo ""
echo "🎉 Backup concluído com sucesso!"
echo "💡 Para restaurar um backup, use:"
echo "   ./scripts/restore.sh $BACKUP_FILE"
