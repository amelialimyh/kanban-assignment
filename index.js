const express = require("express");
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require("mysql");
const bcrypt = require("bcrypt");
require('./dbServer');
require('./createUser');
require('./authenticate');
require("dotenv").config();

const app = express();

// Inititalize the app and add middleware
app.set('view engine', 'pug'); // Setup the pug
app.use(bodyParser.urlencoded({extended: true})); // Setup the body parser to handle form submits
app.use(session({secret: 'super-secret'})); // Session setup

const DB_HOST = process.env.DB_HOST
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_EMAIL = process.env.DB_EMAIL
const DB_DATABASE = process.env.DB_DATABASE
const DB_PORT = process.env.DB_PORT

const db = mysql.createPool({
  connectionLimit: 100,
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  email: DB_EMAIL,
  database: DB_DATABASE,
  port: DB_PORT
});

/** Handle login display and form submit */
app.get('/login', (req, res) => {
  if (req.session.isLoggedIn === true) {
    return res.redirect('/');
  }
  res.render('login', {error: false});
});

app.post('/login', (req, res) => {
  const {username, password} = req.body;
  if (username === 'bob' && password === '1234') {
    req.session.isLoggedIn = true;
    res.redirect(req.query.redirect_url ? req.query.redirect_url : '/');
  } else {
    res.render('login', {error: 'Username or password is incorrect'});
  }
});

/** Handle logout function */
app.get('/logout', (req, res) => {
  req.session.isLoggedIn = false;
  res.redirect('/');
});

/** Simulated bank functionality */
app.get('/', (req, res) => {
  res.render('index', {isLoggedIn: req.session.isLoggedIn});
});

// app.get('/balance', (req, res) => {
//   if (req.session.isLoggedIn === true) {
//     res.send('Your account balance is $1234.52');
//   } else {
//     res.redirect('/login?redirect_url=/balance');
//   }
// });

// app.get('/account', (req, res) => {
//   if (req.session.isLoggedIn === true) {
//     res.send('Your account number is ACL9D42294');
//   } else {
//     res.redirect('/login?redirect_url=/account');
//   }
// });

// app.get('/contact', (req, res) => {
//   res.send('Our address : 321 Main Street, Beverly Hills.');
// });

const port = process.env.PORT
app.listen(port, 
() => console.log(`Server Started on port ${port}...`));