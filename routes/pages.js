const express = require('express');
const sql = require('mysql');
const db = require('../dbServer');
const router = express.Router();
const bcrypt = require('bcryptjs');
const alert = require('alert');
const validateUser = require('../models/checkUser');

// Homepage
// Simulated bank functionality
router.get('/', (req, res) => {
  res.render('index', {isLoggedIn: req.session.isLoggedIn});
});

//create middleware to load checkUser function and the "next" parameter lets the router call the next callback in the callback chain
const verifyUser = (req, res, next) => {
  let doThisAfterCheckUser = (objResult) => {
    if (objResult.checkUserResult){
      console.log("checkUserResult true");
    }
  }
  validateUser.checkUser(req.body.username, 'admin', doThisAfterCheckUser);
  next();
}; 

// Create user account form
router.get('/register', async (req, res) => {
  // need await otherwise the result wouldn't be captured/ would be empty
    const condition = await validateUser.checkUser(req.session.username, "admin")
    const role_array = ['developer', 'project lead', 'project manager', 'admin'];
  
    if (condition) {
      res.render('register', {role_array: role_array});
    } else {
      alert("You are not authorized to view this page!");
    }
  });

  // assign user to new roles
  router.get('/assignrole', async (req, res) => {
  // need await otherwise the result wouldn't be captured/ would be empty
    const condition = await validateUser.checkUser(req.session.username, "admin")
    if (condition) {
      res.render('assignrole', {displayuname: 'Username'});
    } else {
      alert("You are not authorized to view this page!");
    }
  });

// Update other user account details
router.get('/update', async (req, res) => {
  const checker = await validateUser.checkUser(req.session.username, "admin")
  if (checker) {
    res.render('update');
  } else {
    alert( "You are not authorized to view this page!");
  }
});

// Create task
router.get('/createtask', async (req, res) => {
  const checker = await validateUser.checkUser(req.session.username, "project lead")
  if (checker) {
    res.render('createtask');
  } else {
    alert( "You are not authorized to view this page!");
  }
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
  // capture the username and password that the user input in form
  const {username, password} = req.body;

  var sql = "SELECT * FROM accounts WHERE username = ?;";
  db.query(sql,[username], (err, result) => {
    if(err) throw err;

    if (result.length === 0) {
      res.render('login', {
        message: 'Invalid username or password'
      });
      return ;
    }

    if (bcrypt.compareSync(password, result[0].password)){
      req.session.isLoggedIn = true;
      req.session.username = username;
      
        // nested if to check user status
        if (result[0].status === 'inactive') {
          res.render('login', {
            message: 'Invalid username or password'
          });
        }
        else {
          res.redirect('/');
        }
    } 
    else {
      res.render('login', {
        message: 'Incorrect username or password'
      });
    }
  })
});

/** Handle logout function */
router.get('/logout', (req, res) => {
  req.session.isLoggedIn = false;
  res.redirect('/');
});

module.exports = router;