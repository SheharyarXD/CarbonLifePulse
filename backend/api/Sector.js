const express = require('express');
const router = express.Router();
// const multer = require('multer');
const path = require('path');
const pool = require('../db');  
// const upload = multer({
//   dest: 'uploads/', 
//   limits: {
//     fileSize: 10 * 1024 * 1024, 
//   },
//   fileFilter: (req, file, cb) => {

//     const fileTypes = /jpeg|jpg|png|gif/;
//     const mimeType = fileTypes.test(file.mimetype);
//     if (mimeType) {
//       return cb(null, true);
//     } else {
//       cb(new Error('Only image files are allowed.'));
//     }
//   },
// });


// // Create Sector
// router.post('/sector',upload.single('image'), async (req, res) => {
  
//     const { name, image } = req.body;
//     try {
//         const sector = await CreateSector(name, image);
//         if (sector) {
//             res.status(201).json(sector); // Successfully created
//         } else {
//             res.status(400).json({ error: 'Failed to create sector' });
//         }
//     } catch (error) {
//         console.error('Error creating sector:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// Read All Sectors

router.get('/sectors', async (req, res) => {
    try {
        const sectors = await ReadSectors();
        res.status(200).json(sectors); // Successfully fetched
    } catch (error) {
        console.error('Error reading sectors:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get Sector by ID
router.get('/sector/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const sector = await GetSectorById(id);
        if (sector) {
            res.status(200).json(sector); // Successfully found sector
        } else {
            res.status(404).json({ error: 'Sector not found' });
        }
    } catch (error) {
        console.error('Error getting sector by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update Sector by ID
router.put('/sector/:id', async (req, res) => {
    const { id } = req.params;
    const { name, image } = req.body;
    try {
        const updatedSector = await UpdateSector(id, name, image);
        if (updatedSector) {
            res.status(200).json(updatedSector); // Successfully updated sector
        } else {
            res.status(404).json({ error: 'Sector not found or update failed' });
        }
    } catch (error) {
        console.error('Error updating sector:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete Sector by ID
router.delete('/sector/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedSector = await DeleteSector(id);
        if (deletedSector) {
            res.status(200).json({ message: 'Sector deleted successfully' }); // Successfully deleted
        } else {
            res.status(404).json({ error: 'Sector not found' });
        }
    } catch (error) {
        console.error('Error deleting sector:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
async function CreateSector(Name, Image) {
    try {
      const query = 
        `INSERT INTO sectors (name, image)
        VALUES ($1, $2)
        RETURNING *;`
      ;
      const values = [Name, Image];
      const result = await pool.query(query, values);
      console.log('Sector Created Successfully:', result.rows[0]);
    } catch (error) {
      console.error(`Error creating sector: ${error.message}`);
    }
  }
  
  // Read All Sectors
  async function ReadSectors() {
    try {
      const query = `SELECT * FROM sectors;`;
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error(`Error reading sectors: ${error.message}`);
      return [];
    }
  }
  
  // Get Sector by ID
  async function GetSectorById(Id) {
    try {
      const query = `SELECT * FROM sectors WHERE id = $1;`;
      const result = await pool.query(query, [Id]);
      return result.rows.length ? result.rows[0] : null;
    } catch (error) {
      console.error(`Error getting sector by ID: ${error.message}`);
      return null;
    }
  }
  
  // Update Sector
  async function UpdateSector(Id, Name, Image) {
    try {
      const query = 
        `UPDATE sectors SET name = $1, image = $2 WHERE id = $3 RETURNING *`;
      ;
      const values = [Name, Image, Id];
      const result = await pool.query(query, values);
      return result.rows.length ? result.rows[0] : null;
    } catch (error) {
      console.error(`Error updating sector: ${error.message}`);
      return null;
    }
  }
  
  // Delete Sector
  async function DeleteSector(Id) {
    try {
      const query = 'DELETE FROM sectors WHERE id = $1 RETURNING *;';
      const result = await pool.query(query, [Id]);
      return result.rows.length ? result.rows[0] : null;
    } catch (error) {
      console.error(`Error deleting sector: ${error.message}`);
      return null;
    }
  }
module.exports = router;
