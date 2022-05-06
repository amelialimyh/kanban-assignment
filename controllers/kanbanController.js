const e = require('express');
const util = require('util');
const mysql = require('mysql');
require("dotenv").config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_EMAIL, DB_DATABASE, DB_PORT} = process.env;

const connection = mysql.createConnection({
   host: DB_HOST,
   user: DB_USER,
   password: DB_PASSWORD,
   email: DB_EMAIL,
   database: DB_DATABASE,
   port: DB_PORT
});

// export routes
module.exports = function(app) {
    // retrieve all data
    app.get("/usergroup", async (req, res) => {
        try {
            const results = await util.promisify(connection.query).bind(connection)(
                 `SELECT * FROM usergroup WHERE username = '${req.session.username}'`
            );
            // console.log(results);
          res.json({ results });
        } catch (e) {
          res.status(500).send({ e });
        }
      });
      
    app.get("/application/permit/:id", async (req, res) => {
        try {
            const id = req.params.id;
            // console.log("Backend id:",id)
            const results = await util.promisify(connection.query).bind(connection)(
                 `SELECT * FROM application WHERE app_acronym = '${id}'`
            );
            //console.log(results);
          res.json({ results });
        } catch (e) {
          res.status(500).send({ e });
        }
      });

    app.get("/list/apis", async (req, res) => {
        try {
            const results = await util.promisify(connection.query).bind(connection)(
                 'SELECT * FROM task'
            );
          res.json({ results });
        } catch (e) {
          res.status(500).send({ e });
        }
      });

    app.post("/post/peanut", async (req, res) => {
      try {
          const { state, task_id } = req.body;
          const results = await util.promisify(connection.query).bind(connection)(
                `UPDATE task SET state = '${state}' WHERE task_id = '${task_id}'`
          );

        res.redirect('/');
      } catch (e) {
        res.status(500).send({ e });
      }
    });


}