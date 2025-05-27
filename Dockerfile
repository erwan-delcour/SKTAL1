FROM postgres:latest

# Définir les variables d’environnement reconnues par l’image officielle PostgreSQL
ENV POSTGRES_USER=archi
ENV POSTGRES_PASSWORD=archi
ENV POSTGRES_DB=db

# Copie le script SQL dans le dossier d'initialisation de PostgreSQL
COPY queries.sql /docker-entrypoint-initdb.d/