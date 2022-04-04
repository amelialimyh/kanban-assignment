const db = require('../dbServer');

exports.createapp = (req, res) => {
    const { app_acronym, description, startDate, endDate, permit_open, permit_todolist, permit_doing, permit_done } = req.body;

    // check if app exists
    db.query('SELECT * FROM application WHERE app_acronym = ?', [app_acronym], (req, res) => {
        if (error) {
            console.log(error);
        }

        if (result.length > 0) {
            res.render('createapp', {
                message: 'Application already exists!'
            });
            return ;
        } else {
            // insert new app in application table
            db.query('INSERT INTO application SET ?', {app_acronym: app_acronym, description: description, rnumber: '0', start_date: startDate, end_date: endDate, permit_open: permit_open, permit_todolist: permit_todolist, permit_doing: permit_doing, permit_done: permit_done}, (error, result) => {
                if (error) {
                    console.log('insert application error >>>', error);
                } else {
                    
                }
            });
        }
    });
    
    
}