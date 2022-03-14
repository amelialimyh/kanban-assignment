const express = require('express');
const authController = require('../controllers/authController')
const resetController = require('../controllers/resetController')
const router = express.Router();

router.post('/register', authController.register)
router.post('/resetpassword', resetController.reset)

module.exports = router;