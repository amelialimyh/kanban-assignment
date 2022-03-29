const db = require('../dbServer');

exports.assign = (req, res) => {
    console.log(req.body);
    const { username, role } = req.body;  
    
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
                    currentrole: result[0].usergrp
                });
                // exit render
                return ;
            }
        });
    }

    if(username || role ){
    
    // update user roles in both accounts and usergroup table
    // query database to check if username exists and update user roles
    db.query('SELECT * FROM accounts WHERE username = ?', [username], async (error, result) => {
        console.log("running query 1");
        // display current user's roles
        if(error) {
            console.log(error);
            res.render('assignrole', {
                message: 'Internal server error'
            });
            return ;
        }

        // update user roles in accounts table
        db.query('UPDATE accounts SET role = ? WHERE username = ?;', [ role, username], (error, result) => {
            if(error) {
                console.log('error >>>',error);
            } else {
                // update usergrp in usergroup table
                db.query('UPDATE usergroup SET usergrp = ? WHERE username = ?;', [role, username], (error, result) => {
                    if(error) {
                        console.log('error usergroup >>>', error);
                    } else {
                        
                    } 
                });
                res.render('update', {
                    message: 'User details has been updated'
                });
            } 
        });
    });  
    }  
}