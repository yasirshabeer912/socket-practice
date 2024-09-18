const express = require('express');
const { registerUser, loginUser ,searchUsers } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/search-users', searchUsers)
module.exports = router;
