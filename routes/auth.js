const express = require('express');
const registerController = require('../controllers/registerController');
const resetController = require('../controllers/resetController');
const emailController = require('../controllers/emailController');
const router = express.Router();

// router.post('/login', authController.login);
router.post('/register', registerController.register);
router.post('/resetpassword', resetController.reset);
router.post('/updateemail', emailController.changeEmail);

module.exports = router;