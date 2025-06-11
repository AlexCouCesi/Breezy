# Étape 1 : build (installation des dépendances)
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Étape 2 : build final (production)
FROM node:18-alpine AS runner
WORKDIR /app

# Copie des dépendances installées
COPY --from=deps /app/node_modules ./node_modules

# Copie du code source
COPY . .

# Variables d'environnement
ENV NODE_ENV=production
# Expose le port sur lequel tourne votre API (défini dans index.js)
EXPOSE 5000

# Commande de démarrage
CMD ["node", "src/index.js"]
