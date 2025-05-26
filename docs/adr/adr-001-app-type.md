# ADR-1 : Choix du type d’application

## Statut
??

## Contexte
La gestion des réservations de parking se fait aujourd’hui par e-mail et Excel. L’application à développer sera utilisée par l’ensemble des employés, qu’ils soient techniques ou non, et devra faciliter le processus de réservation, d’attribution et de suivi des places.

## Décisions
Nous choisissons de réaliser une **application web**.
**Accessibilité** : une web app est accessible depuis n'importe quel navigateur (ordinateur ou mobile), sans avoir besoin d'installer quoi que ce soit
**Maintenance simplifiée** : déploiement centralisé -> pas de mises à jour à faire pour les utilisateurs
**Ajout de features facile** : une web app est facilement évolutive
**Rapidité et facilité de mise en place** : délai court et application simple

## Conséquences
- Besoin d'avoir un sytème d'authentification
- Un back-end sera nécessaire pour l'envoi de notifications