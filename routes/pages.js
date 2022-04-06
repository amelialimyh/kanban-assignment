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

// Create app
router.get('/createapp', async (req, res) => {
  const checker = await validateUser.checkUser(req.session.username, "project manager")
  var permit_open_role = ['Project Manager']
  var permit_toDoList_role = ['Developer']
  var permit_doing_role = ['Developer']
  var permit_done_role = ['Task Lead']
  if (checker) {
    res.render('createapp', {
      permit_open_role: permit_open_role,
      permit_toDoList_role: permit_toDoList_role,
      permit_doing_role: permit_doing_role,
      permit_done_role: permit_done_role,
    });
  } else {
    alert( "You are not authorized to view this page!");
  }
});

// Create task
router.get('/createtask/:id', async (req, res) => {
  const checker = await validateUser.checkUser(req.session.username, "project lead")

  // %% represents anything before and anything after
  // for example, in mySQL '%a%' means "it contains an 'a'"
  var app_acronym = '%%';
  if(checker) {
    db.query('SELECT * FROM application WHERE app_acronym LIKE ?', [app_acronym], (error, result) => {
      if(error){
        console.log(error);
      }
      // console.dir(result);
      var app_acronym_array = [];
      for (let i = 0; i < result.length; i++){
        console.log('app_acronym >>>>', result[i].app_acronym);
        app_acronym_array.push(result[i].app_acronym);
      }
      res.render('createtask', {
        app_acronym: app_acronym_array
      })
    });
  } else {
    alert("You are not authorized to view this page!");
  }
  // const { app_acronym } = req.body;

  // db.query('SELECT * FROM application WHERE app_acronym = ?',[app_acronym], (error, result) => {
  //   if (checker) {
  //     } 
  //   } else {
  //     alert( "You are not authorized to view this page!");
  //   }
  // });
  })


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