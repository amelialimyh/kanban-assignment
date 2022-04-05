const db = require('../dbServer');

exports.createtask = (req, res, fields) => {
    console.log(req.body);

    const { name, description, notes, task_plan, state } = req.body;

    // check if app exists
    db.query('SELECT * FROM application WHERE app_acronym = ?', [app_acronym], (error, result) => {
        if (error) {
            console.log(error);
        }

        if (result.length === 0) {
            res.render('createtask', {
                message: 'Application does not exist!'
            });
            return ;
        } else {
            // new task id
            var newTaskId = `${result[0].app_acronym}_${result[0].rnumber}`;
            // current app acronym
            var task_app_acronym = `${result[0].app_acronym}`;
            // task creator
            var task_creator = req.session.username;
            var task_owner = req.session.username;
            // date that task was created
            var today = new Date();
            var createDate = today.getDate() + '-' + (today.getMonth()+1) + '-' + today.getFullYear();
            console.log(createDate);

            db.query('INSERT INTO task (task_id,name,description,notes,task_plan,task_app_acronym,state,creator,owner,createDate) VALUES (?,?,?,?,0,?,?,?,?,?)', [newTaskId, name, description, notes, task_app_acronym, state, task_creator, task_owner, createDate], (error, result) => {
                if (error) {
                    console.log('insert application error >>>', error);
                } else {
                    res.render('createapp', {
                        message: 'Application created'
                    });
                }
            });
        }
    });
    
    
}