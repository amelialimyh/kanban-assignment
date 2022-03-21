const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const db = require('../dbServer');

exports.register = (req, res) => {
    console.log( req.body);

    // destructure new_user form variables
    const { name, email, password, passwordConfirm, role } = req.body;

    // query the database
    db.query('SELECT name FROM accounts WHERE name = ?', [name], async (error, results) => {
        if(error) {
            console.log(error);
        }

        // validate password to ensure minimum 8 characters that's a mix of alphabets, numbers and special characters but capped at 10
        var validator = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,10}$/)");

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
        console.log(hashedPassword);

        // add new user into accounts table
        db.query('INSERT INTO accounts SET ?', {name: name, email: email, password: hashedPassword, role: role, status: 'active' }, (error, results) => {
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