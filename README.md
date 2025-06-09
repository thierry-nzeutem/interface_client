# Interface client

Ce dépôt contient l'interface utilisateur du système ERP **Prévéris**. Elle est développée avec React, Vite et Tailwind CSS et constitue la partie frontale de la solution.

## Prérequis

- [Node.js](https://nodejs.org/) et npm installés

## Installation des dépendances

```bash
npm install
```

## Démarrer l'environnement de développement

```bash
npm run dev
```

## Générer la version de production

```bash
npm run build
```

## Exécuter les tests unitaires

Les tests sont écrits avec [Vitest](https://vitest.dev/) et s'exécutent dans un environnement **jsdom** pour tester les composants React.
Utilisez la commande suivante pour démarrer la suite en mode surveillance :

```bash
npm test
```

Pour lancer les tests une seule fois (utile dans une intégration continue) :

```bash
npm test -- --run
```

