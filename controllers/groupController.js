const db = require('../dbServer');

exports.user_list = async (req, res) => {
    var userList = [];
    return new Promise ((resolve, reject) => {
        try{
            db.query('SELECT * FROM usergroup', (err, result, fields) => {
                if (err) {
                    console.log(err);
                }
                
                if (!result.length) {
                    resolve(result);
                } 

                else if (result.length > 0) {
                    resolve(result);
                }
            });
        } catch (e) {
            console.log(e);
        }
    }) 
}