# TerrainBookerV2

## Prérequis

- Nodejs
- npm
- MongoDB

## Installer les dépendances 

```bash
  npm install
```
## Lancer le projet

Créer le fichier .env :
- DB_MONGO=votreurlmongodb
- SESSION_SECRET=votresessionsecret

Ajouter le premier utilisateur Admin :
```bash
node addFirstUser.js
```

Lancer le projet : 
```bash
npm start
```
