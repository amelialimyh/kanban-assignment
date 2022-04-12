const db = require('../dbServer');

exports.updatetask = (req, res) => {
    const { task_id, task_id_btn, delete_task_btn, description, confirm_btn, state } = req.body;  

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
                state_array: state_array
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
                message: "Task deleted!"
            });
        });
        return;
    }

    // UPDATE APP
    if (confirm_btn){
        // UPDATE APP
        db.query('UPDATE task SET description = ?, state = ? WHERE task_id = ?', [description, state, task_id], (error, result) => {
            if (error) {
                console.log(error);
            }
            res.render('updatetask', {
                message: 'Task successfully updated!',
            });
        });
        return;
    }
}