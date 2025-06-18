#!/usr/bin/env node

console.log('🚀 Vérification du démarrage de l\'application...');
console.log('================================================');

// Vérification des variables d'environnement critiques
console.log('\n1️⃣ Vérification des variables d\'environnement :');

const requiredVars = {
  'DB_HOST': process.env.DB_HOST,
  'DB_PASSWORD': process.env.DB_PASSWORD,
  'JWT_SECRET': process.env.JWT_SECRET,
  'PORT': process.env.PORT || '5001',
  'NODE_ENV': process.env.NODE_ENV || 'development'
};

let missingVars = [];
Object.entries(requiredVars).forEach(([key, value]) => {
  if (value) {
    console.log(`✅ ${key}: SET`);
  } else {
    console.log(`❌ ${key}: NOT SET`);
    missingVars.push(key);
  }
});

if (missingVars.length > 0) {
  console.log(`\n⚠️ Variables manquantes : ${missingVars.join(', ')}`);
  console.log('💡 Configurez ces variables dans Railway');
  process.exit(1);
}

// Vérification des dépendances
console.log('\n2️⃣ Vérification des dépendances :');

try {
  require('express');
  console.log('✅ Express: OK');
} catch (error) {
  console.log('❌ Express: NOT FOUND');
  console.log('💡 Exécutez: npm install');
  process.exit(1);
}

try {
  require('mysql2');
  console.log('✅ MySQL2: OK');
} catch (error) {
  console.log('❌ MySQL2: NOT FOUND');
  console.log('💡 Exécutez: npm install');
  process.exit(1);
}

try {
  require('dotenv');
  console.log('✅ Dotenv: OK');
} catch (error) {
  console.log('❌ Dotenv: NOT FOUND');
  console.log('💡 Exécutez: npm install');
  process.exit(1);
}

// Test de connexion à la base de données
console.log('\n3️⃣ Test de connexion à la base de données :');

async function testDatabase() {
  try {
    const mysql = require('mysql2/promise');
    
    console.log('🔗 Tentative de connexion à MySQL...');
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      connectTimeout: 10000,
      acquireTimeout: 10000
    });
    
    console.log('✅ Connexion MySQL établie');
    
    // Test de requête simple
    const [result] = await connection.execute('SELECT 1 as test');
    console.log('✅ Requête de test réussie');
    
    await connection.end();
    console.log('✅ Connexion fermée');
    
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion MySQL:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Solution: Vérifiez DB_HOST et assurez-vous que MySQL est démarré');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('💡 Solution: Vérifiez DB_USER et DB_PASSWORD');
    } else if (error.code === 'ENOTFOUND') {
      console.log('💡 Solution: DB_HOST non résolvable, vérifiez l\'URL');
    }
    
    return false;
  }
}

// Test de démarrage du serveur
console.log('\n4️⃣ Test de démarrage du serveur :');

async function testServerStart() {
  try {
    console.log('🔧 Chargement du serveur...');
    
    // Charger le serveur sans le démarrer
    const serverModule = require('./server.js');
    
    console.log('✅ Module serveur chargé avec succès');
    
    // Attendre un peu pour voir s'il y a des erreurs
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('✅ Aucune erreur détectée lors du chargement');
    
    return true;
  } catch (error) {
    console.error('❌ Erreur lors du chargement du serveur:', error.message);
    console.error('Stack trace:', error.stack);
    return false;
  }
}

// Exécution des tests
async function runTests() {
  console.log('\n🚀 Démarrage des tests...\n');
  
  const dbTest = await testDatabase();
  const serverTest = await testServerStart();
  
  console.log('\n📊 Résumé des tests :');
  console.log(`- Base de données: ${dbTest ? '✅ OK' : '❌ ÉCHEC'}`);
  console.log(`- Serveur: ${serverTest ? '✅ OK' : '❌ ÉCHEC'}`);
  
  if (dbTest && serverTest) {
    console.log('\n🎉 Tous les tests sont passés ! L\'application devrait démarrer correctement.');
    process.exit(0);
  } else {
    console.log('\n❌ Certains tests ont échoué. Vérifiez les erreurs ci-dessus.');
    process.exit(1);
  }
}

// Gestion des erreurs non capturées
process.on('uncaughtException', (error) => {
  console.error('\n❌ Erreur non gérée:', error.message);
  console.error('Stack trace:', error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('\n❌ Promise rejetée:', reason);
  process.exit(1);
});

// Démarrer les tests
runTests(); 