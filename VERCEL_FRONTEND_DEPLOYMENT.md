# 🎨 Déploiement Frontend GSB Pharmacy sur Vercel

Guide pour déployer le frontend sur Vercel (gratuit) avec votre backend Render.

## 📋 Prérequis

- ✅ Backend déployé sur Render
- ✅ Base de données déployée sur Render
- ✅ Compte GitHub
- ✅ Compte Vercel (gratuit)

## 🚀 Déploiement en 5 Étapes

### 1️⃣ Aller sur Vercel
1. Allez sur [vercel.com](https://vercel.com)
2. Connectez-vous avec votre compte GitHub
3. Cliquez sur "New Project"

### 2️⃣ Sélectionner le Repository
1. Sélectionnez votre repository `apIPSSI`
2. Vercel va détecter automatiquement que c'est un projet Vite

### 3️⃣ Configurer le Projet
1. **Framework Preset** : Vite (détecté automatiquement)
2. **Root Directory** : `front`
3. **Build Command** : `npm run build` (par défaut)
4. **Output Directory** : `dist` (par défaut)
5. **Install Command** : `npm install` (par défaut)

### 4️⃣ Variables d'Environnement
Ajoutez cette variable :
```env
VITE_API_URL=https://gsb-pharmacy-backend.onrender.com
```

**Important** : Remplacez `gsb-pharmacy-backend.onrender.com` par l'URL réelle de votre backend Render.

### 5️⃣ Déployer
1. Cliquez sur "Deploy"
2. Attendez 1-2 minutes pour le build
3. Votre frontend sera accessible sur `https://votre-projet.vercel.app`

## 🔗 Configuration Finale

### Mettre à Jour CORS dans le Backend
1. Copiez l'URL de votre frontend Vercel
2. Allez dans votre service backend sur Render
3. Dans "Environment Variables", mettez à jour :
   ```env
   CORS_ORIGIN=https://votre-projet.vercel.app
   ```
4. Redéployez le backend

### Tester l'Application
1. Ouvrez l'URL de votre frontend Vercel
2. Testez la connexion utilisateur
3. Testez les fonctionnalités administrateur
4. Vérifiez que tout fonctionne

## 🛠️ Configuration Avancée

### Fichier vercel.json
Le fichier `front/vercel.json` est déjà configuré pour :
- ✅ Build automatique avec Vite
- ✅ Routing SPA (Single Page Application)
- ✅ Headers CORS appropriés

### Variables d'Environnement
Vous pouvez ajouter d'autres variables si nécessaire :
```env
VITE_API_URL=https://gsb-pharmacy-backend.onrender.com
VITE_APP_NAME=GSB Pharmacy
VITE_APP_VERSION=1.0.0
```

## 📊 Avantages de Vercel

### ✅ Gratuit
- Déploiement illimité
- Bandwidth illimité
- CDN global

### ✅ Performant
- Déploiement en quelques secondes
- CDN global pour une vitesse maximale
- Optimisation automatique

### ✅ Simple
- Interface intuitive
- Déploiement automatique depuis GitHub
- Configuration automatique

## 🔍 Vérification

### URLs Finales
- **Frontend** : `https://votre-projet.vercel.app`
- **Backend** : `https://gsb-pharmacy-backend.onrender.com`
- **Base de données** : Gérée via Render

### Test de Connexion
1. Ouvrez votre frontend Vercel
2. Essayez de vous connecter
3. Vérifiez que l'API fonctionne
4. Testez les fonctionnalités

## 🆘 Dépannage

### Problèmes Courants

1. **Build échoue**
   - Vérifiez que le dossier `front` contient un `package.json`
   - Assurez-vous que `npm run build` fonctionne localement

2. **Erreurs CORS**
   - Vérifiez que `VITE_API_URL` pointe vers la bonne URL backend
   - Mettez à jour `CORS_ORIGIN` dans le backend

3. **Page blanche**
   - Vérifiez les logs de build Vercel
   - Assurez-vous que le routing SPA fonctionne

### Commandes de Test Local
```bash
# Tester le build localement
cd front
npm install
npm run build

# Vérifier que le build fonctionne
ls dist/
```

## 📞 Support

- **Documentation Vercel** : [vercel.com/docs](https://vercel.com/docs)
- **Support Vercel** : Disponible dans l'interface web

---

🎉 **Félicitations !** Votre application GSB Pharmacy est maintenant complètement déployée !
- ✅ **Frontend** : Vercel (gratuit)
- ✅ **Backend** : Render (gratuit)
- ✅ **Base de données** : Render (gratuit) 