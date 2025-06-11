# Build 
FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm install

# Copie du code source
COPY . .

# Démarrage
CMD [ "node", "src/index.js" ]