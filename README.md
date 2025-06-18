# 🏥 GSB Pharmacy - Application de Gestion de Pharmacie

Une application complète de gestion de pharmacie avec interface web moderne et API REST.

## 🚀 Déploiement Rapide

Pour déployer facilement et gratuitement cette application :

1. **Lisez le guide complet** : [DEPLOYMENT.md](./DEPLOYMENT.md)
2. **Exécutez le script** : `./deploy.sh`

## 📁 Structure du Projet

```
gsbNewWeb-main/
├── back/                 # Backend Node.js/Express
│   ├── config/          # Configuration base de données
│   ├── controllers/     # Contrôleurs API
│   ├── middleware/      # Middleware d'authentification
│   ├── routes/          # Routes API
│   └── server.js        # Serveur principal
├── front/               # Frontend React/Vite
│   ├── src/
│   │   ├── components/  # Composants React
│   │   ├── pages/       # Pages de l'application
│   │   ├── services/    # Services API
│   │   └── styles/      # Fichiers CSS
│   └── public/          # Assets statiques
└── mobile/              # Application mobile (en développement)
```

## 🛠️ Technologies Utilisées

### Backend
- **Node.js** + **Express.js**
- **MySQL** (base de données)
- **JWT** (authentification)
- **bcrypt** (chiffrement des mots de passe)
- **CORS** (Cross-Origin Resource Sharing)

### Frontend
- **React 19** + **Vite**
- **React Router** (navigation)
- **Material-UI** (interface utilisateur)
- **Tailwind CSS** (styles)
- **React Icons** (icônes)

## 🗄️ Base de Données

La base de données MySQL contient :
- **Utilisateurs** : clients et administrateurs
- **Médicaments** : catalogue des produits
- **Commandes** : gestion des achats
- **Statistiques** : données analytiques

## 🔐 Fonctionnalités

### Pour les Clients
- ✅ Inscription et connexion
- ✅ Parcourir le catalogue de médicaments
- ✅ Ajouter au panier
- ✅ Passer des commandes
- ✅ Consulter l'historique des commandes
- ✅ Gérer le profil utilisateur

### Pour les Administrateurs
- ✅ Gestion des utilisateurs
- ✅ Gestion du catalogue de médicaments
- ✅ Gestion des commandes
- ✅ Tableau de bord avec statistiques
- ✅ Interface d'administration complète

## 🚀 Démarrage Local

### Prérequis
- Node.js (v18+)
- MySQL (v8+)
- npm ou yarn

### Backend
```bash
cd back
npm install
npm run dev
```

### Frontend
```bash
cd front
npm install
npm run dev
```

### Base de données
1. Créez une base de données MySQL `bddfinalgsb`
2. Importez le fichier `back/bddfinalgsb.sql`
3. Configurez les variables d'environnement

## 🌐 Déploiement

### Option 1 : Railway (Recommandé)
- **Gratuit** et facile à configurer
- **Base de données MySQL** incluse
- **phpMyAdmin** pour la gestion
- **HTTPS automatique**

Consultez [DEPLOYMENT.md](./DEPLOYMENT.md) pour les instructions détaillées.

### Option 2 : Autres plateformes
- **Heroku** (payant)
- **Vercel** (frontend gratuit)
- **Netlify** (frontend gratuit)
- **DigitalOcean** (payant)

## 📊 Monitoring et Logs

- **Logs en temps réel** via Railway
- **Métriques de performance**
- **Gestion des erreurs**
- **Health checks automatiques**

## 🔒 Sécurité

- **Authentification JWT**
- **Chiffrement des mots de passe**
- **Protection CORS**
- **Rate limiting**
- **Validation des données**
- **HTTPS obligatoire en production**

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

- **Documentation** : [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Issues** : Utilisez les GitHub Issues
- **Email** : contact@gsb-pharmacy.com

---

⭐ **N'oubliez pas de donner une étoile au projet si vous l'aimez !** # apIPSSI
