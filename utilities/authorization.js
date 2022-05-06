const util = require('util');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
require("dotenv").config();


const { DB_HOST, DB_USER, DB_PASSWORD, DB_EMAIL, DB_DATABASE, DB_PORT} = process.env;

const connection = mysql.createConnection({
   host: DB_HOST,
   user: DB_USER,
   password: DB_PASSWORD,
   email: DB_EMAIL,
   database: DB_DATABASE,
   port: DB_PORT
});

// ---------------------------- CHECK USER'S ROLE ---------------------------------
exports.validate = async (req, res, next) => {
    try {
        console.log('HEADERSSSS >>>>', req.headers);

        var authheader = req.headers.authorization; 
        console.log('authheader', authheader);


        if (!authheader) {
            var err = new Error('You are not authenticated!');
            res.setHeader('WWW-Authenticate', 'Basic');
            err.status = 401;
            return next(err);
        } else {
            // split authheader to grab the hash and convert it to string via ascii
            var text = Buffer.from((authheader.split(' '))[1], 'base64').toString('ascii');
            
            // split the joint decoded username and password
            var [username, password] = text.split(':');

            const results = await util.promisify(connection.query).bind(connection)( 
                `SELECT * FROM accounts WHERE username = ?`, [username]
            );
            // bcrypt.compare for password
            if (bcrypt.compareSync(password, results[0].password)){
                const role = await util.promisify(connection.query).bind(connection)( 
                    `SELECT * FROM usergroup WHERE username = ?`, [username]
                );
                // need to run middleware to save the roles
                req.roles = role;
                next();
            }
        }
    } catch (e) {
        res.status(500).send({ e });
    }
}