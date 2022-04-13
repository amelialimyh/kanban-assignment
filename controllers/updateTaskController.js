const db = require('../dbServer');

exports.updatetask = (req, res) => {
    const { task_id, task_id_btn, delete_task_btn, description, confirm_btn, state, new_note } = req.body;  

    state_array = ['open', 'to-do', 'doing', 'done', 'close'];

    // VERIFY EXISTING APP 
    if (task_id_btn){
        db.query('SELECT * FROM task WHERE task_id = ?', [task_id], (error, result, fields) => {
            if(error) {
                console.log('existing app error >>>>>', error);
            } 

            console.log(result);

            res.render('updatetask', {
                selected_task: result,
                state_array: state_array,
                isLoggedIn: req.session.isLoggedIn
            });
            return ;
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