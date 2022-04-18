const db = require('../dbServer');
const userController = require('../models/checkUser');

exports.updatetask = async (req, res) => {
    const { task_id, task_id_btn, delete_task_btn, description, confirm_btn, state, new_note } = req.body;  

    var state_array = ['open', 'to-do', 'doing', 'done', 'close'];

    // VERIFY EXISTING APP 
    if (task_id_btn){
        db.query('SELECT * FROM task WHERE task_id = ?', [task_id], async (error, result, fields) => {
            if(error) {
                console.log('existing app error >>>>>', error);
            } else {
                db.query('SELECT * FROM application WHERE app_acronym = ?', [result[0].task_app_acronym], async (error, rows) => {
                    if (error) {
                        console.log(error);
                    }
                    
                    if (result[0].state === 'open' && await userController.checkUser(req.session.username, rows[0].permit_open)) {
                        state_array = ['to-do'];
                        res.render('updatetask', {
                            selected_task: result,
                            state_array: state_array,
                            isLoggedIn: req.session.isLoggedIn
                        });
                        return ;
                    } else if (result[0].state === 'to-do' && await userController.checkUser(req.session.username, rows[0].permit_todolist)) {
                        state_array = ['doing'];
                        res.render('updatetask', {
                            selected_task: result,
                            state_array: state_array,
                            isLoggedIn: req.session.isLoggedIn
                        });
                        return ;
                    } else if (result[0].state === 'doing' && await userController.checkUser(req.session.username, rows[0].permit_doing)) {
                        state_array = ['to-do', 'done'];
                        res.render('updatetask', {
                            selected_task: result,
                            state_array: state_array,
                            isLoggedIn: req.session.isLoggedIn
                        });
                        return ;
                    } else if (result[0].state === 'done' && await userController.checkUser(req.session.username, rows[0].permit_done)) {
                        state_array = ['doing', 'close'];
                        res.render('updatetask', {
                            selected_task: result,
                            state_array: state_array,
                            isLoggedIn: req.session.isLoggedIn
                        });
                        return ;
                    } else {
                        res.render('updatetask', {
                            message: 'You are not authorized',
                            isLoggedIn: req.session.isLoggedIn
                        });
                    return ;
                    }
                });
                return ;
            }
        });
        return;
    }
    
    // DELETE TASK
    if (delete_task_btn){
        db.query('DELETE FROM task WHERE task_id = ?', [task_id], (error, result) => {
            if(error) {
                console.log('delete task error >>>>>', error);
            } 

            console.log(result);

            res.render('updatetask', {
                message: "Task deleted!",
                isLoggedIn: req.session.isLoggedIn
            });
        });
        return;
    }

    // UPDATE APP
    if (confirm_btn){
        db.query('SELECT * FROM task WHERE task_id = ?', [task_id], (error, result) => {
             // date that task was created
             var today = new Date();
             var createDate = today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate();

            var audit_log = `${result[0].notes}\n ${new_note}, ${req.session.username}, ${createDate}` 

            console.log('audit log >>>>>', audit_log);

            // UPDATE APP
            db.query('UPDATE task SET description = ?, notes = ?, state = ? WHERE task_id = ?', [description, audit_log, state, task_id], (error, result) => {
                if (error) {
                    console.log(error);
                }
                res.render('updatetask', {
                    message: 'Task successfully updated!',
                    isLoggedIn: req.session.isLoggedIn
                });
            });
            return;
            })
    }
}