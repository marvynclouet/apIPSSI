require('dotenv').config();

console.log('🔍 Diagnostic des variables d\'environnement...\n');

// Afficher toutes les variables d'environnement
console.log('=== Variables d\'environnement ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***PRÉSENT***' : 'ABSENT');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '***PRÉSENT***' : 'ABSENT');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '***PRÉSENT***' : 'ABSENT');
console.log('CORS_ORIGIN:', process.env.CORS_ORIGIN);

console.log('\n=== Test de connexion PostgreSQL ===');

const { Pool } = require('pg');

async function testConnection() {
  let pool;
  
  try {
    if (process.env.DATABASE_URL) {
      console.log('🔗 Tentative avec DATABASE_URL...');
      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      });
    } else {
      console.log('🔧 Tentative avec paramètres individuels...');
      pool = new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      });
    }

    console.log('📡 Connexion...');
    const client = await pool.connect();
    console.log('✅ Connexion réussie !');
    
    // Test d'une requête simple
    const result = await client.query('SELECT NOW() as current_time');
    console.log('⏰ Heure du serveur:', result.rows[0].current_time);
    
    // Vérifier les tables
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('📋 Tables disponibles:', tablesResult.rows.map(t => t.table_name));
    
    // Vérifier les utilisateurs
    const usersResult = await client.query('SELECT id, email, role FROM users LIMIT 5');
    console.log('👥 Utilisateurs trouvés:', usersResult.rows.length);
    usersResult.rows.forEach(user => {
      console.log(`  - ID: ${user.id}, Email: ${user.email}, Rôle: ${user.role}`);
    });
    
    client.release();
    await pool.end();
    console.log('🔌 Connexion fermée');
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    console.error('Détails:', error);
    if (pool) {
      await pool.end();
    }
  }
}

testConnection(); 