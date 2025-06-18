const db = require('../config/db.config');

const orderController = {
  // Créer une nouvelle commande
  createOrder: async (req, res) => {
    try {
      const { items, total, message } = req.body;
      const userId = req.user.userId;

      // Récupérer les informations de l'utilisateur
      const userResult = await db.query(
        'SELECT name, address FROM users WHERE id = $1',
        [userId]
      );

      if (userResult.rows.length === 0) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      const user = userResult.rows[0];

      // Insérer la commande
      const orderResult = await db.query(
        `INSERT INTO orders (user_id, total, status, delivery_name, delivery_address, delivery_message)
         VALUES ($1, $2, 'pending', $3, $4, $5) RETURNING id`,
        [userId, total, user.name, user.address, message]
      );

      const orderId = orderResult.rows[0].id;

      // Insérer les items de la commande
      for (const item of items) {
        await db.query(
          `INSERT INTO order_items (order_id, medicament_id, quantity, price)
           VALUES ($1, $2, $3, $4)`,
          [orderId, item.medicamentId, item.quantity, item.price]
        );
      }

      res.status(201).json({
        id: orderId,
        message: 'Commande créée avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      res.status(500).json({ 
        error: 'Erreur serveur', 
        details: error.message 
      });
    }
  },

  // Récupérer toutes les commandes d'un utilisateur
  getUserOrders: async (req, res) => {
    try {
      const userId = req.user.userId;
      const result = await db.query(
        `SELECT o.*, 
                COALESCE(
                  (SELECT json_agg(
                    json_build_object(
                      'id', oi.id,
                      'medicamentId', oi.medicament_id,
                      'quantity', oi.quantity,
                      'price', oi.price,
                      'name', m.name,
                      'image_url', m.image_url
                    )
                  )
                  FROM order_items oi
                  LEFT JOIN medicaments m ON oi.medicament_id = m.id
                  WHERE oi.order_id = o.id), '[]'::json
                ) as items
         FROM orders o
         WHERE o.user_id = $1
         ORDER BY o.created_at DESC`,
        [userId]
      );

      res.json(result.rows);
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      res.status(500).json({ 
        error: 'Erreur serveur', 
        details: error.message 
      });
    }
  },

  // Récupérer une commande spécifique
  getOrder: async (req, res) => {
    try {
      const orderId = req.params.id;
      const userId = req.user.userId;

      const result = await db.query(
        `SELECT o.*, 
                COALESCE(
                  (SELECT json_agg(
                    json_build_object(
                      'id', oi.id,
                      'medicamentId', oi.medicament_id,
                      'quantity', oi.quantity,
                      'price', oi.price,
                      'name', m.name,
                      'image_url', m.image_url
                    )
                  )
                  FROM order_items oi
                  LEFT JOIN medicaments m ON oi.medicament_id = m.id
                  WHERE oi.order_id = o.id), '[]'::json
                ) as items
         FROM orders o
         WHERE o.id = $1 AND o.user_id = $2`,
        [orderId, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Commande non trouvée' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Erreur lors de la récupération de la commande:', error);
      res.status(500).json({ 
        error: 'Erreur serveur', 
        details: error.message 
      });
    }
  },

  // Récupérer toutes les commandes (pour l'admin)
  getAllOrders: async (req, res) => {
    try {
      const result = await db.query(
        `SELECT o.*, 
                u.name as user_name,
                u.email as user_email,
                COALESCE(
                  (SELECT json_agg(
                    json_build_object(
                      'id', oi.id,
                      'medicamentId', oi.medicament_id,
                      'quantity', oi.quantity,
                      'price', oi.price,
                      'name', m.name,
                      'image_url', m.image_url
                    )
                  )
                  FROM order_items oi
                  LEFT JOIN medicaments m ON oi.medicament_id = m.id
                  WHERE oi.order_id = o.id), '[]'::json
                ) as items
         FROM orders o
         LEFT JOIN users u ON o.user_id = u.id
         ORDER BY o.created_at DESC`
      );

      res.json(result.rows);
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      res.status(500).json({ 
        error: 'Erreur serveur', 
        details: error.message 
      });
    }
  }
};

module.exports = orderController; 