const db = require('../dbServer');

exports.assign = (req, res) => {
    const { username, role } = req.body;  
    const role_array = ['Team Member', 'Project Lead', 'Project Manager', 'Admin'];
    // check EXISTING ROLES that the user holds
    if(username){
        db.query('SELECT usergrp FROM usergroup WHERE username = ?', [username], (error, result, fields) => {
            console.log("running EXISTING ROLES query");
            if(error) {
                console.log('currentrole error >>>>>', error);
            } 
            //the usergrp values will be at result[0].usergrp;
            else if (result.length > 0) {
                res.render('assignrole', {
                    currentrole: result[0].usergrp, 
                    uname: username, 
                    displayuname: username,
                    role_array : role_array
                });
                // exit render
                return ;
            }
        });
    }

    // UPDATE user's role
    const {hiddenuname} = req.body;
    if (role){
        // update user roles in accounts table
        db.query('UPDATE accounts SET role = ? WHERE username = ?;', [ role, hiddenuname], (error, result) => {
            if(error) {
                console.log('error >>>',error);
            } else {
                // update usergrp in usergroup table
                db.query('UPDATE usergroup SET usergrp = ? WHERE username = ?;', [role, hiddenuname], (error, result) => {
                    if(error) {
                        console.log('error usergroup >>>', error);
                    } else {
                        
                    } 
                });
                res.render('assignrole', {displayuname: 'Username',
                    message: 'User details has been updated'
                });
            } 
        });
    }
}