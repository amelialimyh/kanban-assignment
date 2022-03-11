const express = require('express');
const db = require('../dbServer');
const router = express.Router();

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

  // check if user exists and if the username and password are correct
  db.query (
    "SELECT * FROM accounts WHERE name = ? AND password = ?",
    [username, password],
    (err, result) => {
      // if result exists, allow user to login
      if (result.length > 0 ) {
        res.render('index', {isLoggedIn: req.session.isLoggedIn});
      }
      // return the error message to user
      else {
        res.render('login', {
          message: 'Username or password is incorrect'});
      } 
    }
  )
});

// Reset password
router.get('/resetpassword', (req, res) => {
  res.render('resetpassword');
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