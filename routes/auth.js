const express = require('express');
const authController = require('../controllers/authController');
const resetController = require('../controllers/resetController');
const emailController = require('../controllers/emailController');
const router = express.Router();

router.post('/register', authController.register);
router.post('/resetpassword', resetController.reset);
router.post('/updateemail', emailController.changeEmail);

module.exports = router;