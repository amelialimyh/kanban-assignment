const mysql = require('mysql');

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

// change email
module.exports.changeEmail = (req, res) => {
    console.log(req.body);

    // destructure new_user form variables
    const { name, email, emailConfirm } = req.body;

    // query the database
    db.query('SELECT * FROM accounts WHERE name = ?', [name], async (error, result) => {
        if(error) {
            console.log(error);
        }

        if( email !== emailConfirm ) {
            res.render('updateemail', {
                message: 'Email address did not match'
            });
        }
        
        else {
            // update email in accounts table
            db.query('UPDATE accounts SET email = ? WHERE name = ?', [ email, name], (error, result) => {
                if(error) {
                    console.log(error);
                } else {
                    res.render('updateemail', {
                        message: 'Email has been updated'
                    });
                }
            });
        }
    });    
}