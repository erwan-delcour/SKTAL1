# SKTAL1 - Backend
Pour initialiser la base de données, exécuter la commande suivante depuis la racine du projet :

```bash
docker build -t my-postgres-image .  
```
et ensuite : 

```bash
docker run --name my-postgres-container -p 5432:5432 -d my-postgres-image
```

Après cela, depuis votre terminal, rendez vous dans le dossier `backend` et exécutez la commande suivante : 
```bash
npm install
```
Puis, pour démarrer le serveur backend, exécutez la commande suivante :

```bash
npm run dev
```


# SKTAL1 - Frontend

Pour initialiser le front, rendez vous dans le dossier `frontend` et exécutez la commande suivante :

```bash
npm install
```

Puis, pour démarrer le serveur backend, exécutez la commande suivante :

```bash
npm run dev
```