const express = require('express');
const db = require('../dbServer');
const router = express.Router();
const bcrypt = require('bcryptjs');
const alert = require('alert');
const validateUser = require('../models/checkUser');
const { query } = require('express');

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
      res.render('register', {
        role_array: role_array,
        isLoggedIn: req.session.isLoggedIn
      });
    } else {
      alert("You are not authorized to view this page!");
    }
  });

  // assign user to new roles
  router.get('/assignrole', async (req, res) => {
  // need await otherwise the result wouldn't be captured/ would be empty
    const condition = await validateUser.checkUser(req.session.username, "admin")
    if (condition) {
      res.render('assignrole', {
        displayuname: 'Username',
        isLoggedIn: req.session.isLoggedIn
    });
    } else {
      alert("You are not authorized to view this page!");
    }
  });

// Update other user account details
router.get('/updateuser', async (req, res) => {
  const checker = await validateUser.checkUser(req.session.username, "admin")
  if (checker) {
    res.render('updateuser', {
      isLoggedIn: req.session.isLoggedIn
    });
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
      isLoggedIn: req.session.isLoggedIn
    });
  } else {
    alert( "You are not authorized to view this page!");
  }
});

// Edit app
router.get('/editapp', async (req, res) => {
  const checker = await validateUser.checkUser(req.session.username, "project manager")
  var app_acronym = '%%'
  var app_arr = [];
 
  if (checker) {
    db.query('SELECT * FROM application WHERE app_acronym LIKE ?', [app_acronym], (error, result) => {
      if (error) {
        console.log(error);
      }  
      for (let i = 0; i < result.length; i++){
        app_arr.push(result[i]);
      }
      res.render('editapp', {
        app_arr: result,
        isLoggedIn: req.session.isLoggedIn
      })
    })
  } else {
    alert( "You are not authorized to view this page!");
  }
});

// display all app
router.get('/applications', (req, res) => {
  
  app_array = [];

  db.query('SELECT * FROM application', (error, result) => {
    if (error) {
      console.log(error);
    } else {
      for (let i = 0; i < result.length; i++){
        app_array.push(result[i]);
      }
      res.render('applications', {
        app_array: app_array,
        isLoggedIn: req.session.isLoggedIn
      })
    }
  })
});

// Create task
router.get('/createtask', async (req, res) => {
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
        app_acronym_array.push(result[i].app_acronym);
      }
      res.render('createtask', {
        app_acronym: app_acronym_array,
        isLoggedIn: req.session.isLoggedIn
      })
    });
  } else {
    alert("You are not authorized to view this page!");
  }
})

// Update task
router.get('/updatetask', async (req, res) => {
  const checker = await validateUser.checkUser(req.session.username, "project lead")
  var task_id = '%%'
  var task_array = [];
 
  if (checker) {
    db.query('SELECT * FROM task WHERE task_id LIKE ?', [task_id], (error, result) => {
      if (error) {
        console.log(error);
      }  
      for (let i = 0; i < result.length; i++){
        task_array.push(result[i]);
      }
      res.render('updatetask', {
        task_array: result,
        isLoggedIn: req.session.isLoggedIn
      })
    })
  } else {
    alert( "You are not authorized to view this page!");
  }
});

// display all tasks
router.get('/tasklist', (req, res) => {
  
  task_array = [];

  db.query('SELECT * FROM task', (error, result) => {
    if (error) {
      console.log(error);
    } else {
      for (let i = 0; i < result.length; i++){
        task_array.push(result[i]);
      }
      res.render('tasklist', {
        task_array: task_array,
        isLoggedIn: req.session.isLoggedIn
      })
    }
  })
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