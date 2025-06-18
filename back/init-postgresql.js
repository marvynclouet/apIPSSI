const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function initializePostgreSQL() {
  console.log('🗄️ Initialisation de la base de données PostgreSQL...');
  
  let pool;
  
  try {
    // Créer le pool de connexion
    pool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'bddfinalgsb',
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });

    console.log('✅ Connexion à PostgreSQL établie');

    // Lire le fichier SQL PostgreSQL
    const sqlFile = path.join(__dirname, 'schema-postgresql.sql');
    const sqlContent = await fs.readFile(sqlFile, 'utf8');
    
    console.log('📄 Lecture du fichier SQL PostgreSQL...');
    
    // Diviser en requêtes individuelles en respectant les blocs BEGIN/COMMIT
    const queries = [];
    let currentQuery = '';
    const lines = sqlContent.split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Ignorer les lignes vides et commentaires
      if (!trimmedLine || trimmedLine.startsWith('--') || trimmedLine.startsWith('/*')) {
        continue;
      }
      
      currentQuery += line + '\n';
      
      // Si la ligne se termine par un point-virgule, c'est la fin d'une requête
      if (trimmedLine.endsWith(';')) {
        queries.push(currentQuery.trim());
        currentQuery = '';
      }
    }
    
    // Ajouter la dernière requête si elle existe
    if (currentQuery.trim()) {
      queries.push(currentQuery.trim());
    }

    console.log(`🔧 Exécution de ${queries.length} requêtes...`);

    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      if (query.trim()) {
        try {
          console.log(`📝 Exécution requête ${i + 1}/${queries.length}:`);
          console.log(query.substring(0, 100) + (query.length > 100 ? '...' : ''));
          await pool.query(query);
          console.log(`✅ Requête ${i + 1}/${queries.length} exécutée avec succès`);
        } catch (error) {
          console.error(`❌ Erreur sur la requête ${i + 1}:`);
          console.error('Requête:', query);
          console.error('Erreur:', error.message);
        }
      }
    }

    console.log('🎉 Base de données PostgreSQL initialisée avec succès !');

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

    // Vérifier les utilisateurs
    try {
      const usersResult = await pool.query('SELECT id, email, role FROM users');
      console.log('👥 Utilisateurs créés :');
      usersResult.rows.forEach(user => {
        console.log(`  - ID: ${user.id}, Email: ${user.email}, Rôle: ${user.role}`);
      });
    } catch (error) {
      console.log('⚠️ Table users pas encore créée ou vide');
    }

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

// Exécuter si le script est appelé directement
if (require.main === module) {
  initializePostgreSQL()
    .then(() => {
      console.log('✅ Script terminé avec succès');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script échoué :', error);
      process.exit(1);
    });
}

module.exports = initializePostgreSQL; 