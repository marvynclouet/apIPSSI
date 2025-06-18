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
      
      // Récupérer les commandes de base
      const ordersResult = await db.query(
        `SELECT id, total, status, created_at, delivery_name, delivery_address, delivery_message
         FROM orders 
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [userId]
      );

      const orders = ordersResult.rows;

      // Pour chaque commande, récupérer les items
      for (let order of orders) {
        const itemsResult = await db.query(
          `SELECT oi.id, oi.medicament_id, oi.quantity, oi.price, m.name, m.image_url
           FROM order_items oi
           LEFT JOIN medicaments m ON oi.medicament_id = m.id
           WHERE oi.order_id = $1`,
          [order.id]
        );
        
        order.items = itemsResult.rows.map(item => ({
          id: item.id,
          medicamentId: item.medicament_id,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
          image_url: item.image_url
        }));
      }

      res.json(orders);
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

      // Récupérer la commande
      const orderResult = await db.query(
        `SELECT id, total, status, created_at, delivery_name, delivery_address, delivery_message
         FROM orders 
         WHERE id = $1 AND user_id = $2`,
        [orderId, userId]
      );

      if (orderResult.rows.length === 0) {
        return res.status(404).json({ message: 'Commande non trouvée' });
      }

      const order = orderResult.rows[0];

      // Récupérer les items de la commande
      const itemsResult = await db.query(
        `SELECT oi.id, oi.medicament_id, oi.quantity, oi.price, m.name, m.image_url
         FROM order_items oi
         LEFT JOIN medicaments m ON oi.medicament_id = m.id
         WHERE oi.order_id = $1`,
        [orderId]
      );

      order.items = itemsResult.rows.map(item => ({
        id: item.id,
        medicamentId: item.medicament_id,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
        image_url: item.image_url
      }));

      res.json(order);
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
      // Récupérer les commandes avec les informations utilisateur
      const ordersResult = await db.query(
        `SELECT o.id, o.total, o.status, o.created_at, o.delivery_name, o.delivery_address, o.delivery_message,
                u.name as user_name, u.email as user_email
         FROM orders o
         LEFT JOIN users u ON o.user_id = u.id
         ORDER BY o.created_at DESC`
      );

      const orders = ordersResult.rows;

      // Pour chaque commande, récupérer les items
      for (let order of orders) {
        const itemsResult = await db.query(
          `SELECT oi.id, oi.medicament_id, oi.quantity, oi.price, m.name, m.image_url
           FROM order_items oi
           LEFT JOIN medicaments m ON oi.medicament_id = m.id
           WHERE oi.order_id = $1`,
          [order.id]
        );
        
        order.items = itemsResult.rows.map(item => ({
          id: item.id,
          medicamentId: item.medicament_id,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
          image_url: item.image_url
        }));
      }

      res.json(orders);
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