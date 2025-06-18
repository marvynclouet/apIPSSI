#!/usr/bin/env node

const http = require('http');
const https = require('https');

console.log('🔍 Diagnostic du Healthcheck Railway');
console.log('=====================================');

// Configuration
const PORT = process.env.PORT || 5001;
const HOST = '0.0.0.0';

// Test de démarrage du serveur
function testServerStart() {
  console.log('\n1️⃣ Test de démarrage du serveur...');
  
  const server = require('./server.js');
  
  setTimeout(() => {
    console.log('✅ Serveur démarré avec succès');
    testHealthEndpoint();
  }, 2000);
}

// Test de l'endpoint de santé
function testHealthEndpoint() {
  console.log('\n2️⃣ Test de l\'endpoint /api/health...');
  
  const options = {
    hostname: 'localhost',
    port: PORT,
    path: '/api/health',
    method: 'GET',
    timeout: 5000
  };

  const req = http.request(options, (res) => {
    console.log(`✅ Status: ${res.statusCode}`);
    console.log(`✅ Headers: ${JSON.stringify(res.headers)}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log('✅ Response:', JSON.stringify(response, null, 2));
        
        if (res.statusCode === 200) {
          console.log('🎉 Healthcheck fonctionne correctement !');
        } else {
          console.log('⚠️ Healthcheck retourne un statut non-200');
        }
      } catch (error) {
        console.log('❌ Réponse non-JSON:', data);
      }
      
      process.exit(0);
    });
  });

  req.on('error', (error) => {
    console.error('❌ Erreur de connexion:', error.message);
    process.exit(1);
  });

  req.on('timeout', () => {
    console.error('❌ Timeout de la requête');
    req.destroy();
    process.exit(1);
  });

  req.end();
}

// Vérification des variables d'environnement
function checkEnvironment() {
  console.log('\n3️⃣ Vérification des variables d\'environnement...');
  
  const requiredVars = [
    'DB_HOST',
    'DB_PASSWORD',
    'JWT_SECRET'
  ];
  
  const optionalVars = [
    'DB_PORT',
    'DB_USER',
    'DB_NAME',
    'NODE_ENV',
    'CORS_ORIGIN'
  ];
  
  console.log('\nVariables requises:');
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`✅ ${varName}: SET`);
    } else {
      console.log(`❌ ${varName}: NOT SET`);
    }
  });
  
  console.log('\nVariables optionnelles:');
  optionalVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`✅ ${varName}: ${value}`);
    } else {
      console.log(`⚠️ ${varName}: NOT SET (utilise la valeur par défaut)`);
    }
  });
}

// Test de connexion à la base de données
async function testDatabase() {
  console.log('\n4️⃣ Test de connexion à la base de données...');
  
  try {
    const mysql = require('mysql2/promise');
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'bddfinalgsb',
      connectTimeout: 10000
    });
    
    console.log('✅ Connexion à MySQL établie');
    
    const [result] = await connection.execute('SELECT 1 as test');
    console.log('✅ Requête de test réussie:', result);
    
    await connection.end();
    console.log('✅ Connexion fermée');
    
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Solution: Vérifiez DB_HOST et assurez-vous que MySQL est démarré');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('💡 Solution: Vérifiez DB_USER et DB_PASSWORD');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('💡 Solution: La base de données n\'existe pas, exécutez npm run init-db');
    }
  }
}

// Exécution des tests
async function runDiagnostics() {
  console.log('🚀 Démarrage des diagnostics...\n');
  
  checkEnvironment();
  await testDatabase();
  testServerStart();
}

// Gestion des erreurs
process.on('uncaughtException', (error) => {
  console.error('❌ Erreur non gérée:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promise rejetée:', reason);
  process.exit(1);
});

// Démarrer les diagnostics
runDiagnostics(); 