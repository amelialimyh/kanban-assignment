const db = require('../dbServer');

exports.assign = (req, res) => {
    const { username, addrole, deleterole } = req.body;  
    const role_array = ['developer', 'project lead', 'project manager', 'admin'];
    // CHECK EXISTING ROLES that the user holds
    if(username){
        db.query('SELECT * FROM usergroup WHERE username = ?', [username], (error, result, fields) => {
            if(error) {
                console.log('currentrole error >>>>>', error);
            } 
            //the usergrp values will be at result[0].usergrp;
            else if (result.length > 0) {
                var usergroups = '';
                for (let i = 0; i < result.length; i++){
                    if (i < result.length-1)
                        usergroups += result[i].usergrp + ', ';
                    else
                        usergroups += result[i].usergrp;
                }
                res.render('assignrole', {
                    currentrole: usergroups, 
                    uname: username, 
                    displayuname: username,
                    role_array : role_array
                });
                // exit render
                return ;
            }
        });
    }

    // INSERT NEW ROLE
    const {hiddenuname} = req.body;
    if (addrole || deleterole){

        if (addrole){
            // create usergrp in usergroup table
            //INSERT INTO usergroup SET username = ? AND usergrp = ?
            db.query('INSERT INTO usergroup (username,usergrp) VALUES (?,?)', [hiddenuname, addrole], (error, result) => {
                if(error) {
                    console.log('error usergroup >>>', error);
                } else {
                    
                } 
            });
            res.render('assignrole', {displayuname: 'Username',
                message: 'User details has been updated'
            });
            return ;
        }
        else if (deleterole){
            // DELETE usergrp from usergroup table
            db.query('DELETE FROM usergroup WHERE username = ? AND usergrp = ?', [hiddenuname, deleterole], (error, result) => {
                if(error) {
                    console.log('error usergroup >>>', error);
                } else {
                    
                } 
            });
            res.render('assignrole', {displayuname: 'Username',
                message: 'User details has been removed'
            });
            return ;
        }
    } 
}