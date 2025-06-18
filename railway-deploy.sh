#!/bin/bash

echo "🚀 Déploiement automatisé GSB Pharmacy sur Railway"
echo "=================================================="

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier que Railway CLI est installé
check_railway_cli() {
    if ! command -v railway &> /dev/null; then
        print_error "Railway CLI n'est pas installé"
        print_status "Installation de Railway CLI..."
        npm install -g @railway/cli
        if [ $? -ne 0 ]; then
            print_error "Échec de l'installation de Railway CLI"
            exit 1
        fi
    fi
    print_success "Railway CLI est installé"
}

# Vérifier la connexion Railway
check_railway_auth() {
    print_status "Vérification de la connexion Railway..."
    if ! railway login --check &> /dev/null; then
        print_warning "Vous n'êtes pas connecté à Railway"
        print_status "Connexion à Railway..."
        railway login
        if [ $? -ne 0 ]; then
            print_error "Échec de la connexion à Railway"
            exit 1
        fi
    fi
    print_success "Connecté à Railway"
}

# Créer ou sélectionner un projet
setup_project() {
    print_status "Configuration du projet Railway..."
    
    # Lister les projets existants
    print_status "Projets existants :"
    railway projects
    
    echo ""
    read -p "Voulez-vous créer un nouveau projet ? (y/n): " create_new
    
    if [[ $create_new == "y" || $create_new == "Y" ]]; then
        print_status "Création d'un nouveau projet..."
        railway project create
    else
        print_status "Sélection d'un projet existant..."
        railway project select
    fi
}

# Déployer la base de données MySQL
deploy_database() {
    print_status "Déploiement de la base de données MySQL..."
    
    # Ajouter MySQL
    railway add mysql
    
    # Ajouter phpMyAdmin
    railway add phpmyadmin
    
    print_success "Base de données MySQL et phpMyAdmin déployés"
    
    # Afficher les informations de connexion
    print_status "Informations de connexion MySQL :"
    railway variables
}

# Déployer le backend
deploy_backend() {
    print_status "Déploiement du backend..."
    
    # Aller dans le dossier backend
    cd back
    
    # Déployer le backend
    railway up
    
    if [ $? -eq 0 ]; then
        print_success "Backend déployé avec succès"
        
        # Obtenir l'URL du backend
        BACKEND_URL=$(railway domain)
        print_status "URL du backend : $BACKEND_URL"
        
        # Configurer les variables d'environnement
        print_status "Configuration des variables d'environnement..."
        
        # Demander les informations de base de données
        read -p "Host MySQL (depuis Railway): " DB_HOST
        read -p "Mot de passe MySQL (depuis Railway): " DB_PASSWORD
        read -p "URL du frontend: " FRONTEND_URL
        
        # Générer un JWT secret
        JWT_SECRET=$(openssl rand -base64 32)
        
        # Configurer les variables
        railway variables set DB_HOST="$DB_HOST"
        railway variables set DB_PORT="3306"
        railway variables set DB_USER="root"
        railway variables set DB_PASSWORD="$DB_PASSWORD"
        railway variables set DB_NAME="bddfinalgsb"
        railway variables set JWT_SECRET="$JWT_SECRET"
        railway variables set JWT_EXPIRES_IN="24h"
        railway variables set NODE_ENV="production"
        railway variables set CORS_ORIGIN="$FRONTEND_URL"
        
        print_success "Variables d'environnement configurées"
    else
        print_error "Échec du déploiement du backend"
        exit 1
    fi
    
    cd ..
}

# Déployer le frontend
deploy_frontend() {
    print_status "Déploiement du frontend..."
    
    # Aller dans le dossier frontend
    cd front
    
    # Déployer le frontend
    railway up
    
    if [ $? -eq 0 ]; then
        print_success "Frontend déployé avec succès"
        
        # Obtenir l'URL du frontend
        FRONTEND_URL=$(railway domain)
        print_status "URL du frontend : $FRONTEND_URL"
        
        # Configurer les variables d'environnement
        print_status "Configuration des variables d'environnement..."
        railway variables set VITE_API_URL="$BACKEND_URL"
        
        print_success "Variables d'environnement configurées"
    else
        print_error "Échec du déploiement du frontend"
        exit 1
    fi
    
    cd ..
}

# Fonction principale
main() {
    print_status "Démarrage du déploiement automatisé..."
    
    # Vérifications préalables
    check_railway_cli
    check_railway_auth
    
    # Configuration du projet
    setup_project
    
    # Déploiement des services
    deploy_database
    deploy_backend
    deploy_frontend
    
    # Résumé final
    echo ""
    print_success "🎉 Déploiement terminé avec succès !"
    echo ""
    print_status "Résumé :"
    echo "- Backend : $BACKEND_URL"
    echo "- Frontend : $FRONTEND_URL"
    echo "- Base de données : MySQL + phpMyAdmin"
    echo ""
    print_status "Prochaines étapes :"
    echo "1. Importez la base de données via phpMyAdmin"
    echo "2. Testez l'application"
    echo "3. Configurez les utilisateurs administrateurs"
    echo ""
    print_warning "N'oubliez pas de sauvegarder vos variables d'environnement !"
}

# Exécuter le script principal
main "$@" 