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

        if(results.length > 0 ) {
            res.render('register', {
                message: 'That name is already in use'
            });
        } 
        else if ( password !== passwordConfirm ) {
            res.render('register', {
                message: 'Passwords do not match'
            });
        }

        let hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);

        // add new user into accounts table
        db.query('INSERT INTO accounts SET ?', {name: name, email: email, password: hashedPassword, role: role, status: 1 }, (error, results) => {
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