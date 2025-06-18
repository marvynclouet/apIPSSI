# 🚀 Guide de Déploiement GSB Pharmacy sur Railway

Ce guide vous explique comment déployer facilement et gratuitement votre application GSB Pharmacy sur Railway.

## 📋 Prérequis

1. Un compte GitHub
2. Un compte Railway (gratuit)
3. Les fichiers de ce projet

## 🗄️ Étape 1: Déployer la Base de Données MySQL

### 1.1 Créer un projet Railway
1. Allez sur [railway.app](https://railway.app)
2. Connectez-vous avec votre compte GitHub
3. Cliquez sur "New Project"
4. Sélectionnez "Deploy from GitHub repo"

### 1.2 Ajouter MySQL
1. Dans votre projet Railway, cliquez sur "New"
2. Sélectionnez "Database" → "MySQL"
3. Railway va créer automatiquement une base de données MySQL

### 1.3 Initialisation Automatique de la Base de Données
✅ **BONNE NOUVELLE** : Votre application initialise automatiquement la base de données !

Le script `init-database.js` s'exécute automatiquement au démarrage et :
- Crée la base de données `bddfinalgsb`
- Importe automatiquement le fichier `bddfinalgsb.sql`
- Configure toutes les tables et données initiales

## 🔧 Étape 2: Déployer le Backend

### 2.1 Créer un nouveau service pour le backend
1. Dans votre projet Railway, cliquez sur "New"
2. Sélectionnez "GitHub Repo"
3. Connectez votre repository GitHub
4. Sélectionnez le dossier `back`

### 2.2 Configurer les variables d'environnement
Dans les paramètres du service backend, ajoutez ces variables :

```env
DB_HOST=your_mysql_host_from_railway
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password_from_railway
DB_NAME=bddfinalgsb
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-url.railway.app
```

### 2.3 Obtenir les informations de connexion MySQL
1. Allez dans votre service MySQL
2. Cliquez sur "Connect"
3. Copiez les informations de connexion
4. Mettez à jour les variables d'environnement du backend

## 🎨 Étape 3: Déployer le Frontend

### 3.1 Créer un nouveau service pour le frontend
1. Dans votre projet Railway, cliquez sur "New"
2. Sélectionnez "GitHub Repo"
3. Connectez votre repository GitHub
4. Sélectionnez le dossier `front`

### 3.2 Configurer les variables d'environnement
Ajoutez cette variable :
```env
VITE_API_URL=https://your-backend-url.railway.app
```

### 3.3 Mettre à jour l'URL de l'API
Dans `front/src/services/api.js`, assurez-vous que l'URL pointe vers votre backend Railway.

## 🔗 Étape 4: Configuration finale

### 4.1 Mettre à jour les URLs
1. Copiez l'URL de votre frontend Railway
2. Mettez à jour `CORS_ORIGIN` dans les variables d'environnement du backend
3. Redéployez le backend

### 4.2 Vérifier l'initialisation de la base de données
1. Allez dans les logs de votre service backend
2. Vérifiez que vous voyez ces messages :
   ```
   🗄️ Initialisation de la base de données...
   ✅ Connexion à MySQL établie
   ✅ Base de données 'bddfinalgsb' créée ou vérifiée
   📄 Lecture du fichier SQL...
   🔧 Exécution de X requêtes...
   🎉 Base de données initialisée avec succès !
   ```

### 4.3 Tester l'application
1. Ouvrez l'URL de votre frontend
2. Testez la connexion et les fonctionnalités
3. Vérifiez les logs dans Railway si nécessaire

## 🛠️ Gestion de la Base de Données

### Option 1: Outils Locaux (Recommandé)
- **MySQL Workbench** (gratuit) : [Télécharger](https://dev.mysql.com/downloads/workbench/)
- **DBeaver** (gratuit) : [Télécharger](https://dbeaver.io/)
- **TablePlus** (payant) : [Télécharger](https://tableplus.com/)

### Option 2: Scripts de Gestion
```bash
# Vérifier la base de données
railway run npm run init-db

# Exécuter des requêtes SQL
railway run mysql -u root -p -h your-mysql-host.railway.app
```

### Option 3: Adminer (Interface Web)
Vous pouvez déployer Adminer sur Railway pour une interface web :
1. Créez un nouveau service Railway
2. Utilisez le template `adminer/adminer`
3. Configurez les variables d'environnement

Consultez [DATABASE_MANAGEMENT.md](./DATABASE_MANAGEMENT.md) pour plus de détails.

## 📊 Monitoring

- **Logs** : Disponibles dans chaque service Railway
- **Métriques** : Railway fournit des métriques de base gratuitement
- **Base de données** : Accessible via les outils mentionnés ci-dessus

## 🔒 Sécurité

- Les variables d'environnement sont chiffrées
- Les connexions utilisent HTTPS automatiquement
- La base de données est isolée
- L'initialisation automatique évite l'exposition d'interfaces web

## 💰 Coûts

- **Gratuit** : 500 heures/mois de runtime
- **Base de données** : 1GB de stockage gratuit
- **Bandwidth** : 100GB/mois gratuit

## 🆘 Dépannage

### Problèmes courants :

1. **Erreur de connexion à la base de données**
   - Vérifiez les variables d'environnement
   - Assurez-vous que la base de données est démarrée
   - Consultez les logs d'initialisation

2. **Erreurs CORS**
   - Vérifiez que `CORS_ORIGIN` pointe vers la bonne URL
   - Redéployez le backend après modification

3. **Build échoue**
   - Vérifiez les logs de build dans Railway
   - Assurez-vous que tous les fichiers sont présents

4. **Base de données non initialisée**
   - Vérifiez les logs du backend
   - Exécutez manuellement : `railway run npm run init-db`

## 📞 Support

- Documentation Railway : [docs.railway.app](https://docs.railway.app)
- Gestion de la base de données : [DATABASE_MANAGEMENT.md](./DATABASE_MANAGEMENT.md)
- Support Railway : Disponible dans l'interface web

---

🎉 **Félicitations !** Votre application GSB Pharmacy est maintenant déployée et accessible en ligne ! 