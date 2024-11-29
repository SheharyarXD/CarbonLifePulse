const express = require('express');
const router = express.Router();
const pool = require('../db'); 

router.post('/activity-type', async (req, res) => {
  try {
    const { Name, Image } = req.body;

    const result = await pool.query(
      'INSERT INTO ActivityTypes (Name, Image) VALUES ($1, $2) RETURNING *',
      [Name, Image]
    );

    const newActivityType = result.rows[0];
    res.status(201).json(newActivityType);
  } catch (error) {
    console.error('Error creating ActivityType:', error);
    res.status(500).send('Error creating ActivityType');
  }
});

// Read All ActivityTypes
router.get('/activity-types', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ActivityTypes');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error reading ActivityTypes:', error);
    res.status(500).send('Error reading ActivityTypes');
  }
});

// Read ActivityType by ID
router.get('/activity-type/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM ActivityTypes WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).send('ActivityType not found');
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error reading ActivityType by ID:', error);
    res.status(500).send('Error reading ActivityType');
  }
});

// Update ActivityType by ID
router.put('/activity-type/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { Name, Image } = req.body;

    const result = await pool.query(
      'UPDATE ActivityTypes SET Name = $1, Image = $2 WHERE id = $3 RETURNING *',
      [Name, Image, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send('ActivityType not found');
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating ActivityType:', error);
    res.status(500).send('Error updating ActivityType');
  }
});

// Delete ActivityType by ID
router.delete('/activity-type/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM ActivityTypes WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).send('ActivityType not found');
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error deleting ActivityType:', error);
    res.status(500).send('Error deleting ActivityType');
  }
});

module.exports = router;