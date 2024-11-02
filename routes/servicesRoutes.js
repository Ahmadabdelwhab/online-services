const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/servicesController');

router.post('/services', servicesController.createService);
router.get('/services', servicesController.getAllServices);
router.get('/services/:id', servicesController.getServiceById);
router.put('/services/:id', servicesController.updateService);
router.delete('/services/:id', servicesController.deleteService);

module.exports = router;
