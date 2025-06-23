# Utilise l'image officielle Node.js
FROM node:20

# Définit le répertoire de travail dans le conteneur
WORKDIR /app

# Copie uniquement les fichiers de dépendances pour profiter du cache Docker
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie le reste des fichiers du projet
COPY . .

# Commande de démarrage du service (fichier principal du backend)
CMD [ "node", "src/index.js" ]
