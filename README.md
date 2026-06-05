# AI Compagnon Bank

Projet monorepo contenant une API backend Symfony et une interface frontend (Vite/React).

## Structure principale

- `aicompagnonbank/` : application backend (Symfony, PHP).
  - `bin/console` : utilitaire Symfony
  - `config/` : configuration, clés JWT dans `config/jwt/`
  - `public/` : point d'entrée PHP
  - `tests/` : tests PHPUnit
- `bnk/` : application frontend (Vite, React)
- `package.json` (racine) : scripts utilitaires éventuels

## Prérequis

- Windows (PowerShell)
- PHP 8.x
- Composer
- Node.js (16+ recommended) et npm
- (optionnel) Docker / Docker Compose
- (optionnel) Symfony CLI

## Installation et exécution

Option A — avec Docker Compose (recommandé si fourni) :

PowerShell:

cd aicompagnonbank
docker compose up -d

Option B — en local

Backend :

cd aicompagnonbank
composer install
# copier .env si nécessaire
# cp .env .env.local  # adapter selon votre setup
php bin/console doctrine:migrations:migrate --no-interaction
# lancer le serveur Symfony (ou utiliser votre serveur préféré)
symfony server:start -d

Frontend :

cd bnk
npm install
npm run dev

Le frontend attend par défaut une API sur http://localhost:8080 (vérifier `vite.config.js` et les variables d'environnement si nécessaire).

## Tests

Backend (PHPUnit) :

cd aicompagnonbank
./bin/phpunit

Frontend :

cd bnk
npm test  # si un script test est défini

## Sécurité

Les clés JWT se trouvent dans `aicompagnonbank/config/jwt/` (privée/publique). Ne pas committer de nouvelles clés privées dans le dépôt public.

## Contribution

1. Créer une branche descriptive
2. Ajouter des tests lorsque pertinent
3. Ouvrir une pull request avec description des changements

## Licence

Ajouter les informations de licence appropriées pour ce projet.

---

Pour toute question précise sur l'installation ou l'exécution, indiquer l'erreur rencontrée et la plateforme exacte utilisée.
