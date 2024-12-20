const express = require('express');
const cors = require('cors');
const pool = require('./db');
// const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');

// Import the sector and geography route files
const geographyRoutes = require('./api/Geography'); 
const sectorRoutes = require('./api/Sector'); 
const activityRoutes = require('./api/Activity_Type'); 
const isicClass = require('./api/ISIC_Class'); 
const carbon = require('./api/Activity'); 
const user = require('./api/User'); 
const mail=require('./api/Pdf') 
// const upload = multer({
//     dest: 'uploads/', 
//     limits: {
//       fileSize: 10 * 1024 * 1024, 
//     },
//     fileFilter: (req, file, cb) => {
  
//       const fileTypes = /jpeg|jpg|png|gif/;
//       const mimeType = fileTypes.test(file.mimetype);
//       if (mimeType) {
//         return cb(null, true);
//       } else {
//         cb(new Error('Only image files are allowed.'));
//       }
//     },
//   });


const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/geography', geographyRoutes);
app.use('/api/sector', sectorRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/ISIC', isicClass);
app.use('/api/Carbon', carbon);
app.use('/api/auth', user);
app.use('/api/report',mail)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/', (req, res) => {
  pool.connect((err, client, release) => {
      if (err) {

          console.error('Error connecting to the database:', err);
          return res.status(500).send('Error connecting to the database');
      }

      console.log('Connected to the database successfully!');
      res.send('API is running and connected to the database!');
      
      release(); 
  });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
