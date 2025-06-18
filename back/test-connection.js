const { Pool } = require('pg');
require('dotenv').config();

async function testConnection() {
  console.log('🧪 Test de connexion à PostgreSQL...');
  console.log('Variables d\'environnement :');
  console.log('- DB_HOST:', process.env.DB_HOST);
  console.log('- DB_PORT:', process.env.DB_PORT);
  console.log('- DB_USER:', process.env.DB_USER);
  console.log('- DB_NAME:', process.env.DB_NAME);
  console.log('- DATABASE_URL:', process.env.DATABASE_URL ? 'Présente' : 'Absente');
  console.log('- NODE_ENV:', process.env.NODE_ENV);
  
  let pool;
  
  try {
    if (process.env.DATABASE_URL) {
      console.log('🔗 Utilisation de DATABASE_URL...');
      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      });
    } else {
      console.log('🔧 Utilisation des paramètres individuels...');
      pool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'bddfinalgsb',
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      });
    }

    console.log('📡 Tentative de connexion...');
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
    
    client.release();
    await pool.end();
    console.log('🔌 Connexion fermée');
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error);
    if (pool) {
      await pool.end();
    }
  }
}

testConnection(); 