const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middleware/auth.middleware');
const db = require('../config/db.config');

// Middleware pour vérifier si l'utilisateur est admin
const isAdmin = async (req, res, next) => {
  try {
    const result = await db.query('SELECT role FROM users WHERE id = $1', [req.user.userId]);
    if (result.rows.length === 0 || result.rows[0].role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    next();
  } catch (error) {
    console.error('Erreur lors de la vérification du rôle:', error);
    res.status(500).json({ message: 'Erreur lors de la vérification du rôle' });
  }
};

// Toutes les routes nécessitent une authentification
router.use(authMiddleware);

// Route admin pour récupérer toutes les commandes
router.get('/all', isAdmin, orderController.getAllOrders);

// Créer une nouvelle commande
router.post('/', orderController.createOrder);

// Récupérer toutes les commandes de l'utilisateur
router.get('/', orderController.getUserOrders);

// Récupérer une commande spécifique
router.get('/:id', orderController.getOrder);

// Route pour mettre à jour le statut d'une commande
router.put('/:id/status', isAdmin, async (req, res) => {
  try {
    console.log('Status update request:', {
      orderId: req.params.id,
      status: req.body.status,
      userId: req.user.userId
    });

    const { status } = req.body;
    const orderId = req.params.id;

    // Vérifier si la commande existe
    const result = await db.query('SELECT id FROM orders WHERE id = $1', [orderId]);
    if (result.rows.length === 0) {
      console.log('Order not found:', orderId);
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Mettre à jour le statut
    await db.query('UPDATE orders SET status = $1 WHERE id = $2', [status, orderId]);
    console.log('Status updated successfully');

    res.json({ message: 'Statut mis à jour avec succès' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour du statut',
      error: error.message 
    });
  }
});

// Route pour modifier une commande
router.put('/:id', isAdmin, async (req, res) => {
  try {
    const orderId = req.params.id;
    const { delivery_name, delivery_address, delivery_message, total, items } = req.body;

    // Vérifier si la commande existe
    const result = await db.query('SELECT id FROM orders WHERE id = $1', [orderId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Mettre à jour les informations de la commande
    await db.query(
      'UPDATE orders SET delivery_name = $1, delivery_address = $2, delivery_message = $3, total = $4 WHERE id = $5',
      [delivery_name, delivery_address, delivery_message, total, orderId]
    );

    // Supprimer les anciens items
    await db.query('DELETE FROM order_items WHERE order_id = $1', [orderId]);

    // Ajouter les nouveaux items
    for (const item of items) {
      await db.query(
        'INSERT INTO order_items (order_id, medicament_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [orderId, item.medicamentId, item.quantity, item.price]
      );
    }

    res.json({ message: 'Commande mise à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la commande:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la commande' });
  }
});

// Route pour supprimer une commande
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const orderId = req.params.id;

    // Vérifier si la commande existe
    const result = await db.query('SELECT id FROM orders WHERE id = $1', [orderId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Supprimer d'abord les items de la commande (à cause de la contrainte de clé étrangère)
    await db.query('DELETE FROM order_items WHERE order_id = $1', [orderId]);

    // Supprimer la commande
    await db.query('DELETE FROM orders WHERE id = $1', [orderId]);

    res.json({ message: 'Commande supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la commande:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de la commande' });
  }
});

module.exports = router; 