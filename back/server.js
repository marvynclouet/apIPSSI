const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const authRoutes = require('./routes/auth.routes');
const orderRoutes = require('./routes/order.routes');
const medicamentRoutes = require('./routes/medicament.routes');
const userRoutes = require('./routes/user.routes');
const statsRoutes = require('./routes/stats.routes');

// Charger les variables d'environnement
dotenv.config();

const app = express();

// Initialiser la base de données au démarrage (en production)
if (process.env.NODE_ENV === 'production') {
  const initializePostgreSQL = require('./init-postgresql');
  console.log('🔄 Initialisation forcée de la base de données PostgreSQL en production...');
  
  // Attendre un peu avant d'initialiser
  setTimeout(async () => {
    try {
      await initializePostgreSQL();
      console.log('✅ Base de données PostgreSQL initialisée avec succès !');
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation PostgreSQL:', error);
    }
  }, 5000); // Attendre 5 secondes
}

// Middleware de sécurité
app.use(helmet());

// Middleware de compression
app.use(compression());

// Configuration du rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite chaque IP à 100 requêtes par fenêtre
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard'
});

// Appliquer le rate limiting à toutes les routes
app.use(limiter);

// Middleware CORS
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:8080',
  'http://localhost:5001',
  'http://localhost:64108',
  'http://localhost:*',  // Autoriser tous les ports locaux
  'http://10.74.1.3:3000',
  'http://10.74.1.3:8080',
  'http://10.74.1.3:5001',
  'http://10.74.2.202:5001',
  'http://10.74.3.246:*',
  'capacitor://localhost',
  'ionic://localhost',
  'http://localhost',
  'http://localhost:8080',
  'http://localhost:8100',
  'http://localhost:56285',
  // Autoriser tous les domaines Vercel (plus robuste)
  'https://*.vercel.app',
  'https://vercel.app'
];

