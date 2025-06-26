# Utilise l'image officielle Node.js (version LTS recommandée)
FROM node:20

# Répertoire de travail dans le conteneur
WORKDIR /app

# Copie des fichiers de dépendances pour optimiser le cache Docker
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie de tous les fichiers du projet
COPY . .

# Build de l’application Next.js (génère le dossier .next)
RUN npm run build

# Exposition du port 3000 (port par défaut de Next.js en mode production)
EXPOSE 3000

# Commande de démarrage (Next.js doit être en mode production)
CMD ["npm", "start"]
