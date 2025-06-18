# 🗄️ Gestion de la Base de Données MySQL sur Railway

Railway ne propose pas phpMyAdmin, mais voici plusieurs alternatives pour gérer votre base de données MySQL.

## 🚀 Option 1: Initialisation Automatique (Recommandée)

Votre application est configurée pour initialiser automatiquement la base de données au démarrage !

### ✅ Avantages
- **Automatique** : Pas besoin d'intervention manuelle
- **Sécurisé** : Pas d'interface web exposée
- **Simple** : Fonctionne dès le déploiement

### 🔧 Comment ça fonctionne
1. Le script `init-database.js` s'exécute automatiquement au démarrage
2. Il crée la base de données si elle n'existe pas
3. Il importe automatiquement le fichier `bddfinalgsb.sql`
4. Il configure toutes les tables et données initiales

### 📋 Vérification
Les logs Railway afficheront :
```
🗄️ Initialisation de la base de données...
✅ Connexion à MySQL établie
✅ Base de données 'bddfinalgsb' créée ou vérifiée
📄 Lecture du fichier SQL...
🔧 Exécution de X requêtes...
🎉 Base de données initialisée avec succès !
📋 Tables créées :
  - users
  - medicaments
  - orders
  - ...
```

## 🛠️ Option 2: Outils de Gestion Locaux

### MySQL Workbench (Gratuit)
1. **Téléchargez** [MySQL Workbench](https://dev.mysql.com/downloads/workbench/)
2. **Connectez-vous** avec les informations Railway :
   - Host: `your-mysql-host.railway.app`
   - Port: `3306`
   - User: `root`
   - Password: `your-mysql-password`

### DBeaver (Gratuit)
1. **Téléchargez** [DBeaver](https://dbeaver.io/)
2. **Créez une connexion** MySQL
3. **Utilisez** les mêmes informations de connexion

### TablePlus (Payant mais excellent)
1. **Téléchargez** [TablePlus](https://tableplus.com/)
2. **Interface moderne** et intuitive
3. **Support** de nombreuses bases de données

## 🌐 Option 3: Interfaces Web Alternatives

### Adminer (Léger et sécurisé)
Vous pouvez déployer Adminer sur Railway :

```bash
# Créer un nouveau service Railway
# Template: adminer/adminer
# Variables d'environnement :
# ADMINER_DEFAULT_SERVER=your-mysql-host.railway.app
# ADMINER_DESIGN=pepa-linha-dark
```

### phpMyAdmin sur Railway (Alternative)
```bash
# Déployer phpMyAdmin manuellement
# Utiliser le template : phpmyadmin/phpmyadmin
```

## 🔧 Option 4: Scripts de Gestion

### Exécuter des requêtes SQL
```bash
# Via Railway CLI
railway run mysql -u root -p -h your-mysql-host.railway.app

# Ou via votre application
railway run npm run init-db
```

### Scripts utiles
```javascript
// back/scripts/check-db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  const [tables] = await connection.execute('SHOW TABLES');
  console.log('Tables disponibles:', tables.map(t => Object.values(t)[0]));
  
  const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
  console.log('Nombre d\'utilisateurs:', users[0].count);
  
  await connection.end();
}

checkDatabase();
```

## 📊 Option 5: Monitoring et Logs

### Logs Railway
- **Accédez** aux logs de votre service backend
- **Vérifiez** les messages d'initialisation de la base de données
- **Surveillez** les erreurs de connexion

### Métriques de Base de Données
Railway fournit des métriques de base :
- **Connexions actives**
- **Requêtes par seconde**
- **Utilisation de la mémoire**

## 🔒 Sécurité

### Bonnes Pratiques
1. **Ne jamais exposer** phpMyAdmin en production
2. **Utiliser** des mots de passe forts
3. **Limiter** l'accès aux connexions externes
4. **Sauvegarder** régulièrement vos données

### Variables d'Environnement Sécurisées
```env
DB_HOST=your-mysql-host.railway.app
DB_PASSWORD=your-strong-password
DB_NAME=bddfinalgsb
```

## 🆘 Dépannage

### Problèmes Courants

1. **"Cannot connect to database"**
   ```bash
   # Vérifiez les variables d'environnement
   railway variables
   
   # Testez la connexion
   railway run npm run init-db
   ```

2. **"Database doesn't exist"**
   - Le script d'initialisation devrait créer automatiquement la base
   - Vérifiez les logs Railway

3. **"Access denied"**
   - Vérifiez le mot de passe MySQL
   - Assurez-vous que l'utilisateur a les bonnes permissions

### Commandes Utiles
```bash
# Vérifier les variables d'environnement
railway variables

# Voir les logs
railway logs

# Redémarrer le service
railway service restart

# Exécuter une commande dans le conteneur
railway run node init-database.js
```

## 📚 Ressources

- [Documentation MySQL](https://dev.mysql.com/doc/)
- [MySQL Workbench](https://dev.mysql.com/downloads/workbench/)
- [DBeaver](https://dbeaver.io/)
- [Adminer](https://www.adminer.org/)
- [Documentation Railway](https://docs.railway.app)

---

🎉 **Avec l'initialisation automatique, votre base de données sera prête dès le déploiement !** 