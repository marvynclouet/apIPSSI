const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDatabase() {
  console.log('🔍 Vérification de la base de données...');
  
  let connection;
  
  try {
    // Connexion à la base de données
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'bddfinalgsb'
    });

    console.log('✅ Connexion à la base de données établie');

    // Vérifier les tables
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('\n📋 Tables disponibles :');
    tables.forEach(table => {
      console.log(`  - ${Object.values(table)[0]}`);
    });

    // Vérifier les données dans chaque table
    console.log('\n📊 Statistiques des données :');
    
    // Utilisateurs
    try {
      const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
      console.log(`  👥 Utilisateurs : ${users[0].count}`);
    } catch (error) {
      console.log('  👥 Utilisateurs : Table non trouvée');
    }

    // Médicaments
    try {
      const [medicaments] = await connection.execute('SELECT COUNT(*) as count FROM medicaments');
      console.log(`  💊 Médicaments : ${medicaments[0].count}`);
    } catch (error) {
      console.log('  💊 Médicaments : Table non trouvée');
    }

    // Commandes
    try {
      const [orders] = await connection.execute('SELECT COUNT(*) as count FROM orders');
      console.log(`  📦 Commandes : ${orders[0].count}`);
    } catch (error) {
      console.log('  📦 Commandes : Table non trouvée');
    }

    // Vérifier la structure de la base de données
    console.log('\n🏗️ Structure de la base de données :');
    
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      try {
        const [columns] = await connection.execute(`DESCRIBE ${tableName}`);
        console.log(`\n  📋 Table : ${tableName}`);
        columns.forEach(column => {
          console.log(`    - ${column.Field} (${column.Type})`);
        });
      } catch (error) {
        console.log(`  ❌ Erreur lors de la vérification de ${tableName}`);
      }
    }

    console.log('\n✅ Vérification terminée avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors de la vérification :', error.message);
    
    if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\n💡 Solution : La base de données n\'existe pas encore.');
      console.log('   Exécutez : npm run init-db');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Solution : Impossible de se connecter à MySQL.');
      console.log('   Vérifiez les variables d\'environnement DB_HOST et DB_PASSWORD');
    }
    
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Connexion fermée');
    }
  }
}

// Exécuter si le script est appelé directement
if (require.main === module) {
  checkDatabase()
    .then(() => {
      console.log('\n🎉 Script de vérification terminé');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Script de vérification échoué');
      process.exit(1);
    });
}

module.exports = checkDatabase; 