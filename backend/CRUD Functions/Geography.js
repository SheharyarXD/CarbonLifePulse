const express = require('express');
const router = express.Router();
const pool = require('../db'); 

// Create Geography
router.post('/geography', async (req, res) => {
    const { name, image } = req.body;
    try {
        const query = 'INSERT INTO geographies (name, image) VALUES ($1, $2) RETURNING *';
        const result = await pool.query(query, [name, image]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error while creating Geography:', error);
        res.status(500).json({ error: 'Error while creating Geography' });
    }
});

// Read All Geographies
router.get('/geographies', async (req, res) => {
    try {
        const query = 'SELECT * FROM geographies';
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error while reading Geographies:', error);
        res.status(500).json({ error: 'Error while reading Geographies' });
    }
});

// Get Geography by ID
router.get('/geography/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'SELECT * FROM geographies WHERE id = $1';
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Geography not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error while reading Geography by ID:', error);
        res.status(500).json({ error: 'Error while reading Geography by ID' });
    }
});

// Update Geography by ID
router.put('/geography/:id', async (req, res) => {
    const { id } = req.params;
    const { name, image } = req.body;
    try {
        const query = 'UPDATE geographies SET name = $1, image = $2 WHERE id = $3 RETURNING *';
        const result = await pool.query(query, [name, image, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Geography not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error while updating Geography:', error);
        res.status(500).json({ error: 'Error while updating Geography' });
    }
});

// Delete Geography by ID
router.delete('/geography/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'DELETE FROM geographies WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Geography not found' });
        }
        res.status(200).json({ message: 'Geography deleted successfully' });
    } catch (error) {
        console.error('Error while deleting Geography:', error);
        res.status(500).json({ error: 'Error while deleting Geography' });
    }
});

module.exports = router;
