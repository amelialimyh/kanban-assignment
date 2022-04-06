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
                console.log('for loop result >>>>', result);
                var task_app_acronym = `${result[i].app_acronym}`;
                console.log('app_acronnym >>>>', app_acronym);
                // new task id
                var newTaskId = `${result[0].app_acronym}_${result[0].rnumber}`;

                // state
                var state = 'open';
    
                // creator
                var task_creator = req.session.username;
                
                // owner
                var task_owner = req.session.username;
    
                // date that task was created
                var today = new Date();
                var createDate = today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate();
    
                db.query('INSERT INTO task (task_id,name,description,notes,task_app_acronym,state,creator,owner,createDate) VALUES (?,?,?,?,?,?,?,?,?)', [newTaskId, name, description, notes, task_app_acronym, state, task_creator, task_owner, createDate], (error, result) => {
                    if (error) {
                        console.log('insert application error >>>', error);
                    } else {
                        res.render('createapp', {
                            message: 'Application created',
                        });
                    }
                });
            }
        }
    });
}