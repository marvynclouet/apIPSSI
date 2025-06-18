# ⚡ Déploiement Rapide GSB Pharmacy (Sans phpMyAdmin)

Guide de déploiement simplifié pour Railway sans phpMyAdmin.

## 🚀 Déploiement en 5 Étapes

### 1️⃣ Créer le Projet Railway
1. Allez sur [railway.app](https://railway.app)
2. Connectez-vous avec GitHub
3. Cliquez "New Project" → "Deploy from GitHub repo"

### 2️⃣ Ajouter MySQL
1. Dans votre projet, cliquez "New"
2. Sélectionnez "Database" → "MySQL"
3. ✅ Base de données créée automatiquement

### 3️⃣ Déployer le Backend
1. Cliquez "New" → "GitHub Repo"
2. Sélectionnez votre repo et le dossier `back`
3. Dans "Variables", ajoutez :
   ```env
   DB_HOST=<mysql_host_from_railway>
   DB_PASSWORD=<mysql_password_from_railway>
   DB_NAME=bddfinalgsb
   JWT_SECRET=<votre_clé_secrète>
   NODE_ENV=production
   CORS_ORIGIN=<frontend_url>
   ```

### 4️⃣ Déployer le Frontend
1. Cliquez "New" → "GitHub Repo"
2. Sélectionnez votre repo et le dossier `front`
3. Dans "Variables", ajoutez :
   ```env
   VITE_API_URL=<backend_url>
   ```

### 5️⃣ Vérifier l'Initialisation
1. Allez dans les logs du backend
2. Vérifiez ces messages :
   ```
   🗄️ Initialisation de la base de données...
   ✅ Base de données 'bddfinalgsb' créée
   🎉 Base de données initialisée avec succès !
   ```

## ✅ C'est Tout !

Votre application est maintenant en ligne avec :
- ✅ Base de données MySQL automatiquement configurée
- ✅ Toutes les tables et données importées
- ✅ Backend et frontend fonctionnels
- ✅ HTTPS automatique

## 🛠️ Gestion de la Base de Données

### Vérifier l'état de la DB
```bash
railway run npm run check-db
```

### Réinitialiser la DB
```bash
railway run npm run init-db
```

### Outils de Gestion Locaux
- **MySQL Workbench** (gratuit)
- **DBeaver** (gratuit)
- **TablePlus** (payant)

## 🔧 Variables d'Environnement

### Backend
```env
DB_HOST=containers-us-west-XX.railway.app
DB_PASSWORD=your_mysql_password
DB_NAME=bddfinalgsb
JWT_SECRET=your_secret_key
NODE_ENV=production
CORS_ORIGIN=https://your-frontend.railway.app
```

### Frontend
```env
VITE_API_URL=https://your-backend.railway.app
```

## 🆘 Problèmes Courants

### Base de données non initialisée
```bash
# Vérifier les logs
railway logs

# Initialiser manuellement
railway run npm run init-db
```

### Erreurs CORS
- Vérifiez que `CORS_ORIGIN` pointe vers la bonne URL frontend
- Redéployez le backend après modification

### Connexion DB échoue
- Vérifiez `DB_HOST` et `DB_PASSWORD`
- Assurez-vous que le service MySQL est démarré

## 📊 Monitoring

- **Logs** : Dans chaque service Railway
- **Métriques** : Interface Railway
- **Base de données** : Via les outils locaux

---

🎉 **Votre application GSB Pharmacy est maintenant en ligne gratuitement !** 