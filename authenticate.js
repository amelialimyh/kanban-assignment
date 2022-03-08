const express = require("express");
const session = require('express-session');

const app = express();

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