const res = require('express/lib/response');
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

// need to use async and await otherwise the result would be empty
exports.checkUser = async (username, role) => {
    return new Promise ((resolve, reject) => {
        try{
            db.query('SELECT * FROM accounts WHERE name = ? AND role = ?', [username, role], (error, result) => {
                if (error) {
                    console.log(error);
                }
        
                // if no rows/result that means the user isn't an admin
                if (!result.length) {
                    resolve(false);
                } 
                // allow user to visit site
                else if (result.length > 0) {
                    resolve(true);
                }
            });

        } catch (e) {
            console.log(e);
        }
    })   
}

//////////////   CALLBACK HELL /////////////////////

// function checkUser(username, role, callback) {
//     let retval = new Object();
//     try{
//         db.query('SELECT * FROM accounts WHERE name = ? AND role = ?', [username, role], (error, result) => {
//             if (error) {
//                 console.log(error);
//             }
    
//             // returns a promise that's why it's undefined
//             console.log('checkUser result >>>', result);
    
//             // if no rows/result that means the user isn't an admin
//             if (!result.length) {
//                 //return ({checkUserResult:false, message: "You are not authorized to visit this page!"});
//                 callback({checkUserResult:false, message: "You are not authorized to visit this page!"})
//             } 
//             // allow user to visit site
//             else if (result.length > 0) {
//                 //return ({checkUserResult: true});
//                 callback({checkUserResult: true});
//             }
//         });

//     } catch (e) {
//         console.log(e);
//     } finally {
//         return retval;
//     }
    
// }