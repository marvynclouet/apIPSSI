const express = require('express');
require('dotenv').config();

const app = express();

// Middleware de base
app.use(express.json());

// Route de santé simple
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'Minimal server is running'
  });
});

// Route racine
app.get('/', (req, res) => {
  res.json({
    message: 'GSB Pharmacy API - Minimal Server',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Route de test
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Test endpoint working',
    timestamp: new Date().toISOString()
  });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

const PORT = process.env.PORT || 5001;
const HOST = '0.0.0.0';

console.log('🚀 Démarrage du serveur minimal...');
console.log(`Port: ${PORT}`);
console.log(`Host: ${HOST}`);
console.log('Variables d\'environnement:');
console.log('- DB_HOST:', process.env.DB_HOST ? 'SET' : 'NOT SET');
console.log('- DB_PASSWORD:', process.env.DB_PASSWORD ? 'SET' : 'NOT SET');
console.log('- JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
console.log('- NODE_ENV:', process.env.NODE_ENV || 'development');

app.listen(PORT, HOST, () => {
  console.log(`✅ Serveur minimal démarré sur ${HOST}:${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Test endpoint: http://localhost:${PORT}/api/test`);
});

// Gestion de l'arrêt propre
process.on('SIGTERM', () => {
  console.log('SIGTERM reçu, arrêt du serveur...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT reçu, arrêt du serveur...');
  process.exit(0);
}); 