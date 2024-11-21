const express = require('express');
const router = express.Router();
const pool = require('../db');  // Import PostgreSQL pool connection
// Create ISIC_Class
router.post('/isic-class', async (req, res) => {
  try {
    const { Name, Image } = req.body;

    const result = await pool.query(
      'INSERT INTO ISIC_Classes (Name, Image) VALUES ($1, $2) RETURNING *',
      [Name, Image]
    );

    const newISICClass = result.rows[0];
    res.status(201).json(newISICClass);
  } catch (error) {
    console.error('Error creating ISIC_Class:', error);
    res.status(500).send('Error creating ISIC_Class');
  }
});

// Read All ISIC_Classes
router.get('/isic-classes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ISIC_Classes');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error reading ISIC_Classes:', error);
    res.status(500).send('Error reading ISIC_Classes');
  }
});

// Read ISIC_Class by ID
router.get('/isic-class/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM ISIC_Classes WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).send('ISIC_Class not found');
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error reading ISIC_Class by ID:', error);
    res.status(500).send('Error reading ISIC_Class');
  }
});

// Update ISIC_Class by ID
router.put('/isic-class/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { Name, Image } = req.body;

    const result = await pool.query(
      'UPDATE ISIC_Classes SET Name = $1, Image = $2 WHERE id = $3 RETURNING *',
      [Name, Image, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send('ISIC_Class not found');
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating ISIC_Class:', error);
    res.status(500).send('Error updating ISIC_Class');
  }
});

// Delete ISIC_Class by ID
router.delete('/isic-class/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM ISIC_Classes WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).send('ISIC_Class not found');
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error deleting ISIC_Class:', error);
    res.status(500).send('Error deleting ISIC_Class');
  }
});

module.exports = router;
