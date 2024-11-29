const express = require('express');
const pool = require('../db'); // Import the database connection

const router = express.Router();

// Create Activity (with foreign keys)
router.post('/', async (req, res) => {
    const { name, carbon, activityId, sectorId, geographyId, isicClassId } = req.body;

    try {
        // Insert into CarbonEmissions table with foreign keys
        const carbonEmissionResult = await pool.query(
            `INSERT INTO "CarbonEmissions" (carbon, "ActivityId", "SectorId", "GeographyId", "ISICClassId")
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [carbon, activityId, sectorId, geographyId, isicClassId]
        );

        res.status(201).json(carbonEmissionResult.rows[0]);
    } catch (error) {
        console.error(`Error creating activity: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// Read Activity by ID
// router.get('/:id', async (req, res) => {
//     const { id } = req.params;

//     try {
//         // Get activity by id with foreign key details
//         const result = await pool.query(
//             `SELECT 
//                 a.id AS activity_id, a.name AS activity_name, ce.carbon AS activity_carbon,
//                 s.name AS sector_name, g.name AS geography_name, i.name AS isic_class_name
//              FROM "CarbonEmissions" ce
//              JOIN "activitytypes" a ON ce."ActivityId" = a.id
//              JOIN "sectors" s ON ce."SectorId" = s.id
//              JOIN "geographies" g ON ce."GeographyId" = g.id
//              JOIN "isic_classes" i ON ce."ISICClassId" = i.id
//              WHERE ce.id = $1`,
//             [id]
//         );

//         if (result.rows.length > 0) {
//             res.status(200).json(result.rows[0]);
//         } else {
//             res.status(404).json({ error: 'Activity not found' });
//         }
//     } catch (error) {
//         console.error(`Error fetching activityL: ${error.message}`);
//         res.status(500).json({ error: error.message });
//     }
// });

// Update Activity by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { carbon, sectorId, geographyId, isicClassId } = req.body;

    try {
        // Update CarbonEmissions record by activityId
        const updateResult = await pool.query(
            `UPDATE "CarbonEmissions" SET carbon = $1, "SectorId" = $2, "GeographyId" = $3, "ISICClassId" = $4
             WHERE id = $5 RETURNING *`,
            [carbon, sectorId, geographyId, isicClassId, id]
        );

        if (updateResult.rows.length > 0) {
            res.status(200).json(updateResult.rows[0]);
        } else {
            res.status(404).json({ error: 'Carbon emission not found' });
        }
    } catch (error) {
        console.error(`Error updating activity: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// Delete Activity by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // First, delete CarbonEmissions record
        const deleteResult = await pool.query(
            'DELETE FROM "CarbonEmissions" WHERE id = $1 RETURNING *',
            [id]
        );

        if (deleteResult.rows.length > 0) {
            res.status(200).json({ message: 'Activity deleted' });
        } else {
            res.status(404).json({ error: 'Activity not found' });
        }
    } catch (error) {
        console.error(`Error deleting activity: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// Read all Activities
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT 
                a.id AS activity_id, a.name AS activity_name, ce.carbon AS activity_carbon,
                s.name AS sector_name, g.name AS geography_name, i.name AS isic_class_name
             FROM "CarbonEmissions" ce
             JOIN "activitytypes" a ON ce."ActivityId" = a.id
             JOIN "sectors" s ON ce."SectorId" = s.id
             JOIN "geographies" g ON ce."GeographyId" = g.id
             JOIN "isic_classes" i ON ce."ISICClassId" = i.id`
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(`Error fetching activities: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});
// Get Geographies by Sector ID
router.get('/geographies/:sectorId', async (req, res) => {
    const sectorId = parseInt(req.params.sectorId, 10);

    if (isNaN(sectorId)) {
        return res.status(400).json({ error: 'Invalid sector ID' });
    }

    try {
        const result = await pool.query(
            `SELECT * FROM "CarbonEmissions" WHERE "SectorId" = $1`,
            [sectorId]
        );

        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ error: 'No geographies found for the given sector ID' });
        }
    } catch (error) {
        console.error(`Error fetching geographies: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Get Carbon Emissions by Sector ID and Geography ID
router.get('/emissions', async (req, res) => {
    const sectorId = parseInt(req.query.sectorId, 10);
    const geographyId = parseInt(req.query.geographyId, 10);

    // Validate input
    if (isNaN(sectorId) || isNaN(geographyId)) {
        return res.status(400).json({ error: 'Invalid input: SectorId and GeographyId must be integers.' });
    }

    try {
        const result = await pool.query(
            `SELECT * FROM "CarbonEmissions" 
             WHERE "SectorId" = $1 AND "GeographyId" = $2`,
            [sectorId, geographyId]
        );

        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ error: 'No carbon emissions found for the given SectorId and GeographyId' });
        }
    } catch (error) {
        console.error(`Error fetching carbon emissions: ${error.stack}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.get('/emission', async (req, res) => {
    const sectorId = parseInt(req.query.sectorId, 10);
    const geographyId = parseInt(req.query.geographyId, 10);
    const ISICClassId = parseInt(req.query.ISICClassId, 10); // assuming you want to filter by activityId

    // Validate input
    if (isNaN(sectorId) || isNaN(geographyId) || isNaN(ISICClassId)) {
        return res.status(400).json({ error: 'Invalid input: SectorId, GeographyId, and ActivityId must be integers.' });
    }

    try {
        // Query to fetch carbon emissions filtered by SectorId, GeographyId, ISICClassId, and ActivityId
        const result = await pool.query(
            `SELECT * FROM "CarbonEmissions" 
             WHERE "SectorId" = $1 
             AND "GeographyId" = $2
             AND "ISICClassId" = $3`,
            [sectorId, geographyId, ISICClassId]
        );

        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ error: 'No carbon emissions found for the given filters' });
        }
    } catch (error) {
        console.error(`Error fetching carbon emissions: ${error.stack}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Get Carbon Emissions by Sector, Geography, Activity, and ISIC Class
router.get('/emissionsfinal', async (req, res) => {
    try {
        const sectorId = parseInt(req.query.sectorId, 10);
        const geographyId = parseInt(req.query.geographyId, 10);
        const activityId = parseInt(req.query.activityId, 10);
        const isicClassId = parseInt(req.query.isicClassId, 10);

        if (isNaN(sectorId) || isNaN(geographyId) || isNaN(activityId) || isNaN(isicClassId)) {
            return res.status(400).json({ error: 'Invalid input: All parameters must be integers.' });
        }

        const result = await pool.query(
            `SELECT 
                ce.carbon AS carbon_emission, 
                s.name AS sector_name, 
                g.name AS geography_name, 
                a.name AS activity_name,
                i.name AS isic_class_name
             FROM "CarbonEmissions" ce
             JOIN "sectors" s ON ce."SectorId" = s.id
             JOIN "geographies" g ON ce."GeographyId" = g.id
             JOIN "activitytypes" a ON ce."ActivityId" = a.id
             JOIN "isic_classes" i ON ce."ISICClassId" = i.id
             WHERE ce."SectorId" = $1 AND ce."GeographyId" = $2 AND ce."ActivityId" = $3 AND ce."ISICClassId" = $4`,
            [sectorId, geographyId, activityId, isicClassId]
        );

        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ error: 'No carbon emissions found for the given filters' });
        }
    } catch (error) {
        console.error(`Error fetching carbon emissions: ${error.stack}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



module.exports = router;
