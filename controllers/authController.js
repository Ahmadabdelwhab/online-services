const jwt  = require('jsonwebtoken');
const pool = require('../db');

exports.login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
        if (user.rows.length === 0) {
        return res.status(401).json({ message: 'Invalid email or password' });
        }
    
        const isValidPassword = password === user.rows[0].password;
    
        if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid email or password' });
        }
    
        const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, {
        expiresIn: '1h'
        });
    
        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
    }