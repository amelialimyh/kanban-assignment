const db = require('../dbServer');

exports.assign = (req, res) => {
    // console.log(req.body);
    const { username, role } = req.body;  
    // console.log(role);
    const role_array = ['Team Member', 'Project Lead', 'Project Manager', 'Admin', 'User'];
    // check EXISTING ROLES that the user holds
    if(username){
        db.query('SELECT usergrp FROM usergroup WHERE username = ?', [username], (error, result, fields) => {
            console.log("running query 2");
            if(error) {
                console.log('currentrole error >>>>>', error);
            } 
            //the usergrp values will be at result[0].usergrp;
            else if (result.length > 0) {
                console.log('====', result[0].usergrp);
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
        console.log("ENTERED")
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