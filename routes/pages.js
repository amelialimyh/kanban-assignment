const express = require('express');
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

router.post('/login', (req, res) => {
  const {username, password} = req.body;
  if (username && password) {
    // var sql = "SELECT * FROM accounts WHERE username = ?";
    // db.query(sql, [username], function(error, results, fields) {
    //   if (error) throw error;
    //   if(results.length > 0 ) {
    //     var validPwd = bcrypt.compareSync(password, results[0].password);
    //     console.log(validPwd);   
    //   }
    // })
    req.session.isLoggedIn = true;
    res.redirect(req.query.redirect_url ? req.query.redirect_url : '/');
  } else {
    res.render('login', {error: 'Username or password is incorrect'});
  }
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