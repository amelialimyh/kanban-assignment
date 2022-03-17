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

function checkUser(username, role) {
    db.query('SELECT * FROM accounts WHERE role = ? and name = ?', [username, role], (error, result) => {
        if (error) {
            console.log(error);
        }

        if (result.length > 0) {
            console.log(`User ${username} is a ${role}`);
        }
    });

}

module.exports = checkUser;