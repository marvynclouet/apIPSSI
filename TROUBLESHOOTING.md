# 🔧 Guide de Dépannage - GSB Pharmacy

## 🚨 Problème : "Service Unavailable" sur Railway

### Symptômes
- Healthcheck échoue avec "service unavailable"
- L'application ne démarre pas
- Logs montrent des erreurs de démarrage

## 🔍 Diagnostic Étape par Étape

### 1. Vérifier les Variables d'Environnement

Dans Railway, allez dans votre service backend → Variables et vérifiez :

```env
DB_HOST=<mysql_host_from_railway>
DB_PASSWORD=<mysql_password_from_railway>
DB_NAME=bddfinalgsb
JWT_SECRET=<your_secret_key>
NODE_ENV=production
CORS_ORIGIN=<frontend_url>
```

**Variables CRITIQUES :**
- `DB_HOST` - Doit être l'URL MySQL de Railway
- `DB_PASSWORD` - Doit être le mot de passe MySQL de Railway
- `JWT_SECRET` - Doit être une chaîne de caractères

### 2. Tester avec le Serveur Minimal

Si le serveur principal ne démarre pas, testez avec le serveur minimal :

```bash
# Via Railway CLI
railway run npm run start:minimal

# Ou changez temporairement le Procfile
# Remplacez le contenu par : web: npm run start:minimal
```

### 3. Vérifier les Logs Railway

```bash
# Via Railway CLI
railway logs

# Ou via l'interface web
# Allez dans votre service → Logs
```

### 4. Tester Localement

```bash
# Dans le dossier back
npm run startup-check
```

## 🛠️ Solutions par Type d'Erreur

### Erreur : "Cannot find module"
```bash
# Solution : Réinstaller les dépendances
railway run npm install
```

### Erreur : "ECONNREFUSED" (Base de données)
- Vérifiez que le service MySQL est démarré
- Vérifiez `DB_HOST` et `DB_PASSWORD`
- Assurez-vous que MySQL est dans le même projet Railway

### Erreur : "ER_ACCESS_DENIED_ERROR"
- Vérifiez `DB_USER` et `DB_PASSWORD`
- Utilisez les credentials exacts de Railway

### Erreur : "ENOTFOUND" (Host non résolvable)
- Vérifiez `DB_HOST` - doit être l'URL complète de Railway
- Exemple : `containers-us-west-XX.railway.app`

### Erreur : "Port already in use"
- Railway gère automatiquement le port
- Assurez-vous d'utiliser `process.env.PORT`

## 🚀 Stratégie de Déploiement Progressive

### Étape 1 : Serveur Minimal
1. Changez le Procfile : `web: npm run start:minimal`
2. Déployez et testez
3. Vérifiez que `/api/health` répond

### Étape 2 : Base de Données
1. Une fois le serveur minimal fonctionnel
2. Testez la connexion DB : `railway run npm run check-db`
3. Initialisez la DB : `railway run npm run init-db`

### Étape 3 : Serveur Complet
1. Revenez au serveur principal : `web: npm start`
2. Déployez et testez

## 🔧 Scripts de Diagnostic

### Vérification Complète
```bash
railway run npm run startup-check
```

### Test de Base de Données
```bash
railway run npm run check-db
```

### Test de Healthcheck
```bash
railway run npm run debug-health
```

### Serveur Minimal
```bash
railway run npm run start:minimal
```

## 📋 Checklist de Déploiement

- [ ] Variables d'environnement configurées
- [ ] Service MySQL démarré
- [ ] Dépendances installées (`npm install`)
- [ ] Serveur minimal fonctionnel
- [ ] Connexion DB établie
- [ ] Base de données initialisée
- [ ] Serveur principal fonctionnel
- [ ] Healthcheck réussi

## 🆘 Commandes Utiles

```bash
# Voir les variables d'environnement
railway variables

# Redémarrer le service
railway service restart

# Voir les logs en temps réel
railway logs --follow

# Exécuter une commande dans le conteneur
railway run <command>

# Voir l'état du service
railway status
```

## 📞 Support

Si le problème persiste :
1. Vérifiez les logs complets
2. Testez avec le serveur minimal
3. Vérifiez la configuration Railway
4. Consultez la documentation Railway

---

🔧 **Ce guide vous aidera à résoudre les problèmes de démarrage étape par étape !** 