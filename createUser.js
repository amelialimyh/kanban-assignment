const express = require("express");
const session = require('express-session');
const mysql = require("mysql");
const bcrypt = require("bcrypt");
require("dotenv").config();
const app = express();

app.use(express.json())

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

//CREATE USER
app.post("/createUser", async (req,res) => {
    const user = req.body.name;
    const hashedPassword = await bcrypt.hash(req.body.password,10);
    db.getConnection( async (err, connection) => {
        if (err) throw (err)
        const sqlSearch = "SELECT * FROM accounts WHERE user = ?"
        const search_query = mysql.format(sqlSearch,[user])
        const sqlInsert = "INSERT INTO accounts VALUES (0,?,?)"
        const insert_query = mysql.format(sqlInsert,[user, hashedPassword, email])
        // ? will be replaced by values
        // ?? will be replaced by string
        await connection.query (search_query, async (err, result) => {
        if (err) throw (err)
        console.log("------> Search Results")
        console.log(result.length)
        if (result.length != 0) {
        connection.release()
        console.log("------> User already exists")
        res.sendStatus(409) 
    } 
    else {
        await connection.query (insert_query, (err, result)=> {
        connection.release()
        if (err) throw (err)
        console.log ("--------> Created new User")
        console.log(result.insertId)
        res.sendStatus(201)
        })
    }
    })
    })
})