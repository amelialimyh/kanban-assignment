const express = require('express');
const db = require('../dbServer');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mysql = require('mysql');
const checkUser = require('../models/checkUser');

// Homepage
// Simulated bank functionality
router.get('/', (req, res) => {
  res.render('index', {isLoggedIn: req.session.isLoggedIn});
});

// Create user account form
// create a callback function to handle the register route to verify if user is an admin
//the "next" parameter lets the router call the next callback in the callback chain
const verifyUser = (req, res, next) => {
  checkUser("crazytrollgirl", "admin");
  next();
}; 

router.get('/register', [verifyUser, (req, res) => {
    res.render('register');
  }]);

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
router.get('/update/:id', (req, res) => {
  res.render('update');
});

/** Handle logout function */
router.get('/logout', (req, res) => {
  req.session.isLoggedIn = false;
  res.redirect('/');
});

module.exports = router;