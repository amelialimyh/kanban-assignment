const express = require('express');
const router = express.Router();

// Homepage
router.get('/', (req, res) => {
    res.render('index');
});

// Create user account form
router.get('/register', (req, res) => {
    res.render('register');
  });

module.exports = router;