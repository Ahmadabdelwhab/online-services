const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

exports.signup = async (req, res) => {
    const { first_name, last_name, email, password, phone_number, role,} = req.body;

    // Restrict role creation to prevent easy admin access
    if (role === 'admin') {
        return res.status(403).json({ message: 'Admin account cannot be created via signup.' });
    }
    try {
        image_url = req.file.path ? req.file.path : null;
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            `INSERT INTO users (first_name, last_name, email, password, phone_number, role, image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [first_name, last_name, email, hashedPassword, phone_number, role, image_url]
        );

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', "error": error.message  });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
        const user = rows[0];

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ message: 'Login successful', token, role: user.role });
    } catch (error) {
        res.status(500).json({ message: 'Error during login', error });
    }
};
