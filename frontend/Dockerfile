# Étape 1 : builder
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json next.config.mjs ./
RUN npm ci
COPY . .
RUN npm run build

# Étape 2 : runner
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# On ne récupère que l’essentiel du build
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./package-lock.json

RUN npm ci --omit=dev

# Port exposé par Next.js (défini dans package.json → next start)
EXPOSE 3000

CMD ["npm", "run", "start"]