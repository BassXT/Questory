FROM node:20-alpine AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/backend/package.json apps/backend/package.json
COPY apps/frontend/package.json apps/frontend/package.json
RUN npm ci --workspace apps/backend

FROM dependencies AS build
COPY apps/backend apps/backend
RUN npm run prisma:generate -w apps/backend
RUN npm run build -w apps/backend

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
COPY apps/backend/package.json apps/backend/package.json
COPY apps/frontend/package.json apps/frontend/package.json
RUN npm ci --workspace apps/backend --omit=dev
COPY --from=build /app/apps/backend/dist apps/backend/dist
COPY --from=build /app/apps/backend/prisma apps/backend/prisma
EXPOSE 3000
CMD ["npm", "run", "start:prod", "-w", "apps/backend"]
