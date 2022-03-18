const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const checkUser = require('../models/checkUser');

const { DB_HOST, DB_USER, DB_PASSWORD, DB_EMAIL, DB_DATABASE, DB_PORT} = process.env;

const db = mysql.createPool({
    connectionLimit: 100,
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    email: DB_EMAIL,
    database: DB_DATABASE,
    port: DB_PORT
});

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