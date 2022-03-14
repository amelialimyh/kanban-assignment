const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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

// reset password
exports.reset = (req, res) => {
    console.log(req.body);

    // destructure new_user form variables
    const { name, password, passwordConfirm } = req.body;

    // query the database
    db.query('SELECT name FROM accounts WHERE name = ?', [name], async (error, result) => {
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

        // add new user into accounts table
        db.query('UPDATE accounts SET password = ? WHERE name = ?', [ hashedPassword, name], (error, result) => {
            if(error) {
                console.log(error);
            } else {
                res.render('resetpassword', {
                    message: 'Password has been updated'
                });
            }
        });
    });    
}