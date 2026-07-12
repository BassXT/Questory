#!/usr/bin/env sh
set -eu

STACK_NAME="${STACK_NAME:-questory}"
SERVICE_NAME="${SERVICE_NAME:-db}"
TEST_FAMILY_PATTERN="${TEST_FAMILY_PATTERN:-%2026%}"
MIN_AGE_DAYS="${MIN_AGE_DAYS:-0}"
LIMIT="${LIMIT:-20}"
EXECUTE="${EXECUTE:-false}"
CONFIRM="${CONFIRM:-}"

case "$MIN_AGE_DAYS" in
  ''|*[!0-9]*)
    echo "MIN_AGE_DAYS must be a non-negative integer." >&2
    exit 1
    ;;
esac

case "$LIMIT" in
  ''|*[!0-9]*)
    echo "LIMIT must be a positive integer." >&2
    exit 1
    ;;
esac

if [ "$LIMIT" -le 0 ]; then
  echo "LIMIT must be greater than 0." >&2
  exit 1
fi

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

echo "Questory test family cleanup"
echo "Stack: ${STACK_NAME}"
echo "Service: ${SERVICE_NAME}"
echo "Pattern: ${TEST_FAMILY_PATTERN}"
echo "Minimum age in days: ${MIN_AGE_DAYS}"
echo "Limit: ${LIMIT}"

if [ "$EXECUTE" = "true" ]; then
  if [ "$CONFIRM" != "DELETE_TEST_FAMILIES" ]; then
    echo "Refusing to delete. Set CONFIRM=DELETE_TEST_FAMILIES together with EXECUTE=true." >&2
    exit 1
  fi

  echo "Mode: DELETE"
  docker exec \
    -e TEST_FAMILY_PATTERN="$TEST_FAMILY_PATTERN" \
    -e MIN_AGE_DAYS="$MIN_AGE_DAYS" \
    -e LIMIT="$LIMIT" \
    -i "$db_container" \
    sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -v ON_ERROR_STOP=1 -v pattern="$TEST_FAMILY_PATTERN" -v min_age_days="$MIN_AGE_DAYS" -v row_limit="$LIMIT"' <<'SQL'
WITH candidate AS (
  SELECT id, name, "createdAt"
  FROM "Family"
  WHERE name ILIKE :'pattern'
    AND "createdAt" < now() - (:'min_age_days' || ' days')::interval
  ORDER BY "createdAt" ASC
  LIMIT :row_limit
),
deleted AS (
  DELETE FROM "Family" AS f
  USING candidate AS c
  WHERE f.id = c.id
  RETURNING f.id, f.name, f."createdAt"
)
SELECT id, name, "createdAt"
FROM deleted
ORDER BY "createdAt" ASC;
SQL
else
  echo "Mode: DRY RUN"
  docker exec \
    -e TEST_FAMILY_PATTERN="$TEST_FAMILY_PATTERN" \
    -e MIN_AGE_DAYS="$MIN_AGE_DAYS" \
    -e LIMIT="$LIMIT" \
    -i "$db_container" \
    sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -v ON_ERROR_STOP=1 -v pattern="$TEST_FAMILY_PATTERN" -v min_age_days="$MIN_AGE_DAYS" -v row_limit="$LIMIT"' <<'SQL'
WITH candidate AS (
  SELECT id, name, "createdAt"
  FROM "Family"
  WHERE name ILIKE :'pattern'
    AND "createdAt" < now() - (:'min_age_days' || ' days')::interval
  ORDER BY "createdAt" ASC
  LIMIT :row_limit
)
SELECT id, name, "createdAt"
FROM candidate
ORDER BY "createdAt" ASC;
SQL
  echo "Dry run only. To delete exactly these kinds of rows, rerun with EXECUTE=true CONFIRM=DELETE_TEST_FAMILIES."
fi
