const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const db = require('../dbServer');

exports.register = (req, res) => {
    // destructure new_user form variables
    console.log(req.body);
    const { username, email, password, passwordConfirm, role } = req.body;

    // query the database
    db.query('SELECT * FROM accounts WHERE username = ?', [username], async (error, results) => {       
        
        if(error) {
            console.log(error);
        }
        
        // validate password to ensure minimum 8 characters that's a mix of alphabets, numbers and special characters but capped at 10
        // need to add ^...$ to ensure that the regex matches the entire subject string
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
        
        // create empty array to insert multiple values if needed for roles
        console.log('role >>>>', role);
        // CHANGE TO STRING WHICH IS SIMILAR TO VARCHAR IN MYSQL
        var role_data = role.toString(); 
        // var role_data = role.split(","); //When you take this value out of the database use this code please. This splits the data from full string to multiple strings using the , as the delimiter any questions?
        
        //add new user into accounts table
        db.query('INSERT INTO accounts SET ?', {username: username, email: email, password: hashedPassword, role: role_data, status: 'active' }, (error, results) => {
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