const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const db = require('../dbServer');

exports.update = (req, res) => {
   // destructure reset password form variables
    const { username, email, role, status, password, passwordConfirm } = req.body;

    
    // display current user's roles
    db.query('SELECT usergrp FROM usergroup WHERE username = ?', [username], (error, result, fields) => {
        if(error) {
            console.log('currentrole error >>>>>', error);
        } 
        //the usergrp values will be at result[0].usergrp;
        if (result.length > 0) {
            res.render('update', {
                currentrole: result[0].usergrp
            });
            // exit render
            return ;
        }
    });

    // update user details in both accounts and usergroup table
    // query database to check if username exists and update user details
    db.query('SELECT * FROM accounts WHERE username = ?', [username], async (error, result) => {
        if(error) {
            console.log(error);
            res.render('update', {
                message: 'Internal server error'
            });
            return ;
        }
        // check if username exists
        if (result.length === 0) {
            res.render('update', {
                message: 'Username or Password is invalid!'
            });
            return ;
        } 

        // validate password to ensure minimum 8 characters that's a mix of alphabets, numbers and special characters but capped at 10
        var validator = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=^.{8,10}$)");

        if( password !== passwordConfirm ) {
            res.render('update', {
                message: 'Passwords do not match'
            });
            return ;
        }
        if (!validator.test(password)) {
            res.render('update', {
                message: "Password has to contain minimum 8 characters but capped at 10 and it has to be a mix of alphabets, numbers and special characters!"
            });
            return ;
        }

        let hashedPassword = await bcrypt.hash(password, 10);

        // // change role [] to string
        var role_data = role.toString(); 

        // update user deets in accounts table
        db.query('UPDATE accounts SET password = ?, email = ?, role = ?, status = ? WHERE username = ?;', [ hashedPassword, email, role_data, status, username], (error, result) => {
            if(error) {
                console.log('error >>>',error);
            } else {
                db.query('UPDATE usergroup SET usergrp = ? WHERE username = ?;', [role_data, username], (error, result) => {
                    if(error) {
                        console.log('error usergroup >>>',error);
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