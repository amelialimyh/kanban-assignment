const bcrypt = require('bcryptjs');
const db = require('../dbServer');


exports.updateuser = (req, res) => {
    console.log(req.body);
    const { username, email, status, password, passwordConfirm } = req.body;  
    
    // update user details in accounts table
    // query database to check if username exists and update user details
    db.query('SELECT * FROM accounts WHERE username = ?', [username], async (error, result) => {
        console.log("running query 1");
        // display current user's roles
        if(error) {
            console.log(error);
            res.render('updateuser', {
                message: 'Internal server error',
                current_user: req.session.username,
                isLoggedIn: req.session.isLoggedIn
            });
            return ;
        }

        console.log('result >>>>>', result);

        // check if username exists
        if (result.length === 0) {
            console.log('result.length === 0 >>>>>', result.length);
            res.render('updateuser', {
                message: 'Username or Password is invalid!',
                current_user: req.session.username,
                isLoggedIn: req.session.isLoggedIn
            });
            return ;
        } 

        // validate password to ensure minimum 8 characters that's a mix of alphabets, numbers and special characters but capped at 10
        var validator = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=^.{8,10}$)");

        if( password !== passwordConfirm ) {
            res.render('updateuser', {
                message: 'Passwords do not match',
                current_user: req.session.username,
                isLoggedIn: req.session.isLoggedIn
            });
            return ;
        }
        if (!validator.test(password)) {
            res.render('updateuser', {
                message: "Password has to contain minimum 8 characters but capped at 10 and it has to be a mix of alphabets, numbers and special characters!",
                current_user: req.session.username,
                isLoggedIn: req.session.isLoggedIn
            });
            return ;
        }

        let hashedPassword = await bcrypt.hash(password, 10);

        // update user deets in accounts table
        db.query('UPDATE accounts SET password = ?, email = ?, status = ? WHERE username = ?', [ hashedPassword, email, status, username], (error, result) => {
            if(error) {
                console.log('error >>>',error);
            } else {
                res.render('updateuser', {
                    message: 'User details has been updated',
                    current_user: req.session.username,
                    isLoggedIn: req.session.isLoggedIn
                });
            } 
        });
    });  
}  