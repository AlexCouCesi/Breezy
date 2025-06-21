# Utilise l'image officielle Node.js (version LTS 20)
FROM node:20

# Définit le répertoire de travail à l’intérieur du conteneur
WORKDIR /app

# Copie uniquement les fichiers de dépendances (package.json + lock si présent)
COPY package*.json ./

# Installe les dépendances Node.js
RUN npm install

# Copie le reste du code de l'application dans le conteneur
COPY . .

# Expose le port 5001 (doit correspondre au port défini dans .env et server.js)
EXPOSE 5001

# Lance l'application via le script "start" défini dans package.json
CMD ["npm", "start"]
