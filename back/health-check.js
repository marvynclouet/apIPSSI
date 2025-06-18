const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();

// Route de santé améliorée
app.get('/api/health', async (req, res) => {
  try {
    // Vérifier la connexion à la base de données
    let dbStatus = 'unknown';
    try {
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'bddfinalgsb',
        connectTimeout: 5000
      });
      
      await connection.execute('SELECT 1');
      await connection.end();
      dbStatus = 'connected';
    } catch (dbError) {
      console.error('Database connection failed:', dbError.message);
      dbStatus = 'disconnected';
    }

    // Vérifier les variables d'environnement critiques
    const envCheck = {
      DB_HOST: !!process.env.DB_HOST,
      DB_PASSWORD: !!process.env.DB_PASSWORD,
      JWT_SECRET: !!process.env.JWT_SECRET,
      NODE_ENV: process.env.NODE_ENV || 'development'
    };

    const healthStatus = {
      status: dbStatus === 'connected' ? 'ok' : 'warning',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbStatus,
      environment: envCheck,
      memory: process.memoryUsage(),
      version: process.version
    };

    const statusCode = dbStatus === 'connected' ? 200 : 503;
    res.status(statusCode).json(healthStatus);

  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// Route de test simple
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Route racine
app.get('/', (req, res) => {
  res.json({ 
    message: 'GSB Pharmacy API',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5001;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Health check server running on ${HOST}:${PORT}`);
  console.log('Environment variables check:');
  console.log('- DB_HOST:', process.env.DB_HOST ? 'SET' : 'NOT SET');
  console.log('- DB_PASSWORD:', process.env.DB_PASSWORD ? 'SET' : 'NOT SET');
  console.log('- JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
  console.log('- NODE_ENV:', process.env.NODE_ENV || 'development');
}); 