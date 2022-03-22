const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const db = require('../dbServer');

exports.register = (req, res) => {
    // destructure new_user form variables
    const { username, email, password, passwordConfirm, role } = req.body;

    // query the database
    db.query('SELECT * FROM accounts WHERE username = ?', [username], async (error, results) => {
        if(error) {
            console.log(error);
        }

        // validate password to ensure minimum 8 characters that's a mix of alphabets, numbers and special characters but capped at 10
        // need to add ^...$ to ensure that the regex mataches the entire subject string
        var validator = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=^.{8,10}$)");

        if(results.length > 0 ) {
            res.render('register', {
                message: 'That name is already in use'
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

        // add new user into accounts table
        db.query('INSERT INTO accounts SET ?', {username: username, email: email, password: hashedPassword, role: role, status: 'active' }, (error, results) => {
            if(error) {
                console.log(error);
            } else {
                res.render('register', {
                    message: 'User registered'
                });
            }
        });
    });
}