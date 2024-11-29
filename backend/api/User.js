const express = require('express');
const pool = require('../db'); 

const router = express.Router();
const bcrypt = require('bcrypt');


// Signup API
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into the database
        const result = await pool.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
            [email, hashedPassword]
        );

        res.status(201).json({
            message: 'User created successfully!',
            user: result.rows[0],
        });
    } catch (error) {
        if (error.code === '23505') {
            res.status(400).json({ error: 'Email already exists' });
        } else {
            console.error('Error creating user:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

// Signin API
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if the user exists
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = result.rows[0];

        // Compare hashed passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        res.status(200).json({ message: 'Signin successful!', user: { id: user.id, email: user.email } });
    } catch (error) {
        console.error('Error signing in user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Fetch user by email
router.get('/fetch-by-email/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const result = await pool.query('SELECT id, email FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ user: result.rows[0] });
    } catch (error) {
        console.error('Error fetching user by email:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Reset password
router.put('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        return res.status(400).json({ error: 'Email and new password are required' });
    }

    try {

        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }


        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await pool.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPassword, email]);

        res.status(200).json({ message: 'Password reset successfully!' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



module.exports = router;