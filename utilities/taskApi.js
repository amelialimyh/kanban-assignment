const e = require('express');
const util = require('util');
const mysql = require('mysql');
const fs = require("fs");
var path = require('path');
const verify = require('./authorization');
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
    // ----------------------- VERIFY USER REGARDLESS OF ROUTE ------------------------
    app.all('/api/*', verify.validate);

    
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


    // --------------------- SELECT SPECIFIC TASK VIA STATE(GET) ----------------------
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


        // --------------------- SELECT SPECIFIC TASK VIA TASK_ID ----------------------
        app.get('/api/selecttask/:state', async (req, res) => {
            try {
                const { state } = req.params
    
                const results = await util.promisify(connection.query).bind(connection)(
                    `SELECT * FROM task WHERE state = ?`,
                    [state]
                );
                console.log('ALL TASKS >>>>>>', results);
    
                res.json({ results });
            } catch (e) {
                res.status(500).send({ e });
            }
        });

    // --------------------------- CREATE TASK POST ROUTE --------------------------
    app.post("/api/task/new", async (req, res, next) => {
        try {
            const { name, description, notes, task_app_acronym, current_owner } = req.body;

            const results = await util.promisify(connection.query).bind(connection)(
                `SELECT * FROM application WHERE app_acronym = ?`, 
                [task_app_acronym]
            );

            var app_acronym = results[0].app_acronym;
            
            // new task id
            var newTaskId = `${results[0].app_acronym}_${results[0].rnumber+1}`;

            // state
            var new_state = 'open';

            // creator
            var task_creator = current_owner;
            
            // owner
            var task_owner = current_owner;
            
            // date that task was created
            var today = new Date();
            var date = today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate();
            
            // audit trail
            var audit_trail = `${current_owner}, ${notes}, ${new_state}, ${date}`
            
            // new rnumber 
            var rnumber = `${results[0].rnumber+1}`;
    
            let condition = false
            for(let r of req.roles){
                if (r.usergrp == results[0].permit_create) condition = true;
            }

            if (condition){
                const result = await util.promisify(connection.query).bind(connection)(
                    'INSERT INTO task (task_id,name,description,notes,task_app_acronym,state,creator,owner,createDate) VALUES (?,?,?,?,?,?,?,?,?)', [newTaskId, name, description, audit_trail, app_acronym, new_state, task_creator, task_owner, date]
                    
                );
                res.status(200).send('Task successfully added!');
                
            } else {
                var err = new Error('You are not authorized!');
                res.setHeader('WWW-Authenticate', 'Basic');
                err.status = 401;
                res.send(err)
            }
            
        } catch (e){
            console.log(e);
            res.status(500).send({ e });
        }
        });


    // ----------------------- UPDATE TASK STATE FROM DOING TO DONE -------------------
    app.patch("/api/update/:task_id", async (req, res) => {
        try {
            const { task_id } = req.params;
            const { state } = req.body;

            console.log(task_id, state);

            const task = await util.promisify(connection.query).bind(connection)(
                ` SELECT * FROM task WHERE task_id = ?`, [task_id]
            );

            // filter for update permission from applications table 
            const app = await util.promisify(connection.query).bind(connection)(
                `SELECT * FROM application WHERE app_acronym = ?`, 
                [task[0].task_app_acronym]
            );

            // set up condition with result from application table's query
            let condition = false
            for(let r of req.roles){
                if (r.usergrp == app[0].permit_done) condition = true;
            }
            
            // update table
            if (condition){
                const results = await util.promisify(connection.query).bind(connection)(
                    `UPDATE task SET state = ? WHERE task_id = ?`
                    , [state, task_id]
              );
                res.status(200).send('Task successfully updated!');
                
            } else {
                var err = new Error('You are not authorized!');
                res.setHeader('WWW-Authenticate', 'Basic');
                err.status = 401;
                res.send(err)
            }
  
        } catch (e) {
            console.log(e);
            res.status(500).send({ e });
        }
      });
    
}