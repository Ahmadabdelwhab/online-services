
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const { get, post, put } = require('../routes/authroutes');

exports.createCraftsman = async (req, res) => {
    try {
        const { first_name, last_name, phone_number, email, password, craftsman_type, description, role} = req.body;
        image_url = req.file ? req.file.path : null;
        const [user] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
        if (user.length) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const [createdUser] = await pool.query(`INSERT INTO users (first_name, last_name, phone_number, email, password, role, image_url) 
                                               VALUES (?, ?, ?, ?, ?, ?, ?)`, [first_name, last_name, phone_number, email, hashedPassword, role, image_url]);
        await pool.query(`INSERT INTO craftsmen (user_id, craftsman_type, description) VALUES (?, ?, ?)`,
            [createdUser.insertId, craftsman_type, description]);
        res.json({ message: "Craftsman created successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating craftsman", error });
    }
};


exports.getAllCraftsmen = async (req, res) => {
    try {
        const { page = 1, limit = 10, type, search } = req.query;
        const offset = (page - 1) * limit;
        let query = `SELECT u.id ,u.first_name, u.last_name, u.phone_number, u.email,u.image_url, c.craftsman_type, c.description 
                     FROM users u 
                     JOIN craftsmen c ON u.id = c.user_id`;
        let queryParams = [];

        if (type) {
            query += ` WHERE c.craftsman_type = ?`;
            queryParams.push(type);
        }

        if (search) {
            query += type ? ` AND` : ` WHERE`;
            query += ` (u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ?)`;
            queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        query += ` LIMIT ? OFFSET ?`;
        queryParams.push(parseInt(limit), parseInt(offset));

        const [craftsmen] = await pool.query(query, queryParams);
        res.json(craftsmen);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching craftsmen", error });
    }
};
exports.getCraftsmanById = async (req, res) => {
    try {
        const { id } = req.params;
        const [craftsman] = await pool.query(`SELECT u.first_name, u.last_name, u.phone_number, u.email,u.image_url, c.craftsman_type, c.description 
                                             FROM users u 
                                             JOIN craftsmen c ON u.id = c.user_id 
                                             WHERE u.id = ?`, [id]);
        res.json(craftsman);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching craftsman", error });
    }
}
exports.updateCraftsman = async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, phone_number, email, craftsman_type, description } = req.body;

        const [user] = await pool.query(`SELECT * FROM users WHERE id = ?`, [id]);
        if (!user.length) {
            return res.status(404).json({ message: "User not found" });
        }

        await pool.query(`UPDATE users SET first_name = ?, last_name = ?, phone_number = ?, email = ? WHERE id = ?`,
            [first_name, last_name, phone_number, email, id]);

        await pool.query(`UPDATE craftsmen SET craftsman_type = ?, description = ? WHERE user_id = ?`,
            [craftsman_type, description, id]);

        res.json({ message: "Craftsman updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating craftsman", error });
    }
}
exports.deleteCraftsman = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query(`DELETE FROM craftsmen WHERE user_id = ?`, [id]);
        await pool.query(`DELETE FROM users WHERE id = ?`, [id]);
        res.json({ message: "Craftsman deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting craftsman", error });
    }
}









