# ADR-003 : Choix de la base de données

## Statut
??

## Contexte
Pourquoi choisir une base relationnelle (PostgreSQL, MySQL) ou NoSQL (MongoDB) ?

## Décision
On choisit une base relationnelle, une PostgreSQL.

## Raisons
- Besoin de relations entre utilisateurs, réservations, historique

## Conséquences
- Gestion d'une base de données
- Connexion de celle ci avec l'API REST