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

module.exports = function(app) {
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
            const { task_id, name, description, notes, task_app_acronym, state, creator, owner, createDate } = req.body;

            console.log('task_id, name, description, notes, task_app_acronym, state, creator, owner, createDate', task_id, name, description, notes, task_app_acronym, state, creator, owner, createDate);

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

            // // creator
            // var task_creator = req.session.username;
            
            // // owner
            // var task_owner = req.session.username;
            
            // // date that task was created
            // var today = new Date();
            // var date = today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate();
            
            // // audit trail
            // var audit_trail = `${req.session.username}, ${notes}, ${state}, ${createDate}`
            
            // // new rnumber 
            // var rnumber = `${results[0].rnumber+1}`;
    
            // const result = await util.promisify(connection.query).bind(connection)(
            //     'INSERT INTO task (task_id,name,description,notes,task_app_acronym,state,creator,owner,createDate) VALUES (?,?,?,?,?,?,?,?,?)', [newTaskId, name, description, notes, app_acronym, new_state, task_creator, task_owner, date]
            // );
            
            // console.log('CHICKEN BACKSIDE', result);

            res.json({ results });
        } catch (e) {
            res.status(500).send({ e });
        }
        });


    // // -------------------------- CREATE TASK POST ROUTE ---------------------------------
    // app.post('/api/task/new', (req, res) => {
    //     console.log(req.body);

    //     const { name, description, notes, task_app_acronym, app_acronym_btn, submit_btn } = req.body;

    //     console.log(app_acronym_btn, submit_btn)
    //     //First Post from button one
    //     //-------------------------------- SELECT APP ------------------------------------
    //     if (app_acronym_btn){
    //         // check if app exists
    //         db.query('SELECT * FROM application WHERE app_acronym = ?',[task_app_acronym], (error, result) => {
    //             if (error) {
    //                 console.log(error);
    //             }
        
    //             if (result.length === 0) {
    //                 console.log('result >>>', result);
    //                 res.render('newtask', {
    //                     message: 'Application does not exist!',
    //                     current_user: req.session.username,
    //                     isLoggedIn: req.session.isLoggedIn
    //                 });
    //                 return ;
    //             } else {
    //                 res.render('newtask', {
    //                     selected_task: result,
    //                     current_user: req.session.username,
    //                     isLoggedIn: req.session.isLoggedIn
    //                 });
    //             }
    //         });
    //     }

    //     res.send({ message:  'hellooooo' });

        
    //     //---------------------------------- SUBMIT ---------------------------------------

    //     if (submit_btn) {
    //         console.log("ENTERED SUBMIT CONDITION")
            
    //         db.query('SELECT * FROM application WHERE app_acronym = ?',[task_app_acronym], (error, result) => {
    //             //Error check for query 1
    //             if (error) {
    //                 console.log(error);
    //             }
    //             //Error check for query 1
    //             if (result.length === 0) {
    //                 console.log('result >>>', result);
    //                 res.render('newtask', {
    //                     message: 'Application does not exist!',
    //                     current_user: req.session.username,
    //                     isLoggedIn: req.session.isLoggedIn
    //                 });
    //                 return ;
    //             } else {
                    
    //                 if(name && description && notes) {
    //                     var app_acronym = req.body.task_app_acronym;
                
    //                     // new task id
    //                     var newTaskId = `${result[0].app_acronym}_${result[0].rnumber+1}`;

    //                     // state
    //                     var state = 'open';

                        
    //                     // creator
    //                     var task_creator = req.session.username;
                        
    //                     // owner
    //                     var task_owner = req.session.username;
                        
    //                     // date that task was created
    //                     var today = new Date();
    //                     var createDate = today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate();
                        
    //                     // audit trail
    //                     var audit_trail = `${req.session.username}, ${notes}, ${state}, ${createDate}`
                        
    //                     // new rnumber 
    //                     var rnumber = `${result[0].rnumber+1}`;
                        
    //                     db.query('INSERT INTO task (task_id,name,description,notes,task_app_acronym,state,creator,owner,createDate) VALUES (?,?,?,?,?,?,?,?,?)', [newTaskId, name, description, audit_trail, app_acronym, state, task_creator, task_owner, createDate], (error, result) => {
    //                         if (error) {
    //                             console.log('insert application error >>>', error);
    //                         } else {
    //                             db.query('UPDATE application SET rnumber = ? WHERE app_acronym = ?', [rnumber, app_acronym], (error, result) => {
                                    
    //                                 if(error) console.log(error)
    //                                 else
    //                                 {
    //                                     console.log("Successfully updated Application running number.");

    //                                     db.query('SELECT * FROM application', (error, result) => {
    //                                         res.render('newtask', {
    //                                             task_array: result,
    //                                             message: 'Task created',
    //                                             current_user: req.session.username,
    //                                             isLoggedIn: req.session.isLoggedIn
    //                                         });
    //                                     });
    //                                 }
                                    
    //                             })
    //                         }
    //                     });
    //                 }
    //                 else {
    //                     res.render('newtask', {
    //                         selected_task: result,
    //                         message: 'Empty fields.',
    //                         current_user: req.session.username,
    //                         isLoggedIn: req.session.isLoggedIn
    //                     });
    //                 }
                    
                    
    //             }
    //         });
    //     }
    // });


    // -------------------------- UPDATE TASK STATE FROM DOING TO DONE -------------------

}