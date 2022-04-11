const db = require('../dbServer');

exports.editapp = (req, res) => {
    const { app_acronym, description, start_date, end_date, permit_open, permit_todolist, permit_doing, permit_done, check_acronym_btn, delete_acronym_btn, confirm_edit_btn } = req.body;  
    
    // roles for different permissions (permit_open etc.)
    var roles = ['developer', 'project lead', 'project manager'];

    // VERIFY EXISTING APP 
    if (check_acronym_btn){
        db.query('SELECT * FROM application WHERE app_acronym = ?', [app_acronym], (error, result, fields) => {
            if(error) {
                console.log('existing app error >>>>>', error);
            } 

            console.log(result);

            res.render('editapp', {
                selected_app: result,
                roles: roles
            });
            return ;
        });
        return;
    }
    
    // DELETE APP
    if (delete_acronym_btn){
        db.query('DELETE FROM application WHERE app_acronym = ?', [app_acronym], (error, result) => {
            if(error) {
                console.log('delete app error >>>>>', error);
            } 

            console.log(result);

            res.render('editapp', {
                message: "Application deleted!"
            });
        });
        return;
    }

    // UPDATE APP
    if (confirm_edit_btn){
        // UPDATE APP
        db.query('UPDATE application SET description = ?, start_date = ?, end_date = ?, permit_open = ?, permit_todolist = ?, permit_doing = ?, permit_done = ? WHERE app_acronym = ?', [description, start_date, end_date, permit_open, permit_todolist, permit_doing, permit_done, app_acronym], (error, result) => {
            if (error) {
                console.log(error);
            }
            res.render('editapp', {
                message: 'Application successfully updated!',
                app_arr: result
            });
        });
        return;
    }
}