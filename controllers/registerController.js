const mysql = require('mysql');
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

exports.register = (req, res) => {
    console.log(req.body);

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