const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function createTestUsers() {
  console.log('👥 Création des utilisateurs de test...');
  
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

    // Hash du mot de passe 'test123'
    const hashedPassword = await bcrypt.hash('test123', 10);
    console.log('🔐 Mot de passe hashé créé');

    // Créer les utilisateurs de test
    const testUsers = [
      {
        name: 'Pharmacie Test',
        siret: '12345678901234',
        email: 'test@test.com',
        password: hashedPassword,
        role: 'user',
        phone: '0612345678',
        address: '123 rue Test',
        city: 'Paris',
        postal_code: '75000'
      },
      {
        name: 'GSB Admin',
        siret: '98765432101234',
        email: 'admin@gsb-pharma.fr',
        password: hashedPassword,
        role: 'admin',
        phone: '0123456789',
        address: '15 rue de l\'Administration',
        city: 'Paris',
        postal_code: '75001'
      },
      {
        name: 'Pharmacie Demo',
        siret: '11111111111111',
        email: 'demo@pharmacy.com',
        password: hashedPassword,
        role: 'user',
        phone: '0987654321',
        address: '456 avenue Demo',
        city: 'Lyon',
        postal_code: '69000'
      }
    ];

    console.log(`📝 Insertion de ${testUsers.length} utilisateurs...`);

    for (const user of testUsers) {
      try {
        const result = await pool.query(`
          INSERT INTO users (name, siret, email, password, role, phone, address, city, postal_code)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (email) DO UPDATE SET
            name = EXCLUDED.name,
            siret = EXCLUDED.siret,
            password = EXCLUDED.password,
            role = EXCLUDED.role,
            phone = EXCLUDED.phone,
            address = EXCLUDED.address,
            city = EXCLUDED.city,
            postal_code = EXCLUDED.postal_code
          RETURNING id, email, role
        `, [user.name, user.siret, user.email, user.password, user.role, user.phone, user.address, user.city, user.postal_code]);

        console.log(`✅ Utilisateur créé/mis à jour: ${result.rows[0].email} (${result.rows[0].role})`);
      } catch (error) {
        console.error(`❌ Erreur lors de la création de ${user.email}:`, error.message);
      }
    }

    // Vérifier les utilisateurs créés
    console.log('\n📋 Liste des utilisateurs dans la base de données:');
    const usersResult = await pool.query('SELECT id, email, role, name FROM users ORDER BY id');
    usersResult.rows.forEach(user => {
      console.log(`  - ID: ${user.id}, Email: ${user.email}, Rôle: ${user.role}, Nom: ${user.name}`);
    });

    console.log('\n🎉 Création des utilisateurs terminée !');
    console.log('\n🔑 Identifiants de test:');
    console.log('  - Email: test@test.com, Mot de passe: test123');
    console.log('  - Email: admin@gsb-pharma.fr, Mot de passe: test123');
    console.log('  - Email: demo@pharmacy.com, Mot de passe: test123');

  } catch (error) {
    console.error('❌ Erreur lors de la création des utilisateurs:', error);
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
  createTestUsers()
    .then(() => {
      console.log('✅ Script terminé avec succès');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script échoué:', error);
      process.exit(1);
    });
}

module.exports = createTestUsers; 