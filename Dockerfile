# ---------- Base Stage ----------
FROM node:24-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install -g @nestjs/cli

# ---------- Development Stage ----------
FROM base AS development
ENV NODE_ENV=development
RUN npm install
# COPY . .
CMD ["npm", "run", "start:dev"]

# ---------- Build Stage (Production Prep) ----------
FROM base AS build
ENV NODE_ENV=production
RUN npm ci
COPY . .
RUN npm run build
RUN npx prisma generate

# ---------- Production Stage ----------
FROM node:24-alpine AS production
WORKDIR /usr/src/app

# Only copy the dist and production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled dist and generated Prisma client from build stage
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/generated ./generated

CMD ["node", "dist/main"]