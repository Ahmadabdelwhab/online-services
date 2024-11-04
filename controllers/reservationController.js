
const pool = require('../config/db'); // Assuming you have a db.js file exporting the MySQL connection
// Create a new reservation
exports.createReservation = async (req, res) => {
    try {
        const { user_id, service_id, status = 'pending', appointment_date } = req.body;
        const [result] = await pool.query(
            `INSERT INTO reservations (user_id, service_id, status, appointment_date) VALUES (?, ?, ?, ?)`,
            [user_id, service_id, status, appointment_date]
        );
        res.status(201).json({ message: 'Reservation created successfully', reservationId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating reservation', error });
    }
};

// Get all reservations with optional filters
exports.getAllReservations = async (req, res) => {
    try {
        const { page = 1, limit = 10, user_id, status } = req.query;
        const offset = (page - 1) * limit;
        let query = `SELECT * FROM reservations`;
        const queryParams = [];

        if (user_id || status) {
            query += ' WHERE';
            if (user_id) {
                query += ` user_id = ?`;
                queryParams.push(user_id);
            }
            if (status) {
                query += user_id ? ' AND' : '';
                query += ` status = ?`;
                queryParams.push(status);
            }
        }

        query += ` LIMIT ? OFFSET ?`;
        queryParams.push(parseInt(limit), parseInt(offset));

        const [reservations] = await pool.query(query, queryParams);
        res.json(reservations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching reservations', error });
    }
};

// Get a single reservation by ID
exports.getReservationById = async (req, res) => {
    try {
        const { id } = req.params;
        const [reservation] = await pool.query(`SELECT * FROM reservations WHERE id = ?`, [id]);
        if (reservation.length === 0) {
            return res.status(404).json({ message: 'Reservation not found' });
        }
        res.json(reservation[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching reservation', error });
    }
};

// Update a reservation
exports.updateReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id, service_id, status, appointment_date } = req.body;

        const [result] = await pool.query(
            `UPDATE reservations SET user_id = ?, service_id = ?, status = ?, appointment_date = ? WHERE id = ?`,
            [user_id, service_id, status, appointment_date, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        res.json({ message: 'Reservation updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating reservation', error });
    }
};

// Delete a reservation
exports.deleteReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query(`DELETE FROM reservations WHERE id = ?`, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        res.json({ message: 'Reservation deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting reservation', error });
    }
};
