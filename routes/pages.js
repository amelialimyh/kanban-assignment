const express = require('express');
const db = require('../dbServer');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mysql = require('mysql');

// Homepage
// Simulated bank functionality
router.get('/', (req, res) => {
  res.render('index', {isLoggedIn: req.session.isLoggedIn});
});

// Create user account form
router.get('/register', (req, res) => {
    res.render('register');
  });

/** Handle login display and form submit */
router.get('/login', (req, res) => {
  if (req.session.isLoggedIn === true) {
    return res.redirect('/');
  }
  res.render('login', {error: false});
});

// validate user login
router.post('/login', (req, res) => {
  console.log(req.body);

  // capture the username and password that the user input in form
  const {username, password} = req.body;

  var sql = "SELECT * FROM accounts WHERE name = ?;";
  db.query (sql,[username], (err, result) => {
    if(err) throw err;
    
    if (bcrypt.compareSync(password, result[0].password)){
      req.session.isLoggedIn = true;
      res.redirect('/');
    } 
    else {
      res.render('Login', {
        message: 'Incorrect username or password'
      });
    }
  })
});

// Reset password
router.get('/resetpassword', (req, res) => {
  res.render('resetpassword');
});

// Change email
router.get('/updateemail', (req, res) => {
  res.render('updateemail');
});

/** Handle logout function */
router.get('/logout', (req, res) => {
  req.session.isLoggedIn = false;
  res.redirect('/');
});

router.get('/balance', (req, res) => {
  if (req.session.isLoggedIn === true) {
    res.send('Your account balance is $1234.52');
  } else {
    res.redirect('/login?redirect_url=/balance');
  }
});

router.get('/account', (req, res) => {
  if (req.session.isLoggedIn === true) {
    res.send('Your account number is ACL9D42294');
  } else {
    res.redirect('/login?redirect_url=/account');
  }
});

router.get('/contact', (req, res) => {
  res.send('Our address : 321 Main Street, Beverly Hills.');
});

module.exports = router;