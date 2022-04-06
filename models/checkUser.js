const db = require('../dbServer');

// need to use async and await otherwise the result would be empty
exports.checkUser = async (username, role) => {
    return new Promise ((resolve, reject) => {
        try{
            db.query('SELECT * FROM usergroup WHERE username = ? AND usergrp = ?', [username, role], (error, result) => {
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