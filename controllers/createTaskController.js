// const db = require('../dbServer');

// exports.createtask = (req, res, fields) => {
//     console.log(req.body);

//     const { name, description, notes, task_app_acronym, app_acronym_btn, submit_btn } = req.body;

//     console.log(app_acronym_btn, submit_btn)
//     //First Post from button one
//     //----------------------------------------------------------------------------------
//     if (app_acronym_btn){
//         // check if app exists
//         db.query('SELECT * FROM application WHERE app_acronym = ?',[task_app_acronym], (error, result) => {
//             if (error) {
//                 console.log(error);
//             }
    
//             if (result.length === 0) {
//                 console.log('result >>>', result);
//                 res.render('createtask', {
//                     message: 'Application does not exist!',
//                     current_user: req.session.username,
//                     isLoggedIn: req.session.isLoggedIn
//                 });
//                 return ;
//             } else {
//                 res.render('createtask', {
//                     selected_task: result,
//                     current_user: req.session.username,
//                     isLoggedIn: req.session.isLoggedIn
//                 });
//             }
//         });
//     }
//     //----------------------------------------------------------------------------------

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
//                 res.render('createtask', {
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
//                                         res.render('createtask', {
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
//                     res.render('createtask', {
//                         selected_task: result,
//                         message: 'Empty fields.',
//                         current_user: req.session.username,
//                         isLoggedIn: req.session.isLoggedIn
//                     });
//                 }
                
                
//             }
//         });
        
//     }
// }