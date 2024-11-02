const router = require('express').Router();
const userController = require('../controllers/userController');
const upload = require('../middleware/upload');





router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById); // New route for getting user by ID
router.put('/:id', upload.single('image'), userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;