# 🔧 Variables d'Environnement - GSB Pharmacy

Ce document décrit toutes les variables d'environnement nécessaires pour faire fonctionner l'application GSB Pharmacy.

## 🗄️ Base de Données (Backend)

| Variable | Description | Valeur par défaut | Requis |
|----------|-------------|-------------------|--------|
| `DB_HOST` | Hôte de la base de données MySQL | `localhost` | ✅ |
| `DB_PORT` | Port de la base de données MySQL | `3306` | ❌ |
| `DB_USER` | Nom d'utilisateur MySQL | `root` | ❌ |
| `DB_PASSWORD` | Mot de passe MySQL | - | ✅ |
| `DB_NAME` | Nom de la base de données | `bddfinalgsb` | ❌ |

## 🔐 Authentification (Backend)

| Variable | Description | Valeur par défaut | Requis |
|----------|-------------|-------------------|--------|
| `JWT_SECRET` | Clé secrète pour signer les tokens JWT | - | ✅ |
| `JWT_EXPIRES_IN` | Durée de validité des tokens JWT | `24h` | ❌ |

## 🌐 Serveur (Backend)

| Variable | Description | Valeur par défaut | Requis |
|----------|-------------|-------------------|--------|
| `PORT` | Port d'écoute du serveur | `5001` | ❌ |
| `NODE_ENV` | Environnement d'exécution | `development` | ❌ |
| `CORS_ORIGIN` | Origine autorisée pour CORS | `http://localhost:3000` | ❌ |

## 🎨 Frontend

| Variable | Description | Valeur par défaut | Requis |
|----------|-------------|-------------------|--------|
| `VITE_API_URL` | URL de l'API backend | `http://localhost:5001/api` | ❌ |

## 📝 Exemples de Configuration

### Développement Local

```bash
# Backend (.env)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=bddfinalgsb
JWT_SECRET=your_development_secret_key
JWT_EXPIRES_IN=24h
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Frontend (.env)
VITE_API_URL=http://localhost:5001/api
```

### Production (Railway)

```bash
# Backend
DB_HOST=containers-us-west-XX.railway.app
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_railway_mysql_password
DB_NAME=bddfinalgsb
JWT_SECRET=your_super_secure_production_secret_key
JWT_EXPIRES_IN=24h
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-app.railway.app

# Frontend
VITE_API_URL=https://your-backend-app.railway.app/api
```

## 🔒 Sécurité

### Génération d'une clé JWT sécurisée

```bash
# Méthode 1: OpenSSL
openssl rand -base64 32

# Méthode 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Méthode 3: En ligne
# Utilisez un générateur de clés en ligne sécurisé
```

### Bonnes pratiques

1. **Ne jamais commiter** les fichiers `.env` dans Git
2. **Utiliser des clés différentes** pour chaque environnement
3. **Changer régulièrement** les clés JWT en production
4. **Limiter l'accès** aux variables d'environnement
5. **Utiliser des mots de passe forts** pour la base de données

## 🚀 Configuration sur Railway

### Backend

1. Allez dans votre service backend sur Railway
2. Cliquez sur "Variables"
3. Ajoutez chaque variable avec sa valeur

### Frontend

1. Allez dans votre service frontend sur Railway
2. Cliquez sur "Variables"
3. Ajoutez `VITE_API_URL` avec l'URL de votre backend

### Base de données

Les variables de base de données sont automatiquement configurées par Railway lors de la création du service MySQL.

## 🔍 Vérification

### Backend

```bash
# Vérifier les variables d'environnement
node -e "
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
console.log('NODE_ENV:', process.env.NODE_ENV);
"
```

### Frontend

```javascript
// Dans la console du navigateur
console.log('API URL:', import.meta.env.VITE_API_URL);
```

## 🆘 Dépannage

### Erreurs courantes

1. **"DB_HOST is not defined"**
   - Vérifiez que `DB_HOST` est défini
   - Assurez-vous que la base de données est accessible

2. **"JWT_SECRET is not defined"**
   - Définissez une clé JWT_SECRET
   - Utilisez une clé sécurisée en production

3. **Erreurs CORS**
   - Vérifiez que `CORS_ORIGIN` pointe vers la bonne URL
   - Assurez-vous que l'URL utilise le bon protocole (http/https)

4. **"Cannot connect to database"**
   - Vérifiez les informations de connexion MySQL
   - Assurez-vous que la base de données est démarrée

## 📚 Ressources

- [Documentation Railway](https://docs.railway.app)
- [Documentation MySQL](https://dev.mysql.com/doc/)
- [Documentation JWT](https://jwt.io/)
- [Documentation CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) 