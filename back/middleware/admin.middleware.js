const jwt = require('jsonwebtoken');
const db = require('../config/db.config');

const adminMiddleware = async (req, res, next) => {
  try {
    console.log('Admin middleware - User ID:', req.user.userId);
    
    const result = await db.query('SELECT role FROM users WHERE id = $1', [req.user.userId]);
    console.log('User role query result:', result.rows);

    if (result.rows.length === 0) {
      console.log('User not found in database');
      return res.status(403).json({ message: 'Utilisateur non trouvé' });
    }

    if (result.rows[0].role !== 'admin') {
      console.log('User role is not admin:', result.rows[0].role);
      return res.status(403).json({ message: 'Accès refusé. Seuls les administrateurs peuvent accéder à cette ressource.' });
    }

    console.log('Admin access granted');
    next();
  } catch (error) {
    console.error('Error in admin middleware:', error);
    res.status(500).json({ message: 'Erreur lors de la vérification des droits administrateur' });
  }
};

module.exports = adminMiddleware; 