const { Pool } = require('pg');
require('dotenv').config();

async function fixMedicamentsTable() {
  console.log('🔧 Correction de la structure de la table medicaments...');
  
  let pool;
  
  try {
    // Créer le pool de connexion
    if (process.env.DATABASE_URL) {
      console.log('🔗 Utilisation de DATABASE_URL...');
      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      });
    } else {
      console.log('🔧 Utilisation des paramètres individuels...');
      pool = new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'bddfinalgsb',
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      });
    }

    console.log('✅ Connexion à PostgreSQL établie');

    // Supprimer la table medicaments existante
    await pool.query('DROP TABLE IF EXISTS medicaments CASCADE');
    console.log('🗑️ Table medicaments supprimée');

    // Recréer la table medicaments avec la bonne structure
    await pool.query(`
      CREATE TABLE medicaments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table medicaments recréée');

    // Insérer les données de test
    await pool.query(`
      INSERT INTO medicaments (name, description, price, stock, image_url) VALUES
      ('Paracétamol', 'Antalgique et antipyrétique', 5.99, 100, '/images/paracetamol.jpg'),
      ('Ibuprofène', 'Anti-inflammatoire non stéroïdien', 7.99, 80, '/images/ibuprofene.jpg'),
      ('Aspirine', 'Antalgique et anti-inflammatoire', 6.99, 90, '/images/aspirine.jpg'),
      ('Doliprane', 'Antalgique et antipyrétique', 5.99, 150, '/images/doliprane.jpg'),
      ('Efferalgan', 'Antalgique et antipyrétique', 6.99, 120, '/images/efferalgan.jpg')
    `);
    console.log('✅ Données de test insérées');

    // Vérifier la structure
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'medicaments' 
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Structure de la table medicaments:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });

    console.log('🎉 Table medicaments corrigée avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la correction de la table medicaments:', error);
    throw error;
  } finally {
    if (pool) {
      await pool.end();
      console.log('🔌 Connexion fermée');
    }
  }
}

// Exécuter si appelé directement
if (require.main === module) {
  fixMedicamentsTable()
    .then(() => {
      console.log('✅ Script terminé avec succès');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script échoué:', error);
      process.exit(1);
    });
}

module.exports = fixMedicamentsTable; 