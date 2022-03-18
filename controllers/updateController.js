const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const db = require('../dbServer');

exports.update = (req, res) => {
        console.log(req.body);

    // destructure reset password form variables
    const { name, email, status, password, passwordConfirm } = req.body;

    // query the database
    db.query('SELECT * FROM accounts WHERE name = ?', [name], async (error, result) => {
        if(error) {
            console.log(error);
        }

        if( password !== passwordConfirm ) {
            res.render('resetpassword', {
                message: 'Passwords do not match'
            });
        }

        let hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);

        // update new password in accounts table
        db.query('UPDATE accounts SET password = ?, email = ?, status = ? WHERE name = ?', [ hashedPassword, email, status, name], (error, result) => {
            if(error) {
                console.log(error);
            } else {
                res.render('update', {
                    message: 'User details has been updated'
                });
            }
        });
    });    
}