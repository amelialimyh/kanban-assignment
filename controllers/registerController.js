const bcrypt = require('bcryptjs');
const db = require('../dbServer');

exports.register = (req, res) => {
    // destructure new_user form variables
    const { username, email, password, passwordConfirm, role } = req.body;

    // query the database
    db.query('SELECT * FROM accounts WHERE username = ?', [username], async (error, result) => {       
        if(error) {
            console.log(error);
        }
        
        // validate password to ensure minimum 8 characters that's a mix of alphabets, numbers and special characters but capped at 10
        // need to add ^...$ to ensure that the regex matches the entire subject string
        var validator = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=^.{8,10}$)");
        
        if(result.length > 0 ) {
            res.render('register', {
                message: 'That name is already in use',
                isLoggedIn: req.session.isLoggedIn
            });
            return ;
        } 
        else if (!validator.test(password)) {
            res.render('register', {
                message: "Password has to contain minimum 8 characters but capped at 10 and it has to be a mix of alphabets, numbers and special characters!",
                isLoggedIn: req.session.isLoggedIn
            });
            // exit the function
            return ;
        }
        else if ( password !== passwordConfirm ) {
            res.render('register', {
                message: 'Passwords do not match',
                isLoggedIn: req.session.isLoggedIn
            });
            return ;
        }
        
        // hash password
        let hashedPassword = await bcrypt.hash(password, 10);

        
        //add new user into accounts table
        db.query('INSERT INTO accounts SET ?', {username: username, email: email, password: hashedPassword, status: 'active' }, (error, result) => {
            if(error) {
                console.log(error);
            } else {
                // add username and usergrp in usergroup
                db.query('INSERT INTO usergroup SET ?', {username: username, usergrp: role}, (error, result) => {
                    if(error) {
                        console.log(error);
                    } else {

                    }
                });
                res.render('register', {
                    message: 'User registered',
                    isLoggedIn: req.session.isLoggedIn
                });
            }
        });
    });
}