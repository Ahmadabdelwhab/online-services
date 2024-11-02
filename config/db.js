const mysql = require('mysql2/promise');
require('dotenv').config();
// Create the connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,        // Replace with your database host
    user: process.env.DB_USER,             // Replace with your database username
    port: process.env.DB_PORT,               // Replace with your database port
    database: process.env.DB_NAME,   // Replace with your database name
    waitForConnections: true,
    connectionLimit: 10,      // Limit the number of simultaneous connections
    queueLimit: 0
});

// Check if the connection to the database is successful
pool.getConnection()
        .then(connection => {
                console.log('Connected to the database.');
                connection.release();
        })
        .catch(err => {
                console.error('Unable to connect to the database:', err);
        });
// Export the pool to use in other parts of the application
module.exports = pool;

