FROM --platform=linux/amd64 node:20-slim

WORKDIR /app

# Copier uniquement les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances, y compris les dépendances optionnelles
RUN npm install --force

# Copier le reste des fichiers de l'application
COPY . .

# Exposer le port utilisé par l'application
EXPOSE 3000

# Définir la commande de démarrage
CMD ["npm", "run", "dev"]