const express = require('express');
const router = express.Router();
const reservationsController = require('../controllers/reservationController');
const hasRole = require('../middleware/hasRole');

// Create a new reservation
router.post('/reservations', reservationsController.createReservation);

// Get all reservations
router.get('/reservations', reservationsController.getAllReservations);

// Get a reservation by ID
router.get('/reservations/:id', reservationsController.getReservationById);

// Update a reservation
router.put('/reservations/:id', reservationsController.updateReservation);

// Delete a reservation
router.delete('/reservations/:id',hasRole("crafstman"), reservationsController.deleteReservation);

module.exports = router;
