const express = require('express');
const router = express.Router();
const db = require('../config/db.config'); // adapte selon ton projet

router.get('/stats', async (req, res) => {
  try {
    const userId = parseInt(req.query.user_id, 10);
    console.log('--- [API /stats] ---');
    console.log('userId reçu pour stats:', userId, '| Type:', typeof userId);

    // Nombre total de médicaments (pour tout le monde)
    const medicamentsResult = await db.query('SELECT COUNT(*) AS count FROM medicaments');
    console.log('Résultat SQL medicaments:', medicamentsResult.rows[0]);

    let commandes = 0;
    let livraisons = 0;

    if (!isNaN(userId) && userId > 0) {
      // Commandes en cours (pending) pour ce user
      console.log("Requête SQL commandes:", "SELECT COUNT(*) AS count FROM orders WHERE status = 'pending' AND user_id = $1", userId);
      const ordersResult = await db.query(
        "SELECT COUNT(*) AS count FROM orders WHERE status = 'pending' AND user_id = $1",
        [userId]
      );
      console.log('Résultat SQL commandes:', ordersResult.rows[0]);
      commandes = parseInt(ordersResult.rows[0].count);

      // Livraisons prévues (shipped) pour ce user
      console.log("Requête SQL livraisons:", "SELECT COUNT(*) AS count FROM orders WHERE status = 'shipped' AND user_id = $1", userId);
      const livsResult = await db.query(
        "SELECT COUNT(*) AS count FROM orders WHERE status = 'shipped' AND user_id = $1",
        [userId]
      );
      console.log('Résultat SQL livraisons:', livsResult.rows[0]);
      livraisons = parseInt(livsResult.rows[0].count);
    } else {
      console.log('Aucun userId fourni ou userId invalide');
      commandes = 0;
      livraisons = 0;
    }

    console.log('Stats renvoyées:', {
      medicaments: parseInt(medicamentsResult.rows[0].count),
      commandes,
      livraisons
    });

    res.json({
      medicaments: parseInt(medicamentsResult.rows[0].count),
      commandes,
      livraisons
    });
  } catch (err) {
    console.error('Erreur dans /stats:', err);
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
});

module.exports = router;
