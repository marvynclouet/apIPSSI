const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function initializeDatabase() {
  console.log('🗄️ Initialisation de la base de données...');
  
  let connection;
  
  try {
    // Connexion à MySQL sans spécifier de base de données
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      multipleStatements: true
    });

    console.log('✅ Connexion à MySQL établie');

    // Créer la base de données si elle n'existe pas
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'bddfinalgsb'}`);
    console.log(`✅ Base de données '${process.env.DB_NAME || 'bddfinalgsb'}' créée ou vérifiée`);

    // Utiliser la base de données
    await connection.execute(`USE ${process.env.DB_NAME || 'bddfinalgsb'}`);

    // Lire et exécuter le fichier SQL
    const sqlFile = path.join(__dirname, 'bddfinalgsb.sql');
    const sqlContent = await fs.readFile(sqlFile, 'utf8');
    
    console.log('📄 Lecture du fichier SQL...');
    
    // Diviser le fichier SQL en requêtes individuelles
    const queries = sqlContent
      .split(';')
      .map(query => query.trim())
      .filter(query => query.length > 0 && !query.startsWith('--'));

    console.log(`🔧 Exécution de ${queries.length} requêtes...`);

    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      if (query.trim()) {
        try {
          await connection.execute(query);
          console.log(`✅ Requête ${i + 1}/${queries.length} exécutée`);
        } catch (error) {
          console.warn(`⚠️ Erreur sur la requête ${i + 1}:`, error.message);
        }
      }
    }

    console.log('🎉 Base de données initialisée avec succès !');

    // Vérifier les tables créées
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('📋 Tables créées :');
    tables.forEach(table => {
      console.log(`  - ${Object.values(table)[0]}`);
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation :', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Connexion fermée');
    }
  }
}

// Exécuter si le script est appelé directement
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('✅ Script terminé avec succès');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script échoué :', error);
      process.exit(1);
    });
}

module.exports = initializeDatabase; 