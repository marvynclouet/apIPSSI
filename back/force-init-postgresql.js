const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function forceInitializePostgreSQL() {
  console.log('🗄️ Forçage de l\'initialisation PostgreSQL...');
  
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
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      });
    }

    console.log('✅ Connexion à PostgreSQL établie');

    // Lire le fichier SQL
    const sqlFile = path.join(__dirname, 'bddfinalgsb.sql');
    const sqlContent = await fs.readFile(sqlFile, 'utf8');
    
    console.log('📄 Lecture du fichier SQL...');
    
    // Convertir le SQL MySQL en PostgreSQL
    let postgresSQL = sqlContent
      // Remplacer les backticks par des guillemets doubles
      .replace(/`/g, '"')
      // Remplacer AUTO_INCREMENT par SERIAL
      .replace(/AUTO_INCREMENT/g, 'SERIAL')
      // Remplacer ENGINE=InnoDB par rien
      .replace(/ENGINE=InnoDB/g, '')
      // Remplacer DEFAULT CHARSET=utf8 par rien
      .replace(/DEFAULT CHARSET=utf8/g, '')
      // Supprimer les lignes SET SQL_MODE
      .replace(/SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";\n/g, '')
      .replace(/START TRANSACTION;\n/g, 'BEGIN;\n')
      .replace(/COMMIT;\n/g, 'COMMIT;\n')
      .replace(/SET time_zone = "\+00:00";\n/g, '')
      .replace(/SET NAMES utf8mb4;\n/g, '');

    // Diviser en requêtes individuelles
    const queries = postgresSQL
      .split(';')
      .map(query => query.trim())
      .filter(query => query.length > 0 && !query.startsWith('--') && !query.startsWith('/*'));

    console.log(`🔧 Exécution de ${queries.length} requêtes...`);

    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      if (query.trim()) {
        try {
          await pool.query(query);
          console.log(`✅ Requête ${i + 1}/${queries.length} exécutée`);
        } catch (error) {
          console.warn(`⚠️ Erreur sur la requête ${i + 1}:`, error.message);
        }
      }
    }

    console.log('🎉 Base de données PostgreSQL réinitialisée avec succès !');

    // Vérifier les tables créées
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('📋 Tables créées :');
    tablesResult.rows.forEach(table => {
      console.log(`  - ${table.table_name}`);
    });

    // Vérifier les utilisateurs seulement si la table existe
    let usersResult = { rows: [] };
    try {
      usersResult = await pool.query('SELECT id, email, role FROM users');
      console.log('👥 Utilisateurs créés :');
      usersResult.rows.forEach(user => {
        console.log(`  - ID: ${user.id}, Email: ${user.email}, Rôle: ${user.role}`);
      });
    } catch (error) {
      console.log('⚠️ Table users pas encore créée ou vide');
    }

    return { success: true, tables: tablesResult.rows, users: usersResult.rows };

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation :', error);
    throw error;
  } finally {
    if (pool) {
      await pool.end();
      console.log('🔌 Connexion fermée');
    }
  }
}

// Exécuter le script seulement si appelé directement
if (require.main === module) {
  forceInitializePostgreSQL()
    .then(() => {
      console.log('✅ Script terminé avec succès');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script échoué :', error);
      process.exit(1);
    });
}

module.exports = forceInitializePostgreSQL; 