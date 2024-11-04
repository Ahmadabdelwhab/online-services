const fs = require('fs');
const path = require('path');
const pool = require('../config/db');
exports.getUsers = async (req, res) => {
    const { page = 1, limit = 10, search = '' } = req.query;

    try {
        // Calculate offset for pagination
        const offset = (page - 1) * limit;

        // Build query for filtering
        const [users] = await pool.query(
            `SELECT id ,first_name , last_name , email , role , phone_number , image_url FROM users 
            WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ? 
            LIMIT ? OFFSET ?`,
            [`%${search}%`, `%${search}%`, `%${search}%`, parseInt(limit), offset] 
        );

        // Get total count for pagination
        const [countResult] = await pool.query(
            `SELECT COUNT(*) AS total FROM users 
            WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ?`,
            [`%${search}%`, `%${search}%`, `%${search}%`]
        );
        const total = countResult[0].total;

        res.json({
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalUsers: total,
            users,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const [user] = await pool.query('SELECT id ,first_name , last_name , email , role , phone_number , image_url FROM users WHERE id = ?', [id]);
        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching user', error });
    }
};

// Update a user
exports.updateUser = async (req, res) => {
    const { id } = req.params || req.user.id;
    const { first_name, last_name, email, phone_number, role} = req.body;

    try {
        const [existingUser] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        if (existingUser.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const imageUrl = req.file ? `${req.file.path}` : existingUser[0].image_url;

        await pool.query(
            `UPDATE users SET first_name = ?, last_name = ?, email = ?, phone_number = ?, role = ?, image_url = ?
            WHERE id = ?`,
            [first_name, last_name, email, phone_number, role, imageUrl, id]
        );

        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating user', error });
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    const { id } = req.params || req.user.id;

    try {
        const [existingUser] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        if (existingUser.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete the user's image file if exists
        if (existingUser[0].image_url) {
            fs.unlink(path.join(__dirname, `path_to_your_uploaded_image/${existingUser[0].image_url.split('/').pop()}`), (err) => {
                if (err) console.error('Failed to delete image:', err);
            });
        }

        await pool.query('DELETE FROM users WHERE id = ?', [id]);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting user', error });
    }
};
// User routes
