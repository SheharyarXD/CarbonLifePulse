const fs = require('fs');
const csv = require('csv-parser');
const { Client } = require('pg');  // PostgreSQL client

// Configure PostgreSQL client
const client = new Client({
  user: 'postgres', 
  host: 'localhost',
  database: 'CarbonCalculator', 
  password: 'postgres',
  port: 5432,
});

async function createSector(name) {
  const result = await client.query('SELECT id FROM sectors WHERE name = $1', [name]);
  if (result.rows.length === 0) {
    const res = await client.query('INSERT INTO sectors (name) VALUES ($1) RETURNING id', [name]);
    return res.rows[0].id;
  }
  return result.rows[0].id;
}

async function createGeography(name) {
  const result = await client.query('SELECT id FROM geographies WHERE name = $1', [name]);
  if (result.rows.length === 0) {
    const res = await client.query('INSERT INTO geographies (name) VALUES ($1) RETURNING id', [name]);
    return res.rows[0].id;
  }
  return result.rows[0].id;
}

async function createISICClass(name) {
  const result = await client.query('SELECT id FROM isic_classes WHERE name = $1', [name]);
  if (result.rows.length === 0) {
    const res = await client.query('INSERT INTO isic_classes (name) VALUES ($1) RETURNING id', [name]);
    return res.rows[0].id;
  }
  return result.rows[0].id;
}

async function createActivityType(name) {
  const result = await client.query('SELECT id FROM activitytypes WHERE name = $1', [name]);
  if (result.rows.length === 0) {
    const res = await client.query('INSERT INTO activitytypes (name) VALUES ($1) RETURNING id', [name]);
    return res.rows[0].id;
  }
  return result.rows[0].id;
}

async function createActivity(activityName, carbon, sectorId, geographyId, isicClassId, activityTypeId) {
  await client.query(
    'INSERT INTO "CarbonEmissions"  ( carbon, "SectorId", "GeographyId", "ISICClassId", "ActivityId") VALUES ($1, $2, $3, $4, $5)',
    [carbon, sectorId, geographyId, isicClassId, activityTypeId]
  );
}

async function processCSV(filePath) {
  const results = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv({
        mapHeaders: ({ header }) => header.trim().replace(/[^a-zA-Z0-9_ ]/g, ''),
        separator: ',',
        quote: '"',
      }))
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', async () => {
        try {
          for (const row of results) {
            // Extract the required values
            const sectorId = await createSector(row.Sector);
            const geographyId = await createGeography(row.Geography);
            const isicClassId = await createISICClass(row.ISIC_Class);
            const activityTypeId = await createActivityType(row.ActivityName);
            const carbon = row.Carbon;
            const cleanValue = (value) => {
                const numericValue = value.match(/[\d.]+/g); // Extract numeric values
                return numericValue ? parseFloat(numericValue[0]) : null; // Use the first match or null
              };
              
              // Assuming you have a value to insert
              const emissionValue = cleanValue(carbon);
            // Create the Activity
            await createActivity(row.ActivityName, emissionValue, sectorId, geographyId, isicClassId, activityTypeId);
            console.log(`Activity created for ${row.ActivityName}`);
          }
          resolve(); // Resolve once all activities are created
        } catch (error) {
          console.error('Error processing CSV:', error);
          reject(error);
        }
      })
      .on('error', (error) => {
        console.error('Error reading CSV file:', error);
        reject(error);
      });
  });
}

async function main() {
  try {
    await client.connect();  // Connect to PostgreSQL database
    await processCSV('./input.csv');
    console.log('CSV processing completed successfully');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();  // Close the database connection
  }
}

main();
