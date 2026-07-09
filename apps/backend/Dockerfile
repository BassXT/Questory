FROM node:20-bookworm-slim AS dependencies
WORKDIR /app
RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
COPY apps/backend/package.json apps/backend/package.json
COPY apps/frontend/package.json apps/frontend/package.json
RUN npm ci --workspace apps/backend

FROM dependencies AS build
COPY apps/backend apps/backend
RUN npm run prisma:generate -w apps/backend
RUN npm run build -w apps/backend

FROM node:20-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
COPY apps/backend/package.json apps/backend/package.json
COPY apps/frontend/package.json apps/frontend/package.json
RUN npm ci --workspace apps/backend --omit=dev
COPY --from=build /app/apps/backend/dist apps/backend/dist
COPY --from=build /app/apps/backend/prisma apps/backend/prisma
COPY --from=build /app/apps/backend/prisma.config.ts apps/backend/prisma.config.ts
RUN npm run prisma:generate -w apps/backend
EXPOSE 3000
CMD ["sh", "-c", "npm run prisma:deploy -w apps/backend && npm run start:prod -w apps/backend"]
