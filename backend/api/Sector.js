const { IncomingMessage, ServerResponse } = require('http');
const pool = require('../db'); // DB connection pool

module.exports = async (req = IncomingMessage, res = ServerResponse) => {
    const { method } = req;
    
    // Handling different methods for sector API routes
    if (method === 'GET') {
        if (req.url.includes('/sector/')) {
            const id = req.url.split('/')[2];
            const sector = await GetSectorById(id);
            if (sector) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(sector));
            } else {
                res.statusCode = 404;
                res.end(JSON.stringify({ error: 'Sector not found' }));
            }
        } else if (req.url === '/sectors') {
            const sectors = await ReadSectors();
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(sectors));
        }
    } else if (method === 'POST' && req.url === '/sector') {
        // Add functionality for creating sector
        const { name, image } = req.body;
        const sector = await CreateSector(name, image);
        if (sector) {
            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(sector));
        } else {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Failed to create sector' }));
        }
    } else if (method === 'PUT' && req.url.includes('/sector/')) {
        // Update functionality for sector
        const id = req.url.split('/')[2];
        const { name, image } = req.body;
        const updatedSector = await UpdateSector(id, name, image);
        if (updatedSector) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(updatedSector));
        } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'Sector not found or update failed' }));
        }
    } else if (method === 'DELETE' && req.url.includes('/sector/')) {
        // Delete functionality for sector
        const id = req.url.split('/')[2];
        const deletedSector = await DeleteSector(id);
        if (deletedSector) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Sector deleted successfully' }));
        } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'Sector not found' }));
        }
    } else {
        res.statusCode = 405; // Method Not Allowed
        res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    }
};

async function CreateSector(Name, Image) {
    try {
        const query = `INSERT INTO sectors (name, image) VALUES ($1, $2) RETURNING *;`;
        const values = [Name, Image];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error creating sector:', error);
        return null;
    }
}

// Add other CRUD functions (ReadSectors, GetSectorById, UpdateSector, DeleteSector) below as shown in your original code.
