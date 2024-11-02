const router = require('express').Router();
const { signup, login } = require('../controllers/authController');
const upload = require('../middleware/upload');
router.post('/signup',upload.single("image"), signup);
router.post('/login', login);
module.exports = router;