# Build 
FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm install

# Copie du code source
COPY . .

# Expose le port de l'API
EXPOSE 3000

# Démarrage
CMD [ "node", "src/index.js" ]