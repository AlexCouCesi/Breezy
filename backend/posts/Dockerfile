# Image officielle Node.js
FROM node:20

# Définit le répertoire de travail dans le conteneur
WORKDIR /app

# Copie uniquement les fichiers de dépendances pour optimiser le cache Docker
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du reste des fichiers du projet dans le conteneur
COPY . .

# Expose le port 5000
EXPOSE 5000

# Commande de lancement du serveur
CMD ["npm", "start"]
