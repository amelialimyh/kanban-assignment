const db = require('../dbServer');
const alert = require('alert');
const validateUser = require('../models/checkUser');

module.exports = function(app) {

    // --------------------------- DISPLAY ALL TASK ROUTE ---------------------------------
    app.get('/api/task', (req, res) => {
    
        task_array = [];
    
        db.query('SELECT * FROM task', (error, result) => {
        if (error) {
            console.log(error);
        } else {
            for (let i = 0; i < result.length; i++){
            task_array.push(result[i]);
            }
            res.render('tasklist', {
            task_array: task_array,
            current_user: req.session.username,
            isLoggedIn: req.session.isLoggedIn
            })
        }
        })
    });


    // --------------------------- CREATE TASK GET ROUTE --------------------------------  
    app.get('/api/task/new', (req, res) => {
    
    // %% represents anything before and anything after
    // for example, in mySQL '%a%' means "it contains an 'a'"
        var app_acronym = '%%';
        db.query('SELECT * FROM application WHERE app_acronym LIKE ?', [app_acronym], async (error, result) => {
            if (error){
                console.log(error);
            } else {
                const checker = await validateUser.checkUser(req.session.username, result[0].permit_create);
                if (checker){
                var task_array = [];
                for (let i = 0; i < result.length; i++){
                task_array.push(result[i]);
                } 
                //console.log('task array >>>>', task_array);
                res.render('newtask', {
                    task_array: result,
                    current_user: req.session.username,
                    isLoggedIn: req.session.isLoggedIn
                });
                } else {
                    alert("You are not authorized to view this page!");
                }
            }
        });
    });


    // -------------------------- CREATE TASK POST ROUTE ---------------------------------
    app.post('/api/task/new', (req, res) => {
        console.log(req.body);

        const { name, description, notes, task_app_acronym, app_acronym_btn, submit_btn } = req.body;

        console.log(app_acronym_btn, submit_btn)
        //First Post from button one
        //-------------------------------- SELECT APP ------------------------------------
        if (app_acronym_btn){
            // check if app exists
            db.query('SELECT * FROM application WHERE app_acronym = ?',[task_app_acronym], (error, result) => {
                if (error) {
                    console.log(error);
                }
        
                if (result.length === 0) {
                    console.log('result >>>', result);
                    res.render('newtask', {
                        message: 'Application does not exist!',
                        current_user: req.session.username,
                        isLoggedIn: req.session.isLoggedIn
                    });
                    return ;
                } else {
                    res.render('newtask', {
                        selected_task: result,
                        current_user: req.session.username,
                        isLoggedIn: req.session.isLoggedIn
                    });
                }
            });
        }

        res.send({ message:  'hellooooo' });

        
        //---------------------------------- SUBMIT ---------------------------------------

        if (submit_btn) {
            console.log("ENTERED SUBMIT CONDITION")
            
            db.query('SELECT * FROM application WHERE app_acronym = ?',[task_app_acronym], (error, result) => {
                //Error check for query 1
                if (error) {
                    console.log(error);
                }
                //Error check for query 1
                if (result.length === 0) {
                    console.log('result >>>', result);
                    res.render('newtask', {
                        message: 'Application does not exist!',
                        current_user: req.session.username,
                        isLoggedIn: req.session.isLoggedIn
                    });
                    return ;
                } else {
                    
                    if(name && description && notes) {
                        var app_acronym = req.body.task_app_acronym;
                
                        // new task id
                        var newTaskId = `${result[0].app_acronym}_${result[0].rnumber+1}`;

                        // state
                        var state = 'open';

                        
                        // creator
                        var task_creator = req.session.username;
                        
                        // owner
                        var task_owner = req.session.username;
                        
                        // date that task was created
                        var today = new Date();
                        var createDate = today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate();
                        
                        // audit trail
                        var audit_trail = `${req.session.username}, ${notes}, ${state}, ${createDate}`
                        
                        // new rnumber 
                        var rnumber = `${result[0].rnumber+1}`;
                        
                        db.query('INSERT INTO task (task_id,name,description,notes,task_app_acronym,state,creator,owner,createDate) VALUES (?,?,?,?,?,?,?,?,?)', [newTaskId, name, description, audit_trail, app_acronym, state, task_creator, task_owner, createDate], (error, result) => {
                            if (error) {
                                console.log('insert application error >>>', error);
                            } else {
                                db.query('UPDATE application SET rnumber = ? WHERE app_acronym = ?', [rnumber, app_acronym], (error, result) => {
                                    
                                    if(error) console.log(error)
                                    else
                                    {
                                        console.log("Successfully updated Application running number.");

                                        db.query('SELECT * FROM application', (error, result) => {
                                            res.render('newtask', {
                                                task_array: result,
                                                message: 'Task created',
                                                current_user: req.session.username,
                                                isLoggedIn: req.session.isLoggedIn
                                            });
                                        });
                                    }
                                    
                                })
                            }
                        });
                    }
                    else {
                        res.render('newtask', {
                            selected_task: result,
                            message: 'Empty fields.',
                            current_user: req.session.username,
                            isLoggedIn: req.session.isLoggedIn
                        });
                    }
                    
                    
                }
            });
        }
    });


    // -------------------------- UPDATE TASK STATE FROM DOING TO DONE -------------------

}