const db = require('../config/db.config');

const medicamentController = {
  // Récupérer tous les médicaments
  getAllMedicaments: async (req, res) => {
    try {
      const result = await db.query(
        'SELECT * FROM medicaments ORDER BY name ASC'
      );
      res.json(result.rows);
    } catch (error) {
      console.error('Erreur lors de la récupération des médicaments:', error);
      res.status(500).json({ 
        error: 'Erreur serveur', 
        details: error.message 
      });
    }
  },

  // Récupérer un médicament par son ID
  getMedicamentById: async (req, res) => {
    try {
      const result = await db.query(
        'SELECT * FROM medicaments WHERE id = $1',
        [req.params.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Médicament non trouvé' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Erreur lors de la récupération du médicament:', error);
      res.status(500).json({ 
        error: 'Erreur serveur', 
        details: error.message 
      });
    }
  }
};

module.exports = medicamentController; 