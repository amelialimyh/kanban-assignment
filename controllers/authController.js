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

exports.register = (req, res) => {
    console.log(req.body);

    // destructure new_user form variables
    const { name, email, password, passwordConfirm } = req.body;

    // query the database
    db.query('SELECT email FROM accounts WHERE email = ?', [email], (error, results) => {
        if(error) {
            console.log(error);
        }

        if(results.length > 0 ) {
            res.render('register', {
                message: 'That email is already in use'
            });
        } 
        else if ( password !== passwordConfirm ) {
            res.render('register', {
                message: 'Passwords do not match'
            });
        }
    })
    res.send("Form submitted");
}