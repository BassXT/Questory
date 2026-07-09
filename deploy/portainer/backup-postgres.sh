#!/usr/bin/env sh
set -eu

STACK_NAME="${STACK_NAME:-questory}"
SERVICE_NAME="${SERVICE_NAME:-db}"
BACKUP_DIR="${BACKUP_DIR:-/opt/questory/backups}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"

timestamp="$(date +%Y%m%d-%H%M%S)"
backup_file="${BACKUP_DIR}/questory-postgres-${timestamp}.dump"
tmp_file="${backup_file}.tmp"

mkdir -p "$BACKUP_DIR"

db_container="$(
  docker ps \
    --filter "label=com.docker.compose.project=${STACK_NAME}" \
    --filter "label=com.docker.compose.service=${SERVICE_NAME}" \
    --format '{{.ID}}' \
    | head -n 1
)"

if [ -z "$db_container" ]; then
  echo "Could not find PostgreSQL container for stack '${STACK_NAME}' service '${SERVICE_NAME}'." >&2
  exit 1
fi

docker exec "$db_container" sh -c \
  'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --format=custom --no-owner --no-acl' \
  > "$tmp_file"

mv "$tmp_file" "$backup_file"

find "$BACKUP_DIR" \
  -name 'questory-postgres-*.dump' \
  -type f \
  -mtime +"$RETENTION_DAYS" \
  -delete

echo "Backup created: $backup_file"
