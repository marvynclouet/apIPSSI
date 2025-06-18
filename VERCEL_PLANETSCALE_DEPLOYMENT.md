# 🚀 Déploiement GSB Pharmacy : Vercel + PlanetScale + Render

Solution gratuite pour déployer les 3 composants sans limite.

## 📋 Architecture

- **Frontend** : Vercel (gratuit)
- **Base de données** : PlanetScale (gratuit)
- **Backend** : Render (gratuit)

## 🗄️ Étape 1: Base de Données PlanetScale

### 1.1 Créer un compte PlanetScale
1. Allez sur [planetscale.com](https://planetscale.com)
2. Connectez-vous avec GitHub
3. Cliquez "New Database"

### 1.2 Configurer la Base de Données
1. **Name** : `gsb-pharmacy-db`
2. **Region** : Choisissez le plus proche
3. **Plan** : Hobby (gratuit)
4. Cliquez "Create Database"

### 1.3 Obtenir les Informations de Connexion
1. Allez dans "Settings" → "Passwords"
2. Cliquez "New Password"
3. Notez :
   - **Host** : `aws.connect.psdb.cloud`
   - **Port** : `3306`
   - **Database** : `gsb-pharmacy-db`
   - **Username** : `votre_username`
   - **Password** : `votre_password`

### 1.4 Interface Web PlanetScale
- Allez dans "Console" pour gérer votre base de données
- Interface web complète (comme phpMyAdmin)
- Importez votre fichier `bddfinalgsb.sql`

## 🔧 Étape 2: Backend sur Render

### 2.1 Créer un Service Web
1. Allez sur [render.com](https://render.com)
2. Cliquez "New" → "Web Service"
3. Connectez votre repository GitHub

### 2.2 Configurer le Backend
1. **Name** : `gsb-pharmacy-backend`
2. **Root Directory** : `back`
3. **Environment** : Node
4. **Build Command** : `npm install`
5. **Start Command** : `npm start`
6. **Plan** : Free

### 2.3 Variables d'Environnement
```env
NODE_ENV=production
DB_HOST=aws.connect.psdb.cloud
DB_PORT=3306
DB_USER=<votre_username_planetscale>
DB_PASSWORD=<votre_password_planetscale>
DB_NAME=gsb-pharmacy-db
JWT_SECRET=<your_secret_key>
JWT_EXPIRES_IN=24h
CORS_ORIGIN=https://gsb-pharmacy.vercel.app
```

### 2.4 Déployer
Cliquez "Create Web Service"

## 🎨 Étape 3: Frontend sur Vercel

### 3.1 Créer un Projet Vercel
1. Allez sur [vercel.com](https://vercel.com)
2. Connectez-vous avec GitHub
3. Cliquez "New Project"
4. Sélectionnez votre repository

### 3.2 Configurer le Frontend
1. **Framework Preset** : Vite
2. **Root Directory** : `front`
3. **Build Command** : `npm run build`
4. **Output Directory** : `dist`
5. **Install Command** : `npm install`

### 3.3 Variables d'Environnement
```env
VITE_API_URL=https://gsb-pharmacy-backend.onrender.com
```

### 3.4 Déployer
Cliquez "Deploy"

## 🔗 Étape 4: Configuration Finale

### 4.1 Mettre à Jour les URLs
1. Copiez l'URL de votre frontend Vercel
2. Mettez à jour `CORS_ORIGIN` dans le backend Render
3. Redéployez le backend

### 4.2 Initialiser la Base de Données
1. Allez dans PlanetScale Console
2. Créez une nouvelle branche "main"
3. Importez le fichier `back/bddfinalgsb.sql`
4. Ou utilisez le script d'initialisation automatique

### 4.3 Tester l'Application
1. Ouvrez l'URL de votre frontend Vercel
2. Testez toutes les fonctionnalités

## 🛠️ Gestion de la Base de Données

### Interface Web PlanetScale
- **Console** : Interface web complète
- **Schema** : Visualisation des tables
- **Data** : Visualisation des données
- **Deploy Requests** : Gestion des migrations

### Outils Locaux
- **MySQL Workbench** (gratuit)
- **DBeaver** (gratuit)
- **TablePlus** (payant)

## 📊 Avantages de Cette Solution

### ✅ Gratuit
- **Vercel** : Déploiement frontend gratuit
- **PlanetScale** : MySQL gratuit (1GB)
- **Render** : Backend gratuit (750h/mois)

### ✅ Performant
- **Vercel** : CDN global, déploiement ultra-rapide
- **PlanetScale** : MySQL compatible, très rapide
- **Render** : Backend fiable et stable

### ✅ Interface Web
- **PlanetScale Console** : Interface web complète
- **Vercel Dashboard** : Monitoring frontend
- **Render Dashboard** : Monitoring backend

## 🔒 Sécurité

- Variables d'environnement chiffrées
- HTTPS automatique sur tous les services
- Base de données isolée et sécurisée
- Authentification GitHub

## 🆘 Dépannage

### Problèmes Courants

1. **Connexion PlanetScale**
   - Vérifiez les credentials
   - Assurez-vous que la base est active

2. **CORS Errors**
   - Vérifiez `CORS_ORIGIN` dans le backend
   - Assurez-vous que l'URL frontend est correcte

3. **Build Vercel**
   - Vérifiez que le dossier `front` contient un `package.json`
   - Assurez-vous que `npm run build` fonctionne

### Commandes Utiles
```bash
# Tester localement
cd front && npm run build
cd back && npm start

# Vérifier la base de données
npm run check-db
```

## 📞 Support

- **Vercel** : [vercel.com/docs](https://vercel.com/docs)
- **PlanetScale** : [planetscale.com/docs](https://planetscale.com/docs)
- **Render** : [docs.render.com](https://docs.render.com)

---

🎉 **Félicitations !** Votre application est maintenant déployée sur 3 services gratuits ! 