const express = require("express");
const session = require('express-session');
const mysql = require("mysql");
const bcrypt = require("bcrypt");
require("dotenv").config();
const app = express();

app.use(express.json())

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


//LOGIN (AUTHENTICATE USER)
app.post("/login", (req, res)=> {
    const user = req.body.name
    const password = req.body.password
    db.getConnection ( async (err, connection) => {
      if (err) throw (err)
      const sqlSearch = "Select * from userTable where user = ?"
      const search_query = mysql.format(sqlSearch,[user])
      await connection.query (search_query, async (err, result) => {
      connection.release()
      
      if (err) throw (err)
      if (result.length == 0) {
        console.log("--------> User does not exist")
        res.sendStatus(404)
      } 
      else {
         const hashedPassword = result[0].password
         //get the hashedPassword from result
        if (await bcrypt.compare(password, hashedPassword)) {
          console.log("---------> Login Successful")
          res.send(`${user} is logged in!`)
        } 
        else {
          console.log("---------> Password Incorrect")
          res.send("Password incorrect!")
        }
      }
     })
    })
  })