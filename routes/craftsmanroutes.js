const router = require('express').Router();
const craftsmanController = require('../controllers/craftsmanController');
const upload = require('../middleware/upload');
router.post('/', upload.single('image'), craftsmanController.createCraftsman);
router.get('/', craftsmanController.getAllCraftsmen);
router.get('/:id', craftsmanController.getCraftsmanById); // New route for getting user by ID
router.put('/:id', upload.single('image'), craftsmanController.updateCraftsman);
router.delete('/:id', craftsmanController.deleteCraftsman);
module.exports = router;