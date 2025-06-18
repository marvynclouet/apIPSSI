// Configuration pour la production
module.exports = {
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'bddfinalgsb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  },
  
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },
  
  server: {
    port: process.env.PORT || 5001,
    host: '0.0.0.0'
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
  },
  
  security: {
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limite chaque IP à 100 requêtes par fenêtre
    }
  }
}; 