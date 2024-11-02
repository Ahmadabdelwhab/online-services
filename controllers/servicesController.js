const pool = require('../config/db'); // Adjust path based on your project structure

// Create a new service
exports.createService = async (req, res) => {
    try {
        const { craftsman_id, service_name, service_description, price } = req.body;

        const [result] = await pool.query(
            `INSERT INTO services (craftsman_id, service_name, service_description, price) 
            VALUES (?, ?, ?, ?)`,
            [craftsman_id, service_name, service_description, price]
        );

        res.status(201).json({ message: "Service created successfully", serviceId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating service", error });
    }
};

// Get all services with optional pagination and filtering by craftsman
exports.getAllServices = async (req, res) => {
    try {
        const { page = 1, limit = 10, craftsman_id } = req.query;
        const offset = (page - 1) * limit;

        let query = `SELECT * FROM services`;
        const queryParams = [];

        if (craftsman_id) {
            query += ` WHERE craftsman_id = ?`;
            queryParams.push(craftsman_id);
        }

        query += ` LIMIT ? OFFSET ?`;
        queryParams.push(parseInt(limit), parseInt(offset));

        const [services] = await pool.query(query, queryParams);
        res.json(services);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching services", error });
    }
};

// Get a service by ID
exports.getServiceById = async (req, res) => {
    try {
        const { id } = req.params;

        const [service] = await pool.query(`SELECT * FROM services WHERE id = ?`, [id]);

        if (service.length === 0) {
            return res.status(404).json({ message: "Service not found" });
        }

        res.json(service[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching service", error });
    }
};

// Update a service by ID
exports.updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { craftsman_id, service_name, service_description, price } = req.body;

        const [result] = await pool.query(
            `UPDATE services SET craftsman_id = ?, service_name = ?, service_description = ?, price = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?`,
            [craftsman_id, service_name, service_description, price, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Service not found" });
        }

        res.json({ message: "Service updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating service", error });
    }
};

// Delete a service by ID
exports.deleteService = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query(`DELETE FROM services WHERE id = ?`, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Service not found" });
        }

        res.json({ message: "Service deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting service", error });
    }
};
