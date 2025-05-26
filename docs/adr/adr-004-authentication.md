# ADR-004 : Choix du modèle d'authentification

## Statut
??

## Contexte
Quel type de système d'authentification nous allons choisir ? (oauth, auth interne, ...)

## Décision
Nous avons choisi de mettre en place une **authentification interne**, c’est-à-dire une gestion propre des utilisateurs et de leur mot de passe, avec stockage sécurisé (hachage) en base de données.

# Raisons
- Simplicité de mise en place
- Pas de dépendance à un service externe (OAuth, SSO…)
- Contrôle total sur les règles d’authentification et d’inscription
- Adapté à un usage restreint et interne (limité aux employés de l’organisation)

# Conséquences
- Mise en place d’un système de gestion des comptes utilisateurs (inscription, connexion, mot de passe oublié, etc.)
- Les mots de passe devront être hachés et salés avant stockage
- Un système de gestion de session ou de token JWT devra être mis en place