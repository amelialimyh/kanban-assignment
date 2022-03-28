const express = require('express');
const registerController = require('../controllers/registerController');
const updateController = require('../controllers/updateController');
const router = express.Router();

// router.post('/login', authController.login);
router.post('/register', registerController.register);
router.post('/update', updateController.update);
//router.post('/update', callback1, callback2, ...);
//or
//router.post('/update', [callback1, callback2, ...]);

module.exports = router;