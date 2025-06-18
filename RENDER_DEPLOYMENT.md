# 🚀 Déploiement GSB Pharmacy sur Render

Guide complet pour déployer Backend, Frontend et Base de données sur Render.

## 📋 Prérequis

1. Un compte GitHub
2. Un compte Render (gratuit) : [render.com](https://render.com)

## 🗄️ Étape 1: Créer la Base de Données MySQL

### 1.1 Aller sur Render
1. Allez sur [render.com](https://render.com)
2. Connectez-vous avec votre compte GitHub
3. Cliquez sur "New" → "PostgreSQL" (ou MySQL)

### 1.2 Configurer MySQL
1. **Name** : `gsb-pharmacy-db`
2. **Database** : `bddfinalgsb`
3. **User** : `gsb_user`
4. **Region** : Choisissez le plus proche
5. **Plan** : Free
6. Cliquez sur "Create Database"

### 1.3 Noter les Informations de Connexion
Render vous donnera :
- **Host** : `xxx.render.com`
- **Port** : `5432` (PostgreSQL) ou `3306` (MySQL)
- **Database** : `bddfinalgsb`
- **User** : `gsb_user`
- **Password** : `xxx`

## 🔧 Étape 2: Déployer le Backend

### 2.1 Créer un Service Web
1. Cliquez sur "New" → "Web Service"
2. Connectez votre repository GitHub
3. Sélectionnez votre repo

### 2.2 Configurer le Backend
1. **Name** : `gsb-pharmacy-backend`
2. **Root Directory** : `back`
3. **Environment** : Node
4. **Build Command** : `npm install`
5. **Start Command** : `npm start`
6. **Plan** : Free

### 2.3 Variables d'Environnement
Ajoutez ces variables :
```env
NODE_ENV=production
DB_HOST=<mysql_host_from_render>
DB_PORT=3306
DB_USER=gsb_user
DB_PASSWORD=<mysql_password_from_render>
DB_NAME=bddfinalgsb
JWT_SECRET=<your_secret_key>
JWT_EXPIRES_IN=24h
CORS_ORIGIN=https://gsb-pharmacy-frontend.onrender.com
```

### 2.4 Déployer
Cliquez sur "Create Web Service"

## 🎨 Étape 3: Déployer le Frontend

### 3.1 Créer un Service Statique
1. Cliquez sur "New" → "Static Site"
2. Connectez votre repository GitHub
3. Sélectionnez votre repo

### 3.2 Configurer le Frontend
1. **Name** : `gsb-pharmacy-frontend`
2. **Root Directory** : `front`
3. **Build Command** : `npm install && npm run build`
4. **Publish Directory** : `dist`
5. **Plan** : Free

### 3.3 Variables d'Environnement
Ajoutez :
```env
VITE_API_URL=https://gsb-pharmacy-backend.onrender.com
```

### 3.4 Déployer
Cliquez sur "Create Static Site"

## 🔗 Étape 4: Configuration Finale

### 4.1 Mettre à Jour les URLs
1. Copiez l'URL de votre frontend Render
2. Mettez à jour `CORS_ORIGIN` dans le backend
3. Redéployez le backend

### 4.2 Initialiser la Base de Données
1. Allez dans les logs du backend
2. Vérifiez que vous voyez :
   ```
   🗄️ Initialisation de la base de données...
   ✅ Base de données 'bddfinalgsb' créée
   🎉 Base de données initialisée avec succès !
   ```

### 4.3 Tester l'Application
1. Ouvrez l'URL de votre frontend
2. Testez la connexion et les fonctionnalités

## 🛠️ Gestion de la Base de Données

### Option 1: Interface Web Render
- Allez dans votre service MySQL
- Cliquez sur "Connect" → "External Database"
- Utilisez un client MySQL local

### Option 2: Outils Locaux
- **MySQL Workbench** (gratuit)
- **DBeaver** (gratuit)
- **TablePlus** (payant)

### Option 3: Scripts
```bash
# Vérifier la base de données
railway run npm run check-db

# Réinitialiser la base de données
railway run npm run init-db
```

## 📊 Avantages de Render

### ✅ Gratuit
- 750 heures/mois de runtime
- Base de données MySQL incluse
- Bandwidth illimité

### ✅ Simple
- Interface intuitive
- Déploiement automatique
- Configuration facile

### ✅ Fiable
- Uptime garanti
- HTTPS automatique
- Monitoring intégré

## 🔒 Sécurité

- Variables d'environnement chiffrées
- Connexions HTTPS automatiques
- Base de données isolée
- Pas d'interfaces web exposées

## 🆘 Dépannage

### Problèmes Courants

1. **Build échoue**
   - Vérifiez les logs de build
   - Assurez-vous que tous les fichiers sont présents

2. **Erreur de connexion DB**
   - Vérifiez les variables d'environnement
   - Assurez-vous que la base de données est démarrée

3. **Erreurs CORS**
   - Vérifiez que `CORS_ORIGIN` pointe vers la bonne URL
   - Redéployez le backend après modification

### Commandes Utiles
```bash
# Voir les logs
render logs

# Redémarrer un service
render service restart

# Vérifier les variables
render service env
```

## 📞 Support

- Documentation Render : [docs.render.com](https://docs.render.com)
- Support Render : Disponible dans l'interface web

---

🎉 **Félicitations !** Votre application GSB Pharmacy est maintenant déployée sur Render ! 