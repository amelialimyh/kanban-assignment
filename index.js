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

// destructure DB variables
const { DB_HOST, DB_USER, DB_PASSWORD, DB_EMAIL, DB_DATABASE, DB_PORT} = process.env;

const db = mysql.createPool({
  connectionLimit: 100,
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  email: DB_EMAIL,
  database: DB_DATABASE,
  port: DB_PORT
});

db.getConnection( (error) => {
  if(error) {
    console.log(error);
  } else {
    console.log("MySQL connected...");
  }
})

// Inititalize the app and add middleware
app.set('view engine', 'pug'); // Setup the pug
app.use(bodyParser.urlencoded({extended: true})); // Setup the body parser to handle form submits
app.use(session({secret: 'super-secret'})); // Session setup
app.set('views', __dirname + '/views');

// Parse URL-encoded bodies (sent by PUG forms) <-- make sure that you can grab the data in any form
app.use(express.urlencoded({ extended: false }));

// Parse JSON bodies (as sent by API clients) <-- the values that you grab from the form comes in JSON
app.use(express.json());

// Define routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

const port = process.env.PORT
app.listen(port, 
() => console.log(`Server Started on port ${port}...`));