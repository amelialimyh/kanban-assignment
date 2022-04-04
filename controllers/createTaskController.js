const bcrypt = require('bcryptjs');
const db = require('../dbServer');

exports.createtask = (req, res) => {

    // query the database
    db.query('SELECT * FROM task WHERE name = ?', [username], async (error, results) => {       
        
        if(error) {
            console.log(error);
        }
    });
}