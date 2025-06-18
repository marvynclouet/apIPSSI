const express = require('express');
const router = express.Router();
const { getUserProfile, updateProfile } = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');
const db = require('../config/db.config');
const bcrypt = require('bcrypt');

// Protéger toutes les routes avec le middleware d'authentification
router.use(authMiddleware);

// Route pour obtenir le profil de l'utilisateur connecté
router.get('/profile', getUserProfile);

// Route pour mettre à jour le profil de l'utilisateur connecté
router.post('/profile', updateProfile);

// Routes protégées par le middleware admin
router.use(adminMiddleware);

// Route pour obtenir tous les utilisateurs (admin seulement)
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name, siret, email, role, phone, address, city, postal_code, created_at, updated_at FROM users ORDER BY name ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
  }
});

// Route pour créer un nouvel utilisateur (admin seulement)
router.post('/', async (req, res) => {
  try {
    const { name, siret, email, password, role, phone, address, city, postal_code } = req.body;
    
    // Vérifier si l'email existe déjà
    const existingResult = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingResult.rows.length > 0) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const result = await db.query(
      `INSERT INTO users (name, siret, email, password, role, phone, address, city, postal_code)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [name, siret, email, hashedPassword, role, phone, address, city, postal_code]
    );

    res.status(201).json({ 
      message: 'Utilisateur créé avec succès',
      id: result.rows[0].id
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur' });
  }
});

// Route pour mettre à jour un utilisateur (admin seulement)
router.put('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, siret, email, password, role, phone, address, city, postal_code } = req.body;

    // Vérifier si l'utilisateur existe
    const userResult = await db.query('SELECT id FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    const existingResult = await db.query('SELECT id FROM users WHERE email = $1 AND id != $2', [email, userId]);
    if (existingResult.rows.length > 0) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Préparer la requête de mise à jour
    let updateQuery = 'UPDATE users SET name = $1, siret = $2, email = $3, role = $4, phone = $5, address = $6, city = $7, postal_code = $8';
    const updateValues = [name, siret, email, role, phone, address, city, postal_code];

    // Ajouter le mot de passe à la mise à jour si fourni
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateQuery += ', password = $9';
      updateValues.push(hashedPassword);
    }

    updateQuery += ' WHERE id = $' + (updateValues.length + 1);
    updateValues.push(userId);

    await db.query(updateQuery, updateValues);

    res.json({ message: 'Utilisateur mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur' });
  }
});

// Route pour supprimer un utilisateur (admin seulement)
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // Vérifier si l'utilisateur existe
    const result = await db.query('SELECT id FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Suppression physique
    await db.query('DELETE FROM users WHERE id = $1', [userId]);

    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur' });
  }
});

module.exports = router; 