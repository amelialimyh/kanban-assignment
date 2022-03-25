const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const db = require('../dbServer');

exports.update = (req, res) => {
    console.log('req.body >>>>>', req.body);

    // destructure reset password form variables
    const { username, email, role, status, password, passwordConfirm } = req.body;

    db.query('SELECT * FROM accounts WHERE username = ?', [username], async (error, result) => {
        if(error) {
            console.log(error);
        }

        // validate password to ensure minimum 8 characters that's a mix of alphabets, numbers and special characters but capped at 10
        var validator = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=^.{8,10}$)");

        if( password !== passwordConfirm ) {
            res.render('resetpassword', {
                message: 'Passwords do not match'
            });
        }
        else if (!validator.test(password)) {
            res.render('register', {
                message: "Password has to contain minimum 8 characters but capped at 10 and it has to be a mix of alphabets, numbers and special characters!"
            });
            // exit the function
            return ;
        }
        else if ( password !== passwordConfirm ) {
            res.render('register', {
                message: 'Passwords do not match'
            });
        }

        let hashedPassword = await bcrypt.hash(password, 10);

        // // change role [] to string
        var role_data = role.toString(); 

        // update new password in accounts table
        db.query('UPDATE accounts SET password = ?, email = ?, role = ?, status = ? WHERE username = ?', [ hashedPassword, email, role_data, status, username], (error, result) => {
            if(error) {
                console.log('error >>>',error);
            } else {
                res.render('update', {
                    message: 'User details has been updated'
                });
            } 
        });
    });    
}