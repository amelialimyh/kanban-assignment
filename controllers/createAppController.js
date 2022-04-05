const db = require('../dbServer');

exports.createapp = (req, res) => {
    console.log(req.body);

    const { app_acronym, description, startDate, endDate, permit_open, permit_todolist, permit_doing, permit_done } = req.body;

    // check if app exists
    db.query('SELECT * FROM application WHERE app_acronym = ?', [app_acronym], (error, result) => {
        if (error) {
            console.log(error);
        }

        if (result.length > 0) {
            res.render('createapp', {
                message: 'Application already exists!'
            });
            return ;
        } else {
            db.query('INSERT INTO application (app_acronym,description,rnumber,start_date,end_date,permit_open,permit_todolist,permit_doing,permit_done) VALUES (?,?,0,?,?,?,?,?,?)', [app_acronym, description, startDate, endDate, permit_open, permit_todolist, permit_doing, permit_done], (error, result) => {
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