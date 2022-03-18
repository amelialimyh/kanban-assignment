const express = require("express");
const app = express();
const mysql = require("mysql");
require("dotenv").config();

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

module.exports = db;