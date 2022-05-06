const e = require('express');
const util = require('util');
const mysql = require('mysql');
const fs = require("fs");
var path = require('path');
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

module.exports = function(app) {
    // ---------------------------- GET USER'S ROLE ----------------------------------
    app.get("/user", async (req, res, next) => {
        try {

            var authheader = req.headers.authorization; 
            console.log('authheader', authheader);

            console.log('HEADERSSSS >>>>', req.headers);

            if (!authheader) {
                var err = new Error('You are not authenticated!');
                res.setHeader('WWW-Authenticate', 'Basic');
                err.status = 401;
                return next(err);
            } else {
                // split authheader to grab the hash and convert it to string via ascii
                var text = Buffer.from((authheader.split(' '))[1], 'base64').toString('ascii');
                
                // split the joint decoded username and password
                var [username, password] = text.split(':');
                
                const results = await util.promisify(connection.query).bind(connection)(
                    `SELECT * FROM usergroup WHERE username = ?`, [username]
                );
                res.json({ results });
                res.end();
            }
        } catch (e) {
            res.status(500).send({ e });
        }
    });

    
    // ---------------------------- DISPLAY ALL TASK (JSON) ---------------------------
    app.get('/api/task', async (req, res) => {
        try {
            const results = await util.promisify(connection.query).bind(connection)(
                `SELECT * FROM task`
            );
            console.log('ALL TASKS >>>>>>', results);

            res.json({ results });
        } catch (e) {
            res.status(500).send({ e });
        }
    });


    // ------------------------- SELECT SPECIFIC TASK (GET) ---------------------------
    app.get('/api/selecttask/:id', async (req, res) => {
        try {
            const { id } = req.params

            const results = await util.promisify(connection.query).bind(connection)(
                `SELECT * FROM task WHERE task_id = ?`,
                [id]
            );
            console.log('ALL TASKS >>>>>>', results);

            res.json({ results });
        } catch (e) {
            res.status(500).send({ e });
        }
    });


    // ------------------------- SELECT SPECIFIC TASK (POST) --------------------------
    app.post('/api/selecttask', async (req, res) => {
        try {
            const { task_id } = req.body

            const results = await util.promisify(connection.query).bind(connection)(
                `SELECT * FROM task WHERE task_id = ?`,
                [task_id]
            );
            console.log('ALL TASKS >>>>>>', results);

            res.json({ results });
        } catch (e) {
            res.status(500).send({ e });
        }
    });


    // --------------------------- CREATE TASK POST ROUTE --------------------------
    app.post("/api/task/new", async (req, res) => {
        try {
            const { task_id, name, description, notes, task_app_acronym, state, current_owner, createDate } = req.body;

            console.log('task_id, name, description, notes, task_app_acronym, state, creator, owner, createDate', task_id, name, description, notes, task_app_acronym, state, current_owner, createDate);

            const results = await util.promisify(connection.query).bind(connection)(
                `SELECT * FROM application WHERE app_acronym = ?`, 
                [task_app_acronym]
            );

            var app_acronym = results[0].app_acronym;

            console.log('psstttt', app_acronym);
            
            // new task id
            var newTaskId = `${results[0].app_acronym}_${results[0].rnumber+1}`;
            console.log('newwwwtaskId', newTaskId);

            // state
            var new_state = 'open';
            console.log(new_state);

            // creator
            var task_creator = current_owner;
            console.log('current_owner', current_owner);
            
            // owner
            var task_owner = current_owner;
            console.log('current_owner', current_owner);
            
            // date that task was created
            var today = new Date();
            var date = today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate();
            console.log(date);
            
            // audit trail
            var audit_trail = `${current_owner}, ${notes}, ${new_state}, ${date}`
            console.log('audit trail', audit_trail);
            
            // new rnumber 
            var rnumber = `${results[0].rnumber+1}`;
            console.log('rnumber >>>>', rnumber);
    
            const result = await util.promisify(connection.query).bind(connection)(
                'INSERT INTO task (task_id,name,description,notes,task_app_acronym,state,creator,owner,createDate) VALUES (?,?,?,?,?,?,?,?,?)', [newTaskId, name, description, audit_trail, app_acronym, new_state, task_creator, task_owner, date]
            );
            
            res.json({ result });
        } catch (e) {
            res.status(500).send({ e });
        }
        });


    // -------------------------- UPDATE TASK STATE FROM DOING TO DONE -------------------

    
}