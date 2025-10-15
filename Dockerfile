# ---------- Base Stage ----------
FROM node:24-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install -g @nestjs/cli

# ---------- Development Stage ----------
FROM base AS development
ENV NODE_ENV=development
RUN npm install
RUN npx prisma generate
# COPY . .
CMD ["npm", "run", "start:dev"]

# ---------- Build Stage (Production Prep) ----------
FROM base AS build
ENV NODE_ENV=production
RUN npm ci
COPY . .
RUN npm run build

# ---------- Production Stage ----------
FROM node:24-alpine AS production
WORKDIR /app

# Only copy the dist and production deps
COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

CMD ["node", "dist/main"]