const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function forceInitializeDatabase() {
  console.log('🗄️ Forçage de l\'initialisation de la base de données...');
  
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

    // Supprimer la base de données si elle existe
    await connection.execute(`DROP DATABASE IF EXISTS ${process.env.DB_NAME || 'bddfinalgsb'}`);
    console.log(`🗑️ Base de données '${process.env.DB_NAME || 'bddfinalgsb'}' supprimée`);

    // Créer la base de données
    await connection.execute(`CREATE DATABASE ${process.env.DB_NAME || 'bddfinalgsb'}`);
    console.log(`✅ Base de données '${process.env.DB_NAME || 'bddfinalgsb'}' créée`);

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

    console.log('🎉 Base de données réinitialisée avec succès !');

    // Vérifier les tables créées
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('📋 Tables créées :');
    tables.forEach(table => {
      console.log(`  - ${Object.values(table)[0]}`);
    });

    // Vérifier les utilisateurs
    const [users] = await connection.execute('SELECT id, email, role FROM users');
    console.log('👥 Utilisateurs créés :');
    users.forEach(user => {
      console.log(`  - ID: ${user.id}, Email: ${user.email}, Rôle: ${user.role}`);
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

// Exécuter le script
forceInitializeDatabase()
  .then(() => {
    console.log('✅ Script terminé avec succès');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script échoué :', error);
    process.exit(1);
  }); 