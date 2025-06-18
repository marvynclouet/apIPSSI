const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const db = require('../config/db.config');
const medicamentController = require('../controllers/medicament.controller');

// Recherche de médicaments par nom (query param: q)
router.get('/search', async (req, res) => {
  const q = req.query.q || '';
  try {
    const result = await db.query(
      "SELECT id, name, description, price, stock, image_url FROM medicaments WHERE name ILIKE $1",
      [`%${q}%`]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
});

// Obtenir tous les médicaments
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, name, description, price, stock, image_url FROM medicaments ORDER BY name ASC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
});

// Obtenir un médicament par son ID
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, name, description, price, stock, image_url FROM medicaments WHERE id = $1",
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Médicament non trouvé' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
});

// Ajouter un médicament (admin uniquement)
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, price, stock, image_url } = req.body;

    // Vérifier si l'URL de l'image est valide
    if (image_url && !image_url.startsWith('http://') && !image_url.startsWith('https://')) {
      return res.status(400).json({ message: 'L\'URL de l\'image doit commencer par http:// ou https://' });
    }

    const result = await db.query(
      'INSERT INTO medicaments (name, description, price, stock, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [name, description, price, stock, image_url]
    );

    res.status(201).json({
      message: 'Médicament ajouté avec succès',
      id: result.rows[0].id
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du médicament:', error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout du médicament' });
  }
});

// Mettre à jour un médicament (admin uniquement)
router.put('/:id', auth, async (req, res) => {
  try {
    console.log('Corps complet de la requête:', req.body);
    const { name, description, price, stock, image_url } = req.body;
    console.log('Données extraites:', { name, description, price, stock, image_url });

    // Vérifier si l'URL de l'image est valide
    if (image_url && !image_url.startsWith('http://') && !image_url.startsWith('https://')) {
      return res.status(400).json({ message: 'L\'URL de l\'image doit commencer par http:// ou https://' });
    }

    // D'abord, récupérer les données actuelles du médicament
    const currentResult = await db.query(
      'SELECT * FROM medicaments WHERE id = $1',
      [req.params.id]
    );
    console.log('Données actuelles du médicament:', currentResult.rows[0]);

    if (currentResult.rows.length === 0) {
      return res.status(404).json({ message: 'Médicament non trouvé' });
    }

    // Utiliser la nouvelle image si elle est fournie, sinon garder l'ancienne
    const finalImageUrl = image_url !== undefined ? image_url : currentResult.rows[0]?.image_url;
    console.log('Image finale qui sera utilisée:', finalImageUrl);

    const updateResult = await db.query(
      'UPDATE medicaments SET name = $1, description = $2, price = $3, stock = $4, image_url = $5 WHERE id = $6 RETURNING *',
      [name, description, price, stock, finalImageUrl, req.params.id]
    );
    console.log('Résultat de la mise à jour:', updateResult.rows[0]);

    res.json({ 
      message: 'Médicament mis à jour avec succès',
      medicament: updateResult.rows[0]
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du médicament:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du médicament' });
  }
});

// Supprimer un médicament (admin uniquement)
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await db.query('DELETE FROM medicaments WHERE id = $1 RETURNING id', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Médicament non trouvé' });
    }
    
    res.json({ message: 'Médicament supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du médicament:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du médicament' });
  }
});

module.exports = router; 