app.use(cors({
  origin: function(origin, callback) {
    // Autoriser les requêtes sans origine (comme les requêtes mobiles)
    if (!origin) return callback(null, true);
    
    // Autoriser toutes les origines localhost
    if (origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }
    
    // Vérifier les origines autorisées
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin.endsWith(':*')) {
        const baseOrigin = allowedOrigin.replace(':*', '');
        return origin.startsWith(baseOrigin);
      }
      if (allowedOrigin.includes('*')) {
        // Gérer les wildcards comme *.vercel.app
        const pattern = allowedOrigin.replace('*', '.*');
        const regex = new RegExp(pattern);
        return regex.test(origin);
      }
      return allowedOrigin === origin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('Origine bloquée par CORS:', origin);
      console.log('Origines autorisées:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Handle preflight requests
app.options('*', cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    
    // Autoriser toutes les origines localhost
    if (origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }
    
    // Vérifier les origines autorisées
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin.endsWith(':*')) {
        const baseOrigin = allowedOrigin.replace(':*', '');
        return origin.startsWith(baseOrigin);
      }
      if (allowedOrigin.includes('*')) {
        // Gérer les wildcards comme *.vercel.app
        const pattern = allowedOrigin.replace('*', '.*');
        const regex = new RegExp(pattern);
        return regex.test(origin);
      }
      return allowedOrigin === origin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('Origine bloquée par CORS (preflight):', origin);
      console.log('Origines autorisées:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(express.json({ limit: '10kb' })); // Limite la taille du body à 10kb

// Log all requests
app.use((req, res, next) => {
  console.log(`\n=== Nouvelle requête ===`);
  console.log(`Date: ${new Date().toISOString()}`);
  console.log(`Méthode: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log(`IP: ${req.ip}`);
  console.log(`Headers:`, req.headers);
  console.log(`Body:`, req.body);
  console.log(`Origin: ${req.headers.origin}`);
  console.log(`Referer: ${req.headers.referer}`);
  console.log(`User-Agent: ${req.headers['user-agent']}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/medicaments', medicamentRoutes);
app.use('/api/users', userRoutes);
app.use('/api', statsRoutes);

// Route de test améliorée
app.get('/api/test', (req, res) => {
  console.log('Test route accessed from:', req.ip);
  console.log('Request headers:', req.headers);
  res.json({ 
    message: 'Le serveur fonctionne correctement',
    timestamp: new Date().toISOString(),
    clientIp: req.ip
  });
});

// Route de santé
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Route de diagnostic
app.get('/api/debug', async (req, res) => {
  try {
    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        DB_HOST: process.env.DB_HOST,
        DB_PORT: process.env.DB_PORT,
        DB_USER: process.env.DB_USER,
        DB_NAME: process.env.DB_NAME,
        DB_PASSWORD: process.env.DB_PASSWORD ? 'PRESENT' : 'ABSENT',
        DATABASE_URL: process.env.DATABASE_URL ? 'PRESENT' : 'ABSENT',
        JWT_SECRET: process.env.JWT_SECRET ? 'PRESENT' : 'ABSENT',
        CORS_ORIGIN: process.env.CORS_ORIGIN
      },
      database: {
        status: 'testing...'
      }
    };

    // Test de connexion à la base de données
    try {
      const db = require('./config/db.config');
      const result = await db.query('SELECT NOW() as current_time');
      debugInfo.database.status = 'connected';
      debugInfo.database.currentTime = result.rows[0].current_time;
      
      // Vérifier les tables
      const tablesResult = await db.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `);
      debugInfo.database.tables = tablesResult.rows.map(t => t.table_name);
      
      // Vérifier les utilisateurs
      const usersResult = await db.query('SELECT id, email, role FROM users LIMIT 5');
      debugInfo.database.users = usersResult.rows;
      
    } catch (dbError) {
      debugInfo.database.status = 'error';
      debugInfo.database.error = dbError.message;
    }

    res.json(debugInfo);
  } catch (error) {
    res.status(500).json({ 
      error: 'Erreur lors du diagnostic',
      message: error.message 
    });
  }
});

// Route pour forcer l'initialisation de la base de données
app.get('/api/init-db', async (req, res) => {
  try {
    console.log('🔄 Initialisation manuelle de la base de données...');
    const forceInitializePostgreSQL = require('./force-init-postgresql');
    
    // Exécuter l'initialisation
    await forceInitializePostgreSQL();
    
    res.json({ 
      message: 'Base de données initialisée avec succès',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation manuelle:', error);
    res.status(500).json({ 
      error: 'Erreur lors de l\'initialisation',
      message: error.message 
    });
  }
});

// Route pour créer des utilisateurs de test
app.get('/api/create-users', async (req, res) => {
  try {
    console.log('👥 Création manuelle des utilisateurs de test...');
    const createTestUsers = require('./create_test_user');
    
    // Exécuter la création
    await createTestUsers();
    
    res.json({ 
      message: 'Utilisateurs de test créés avec succès',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Erreur lors de la création des utilisateurs:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la création des utilisateurs',
      message: error.message 
    });
  }
});

// Route pour vérifier la structure des tables
app.get('/api/debug-tables', async (req, res) => {
  try {
    const db = require('./config/db.config');
    
    // Vérifier la structure de la table medicaments
    const medicamentsStructure = await db.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'medicaments' 
      ORDER BY ordinal_position
    `);
    
    // Vérifier la structure de la table users
    const usersStructure = await db.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `);
    
    res.json({
      medicaments: medicamentsStructure.rows,
      users: usersStructure.rows
    });
  } catch (error) {
    console.error('❌ Erreur lors de la vérification des tables:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la vérification des tables',
      message: error.message 
    });
  }
});

// Middleware de gestion des erreurs amélioré
app.use((err, req, res, next) => {
  console.error('\n=== Erreur serveur ===');
  console.error('Date:', new Date().toISOString());
  console.error('URL:', req.url);
  console.error('Méthode:', req.method);
  console.error('IP:', req.ip);
  console.error('Headers:', req.headers);
  console.error('Body:', req.body);
  console.error('Erreur:', err);
  
  // Gestion spécifique des erreurs JWT
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ 
      message: 'Token expiré',
      error: 'TOKEN_EXPIRED'
    });
  }
  
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ 
      message: 'Token invalide',
      error: 'INVALID_TOKEN'
    });
  }
  
  // Gestion des erreurs CORS
  if (err.message === 'Not allowed by CORS') {
    console.error('Erreur CORS - Origin:', req.headers.origin);
    console.error('Origines autorisées:', allowedOrigins);
    return res.status(403).json({ 
      message: 'Accès non autorisé',
      error: 'CORS_ERROR',
      details: {
        origin: req.headers.origin,
        allowedOrigins: allowedOrigins
      }
    });
  }
  
  // Erreur par défaut
  res.status(err.status || 500).json({ 
    message: 'Une erreur est survenue sur le serveur',
    error: err.message || 'INTERNAL_SERVER_ERROR',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5001;
const HOST = '0.0.0.0'; // Écouter sur toutes les interfaces réseau

// Log de démarrage détaillé
console.log('=== Configuration du serveur ===');
console.log(`Port: ${PORT}`);
console.log(`Host: ${HOST}`);
console.log('=== Interfaces réseau ===');
Object.entries(require('os').networkInterfaces()).forEach(([name, interfaces]) => {
  interfaces.forEach((iface) => {
    if (iface.family === 'IPv4' && !iface.internal) {
      console.log(`${name}: ${iface.address}`);
    }
  });
});

app.listen(PORT, HOST, () => {
  console.log(`\n=== Serveur démarré ===`);
  console.log(`- http://localhost:${PORT}`);
 
  
  // Test local immédiat
  const http = require('http');
  http.get(`http://localhost:${PORT}/api/test`, (res) => {
    console.log('\n=== Test local ===');
    console.log('Local test response status:', res.statusCode);
  }).on('error', (err) => {
    console.error('Local test error:', err);
  });
}); 