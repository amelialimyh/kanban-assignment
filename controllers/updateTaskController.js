const db = require('../dbServer');

exports.updatetask = (req, res) => {
    const { task_id, task_id_btn } = req.body;  

    // VERIFY EXISTING APP 
    if (task_id_btn){
        db.query('SELECT * FROM task WHERE task_id = ?', [task_id], (error, result, fields) => {
            if(error) {
                console.log('existing app error >>>>>', error);
            } 

            console.log(result);

            res.render('updatetask', {
                selected_task: result
            });
            return ;
        });
        return;
    }
    
    // // DELETE APP
    // if (delete_acronym_btn){
    //     db.query('DELETE FROM application WHERE app_acronym = ?', [app_acronym], (error, result) => {
    //         if(error) {
    //             console.log('delete app error >>>>>', error);
    //         } 

    //         console.log(result);

    //         res.render('editapp', {
    //             message: "Application deleted!"
    //         });
    //     });
    //     return;
    // }

    // // UPDATE APP
    // if (confirm_edit_btn){
    //     // UPDATE APP
    //     db.query('UPDATE application SET description = ?, start_date = ?, end_date = ?, permit_open = ?, permit_todolist = ?, permit_doing = ?, permit_done = ? WHERE app_acronym = ?', [description, start_date, end_date, permit_open, permit_todolist, permit_doing, permit_done, app_acronym], (error, result) => {
    //         if (error) {
    //             console.log(error);
    //         }
    //         res.render('editapp', {
    //             message: 'Application successfully updated!',
    //             app_arr: result
    //         });
    //     });
    //     return;
    // }
}