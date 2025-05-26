# ADR-2 : Choix de l'architecture web

## Statut
??

## Contexte
Décider du type d'architecture pour l'application web

## Décisions
Nous allons faire une application qui est composé d'un front-end en Next, et un back-end qui sera une API REST en Typescript
**Séparation des responsabilités** : le front et le back peuvent évoluer indépendemment
**Développement parallèle** : les équipes peuvent travailler en parallèle sur l’interface et les APIs
**Interopérabilité** : l’API REST pourra être utilisée par d’autres clients (ex. : appli mobile) si besoin

## Conséquences
- Nécessité de mettre en place une connexion sécurisée entre notre front-end et notre API REST
- Besoin d'héberger deux applications
- L’API devra gérer la logique métier, les notifications, la persistance des données et la sécurité des endpoints
- Le front-end se concentrera sur l’expérience utilisateur, la navigation et l’intégration avec l’API
