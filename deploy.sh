#!/bin/bash

echo "🚀 Script de déploiement GSB Pharmacy sur Railway"
echo "=================================================="

# Vérifier que Railway CLI est installé
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI n'est pas installé"
    echo "📦 Installation de Railway CLI..."
    npm install -g @railway/cli
fi

# Vérifier la connexion Railway
echo "🔐 Vérification de la connexion Railway..."
if ! railway login --check; then
    echo "🔑 Connexion à Railway..."
    railway login
fi

echo ""
echo "📋 Étapes de déploiement :"
echo "1. Créez un projet Railway sur https://railway.app"
echo "2. Ajoutez un service MySQL"
echo "3. Ajoutez un service phpMyAdmin"
echo "4. Déployez le backend"
echo "5. Déployez le frontend"
echo ""

echo "🔧 Configuration recommandée :"
echo ""
echo "Pour le backend, ajoutez ces variables d'environnement :"
echo "DB_HOST=<mysql_host_from_railway>"
echo "DB_PORT=3306"
echo "DB_USER=root"
echo "DB_PASSWORD=<mysql_password_from_railway>"
echo "DB_NAME=bddfinalgsb"
echo "JWT_SECRET=<your_secret_key>"
echo "JWT_EXPIRES_IN=24h"
echo "NODE_ENV=production"
echo "CORS_ORIGIN=<frontend_url>"
echo ""
echo "Pour le frontend, ajoutez :"
echo "VITE_API_URL=<backend_url>"
echo ""

echo "📖 Consultez DEPLOYMENT.md pour les instructions détaillées"
echo "�� Bon déploiement !" 