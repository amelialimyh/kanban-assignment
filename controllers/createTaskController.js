const db = require('../dbServer');

exports.createtask = (req, res, fields) => {
    console.log(req.body);

    const { name, description, notes, app_acronym } = req.body;

    // check if app exists
    db.query('SELECT * FROM application WHERE app_acronym = ?',[app_acronym], (error, result) => {
        if (error) {
            console.log(error);
        }

        if (result.length === 0) {
            console.log('result >>>', result);
            res.render('createtask', {
                message: 'Application does not exist!'
            });
            return ;
        } else {
            for (let i = 0; i < result.length; i++){
                var task_app_acronym = `${result[i].app_acronym}`;
                
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
                var audit_trail = `${notes}, ${req.session.username}, ${state}, ${createDate}`
                
                // new rnumber 
                var rnumber = `${result[0].rnumber+1}`;

                db.query('INSERT INTO task (task_id,name,description,notes,task_app_acronym,state,creator,owner,createDate) VALUES (?,?,?,?,?,?,?,?,?)', [newTaskId, name, description, audit_trail, task_app_acronym, state, task_creator, task_owner, createDate], (error, result) => {
                    if (error) {
                        console.log('insert application error >>>', error);
                    } else {
                        db.query('UPDATE application SET rnumber = ? WHERE app_acronym = ?', [rnumber, app_acronym], (error, result) => {
                            res.render('createtask', {
                                message: 'Application created',
                            });
                        })
                    }
                });
            }
        }
    });
}