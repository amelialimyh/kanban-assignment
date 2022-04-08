const { end } = require('../dbServer');
const db = require('../dbServer');

exports.editapp = (req, res) => {
    const { app_acronym, description, rnumber, start_date, end_date, permit_open, permit_todolist, permit_doing, permit_done } = req.body;  
    
    // VERIFY WHICH EXISTING APP 
    if(app_acronym){
        db.query('SELECT * FROM application WHERE app_acronym = ?', [app_acronym], (error, result, fields) => {
            if(error) {
                console.log('currentrole error >>>>>', error);
            } 
            var description = [];
            var rnumber = [];           
            var start_date = [];
            var end_date = [];
            var permit_open = [];
            var permit_todolist = [];
            var permit_doing = [];
            var permit_done = [];

            for (let i = 0; i < result.length; i++){
                description.push(result[i.description]);
                rnumber.push(result[i.rnumber]);
                start_date.push(result[i.start_date]);
                end_date.push(result[i.end_date]);
                permit_open.push(result[i.permit_open]);
                permit_todolist.push(result[i.permit_todolist]);
                permit_doing.push(result[i.permit_doing]);
                permit_done.push(result[i.permit_done]);
            }
            res.render('editapp', {
                description: description,
                rnumber: rnumber,
                start_date: start_date,
                end_date: end_date,
                permit_open: permit_open,
                permit_todolist: permit_todolist,
                permit_doing: permit_doing,
                permit_done: permit_done
            });
            // exit render
            return ;
        });
    }

//     // INSERT NEW ROLE
//     const {hiddenuname} = req.body;
//     if (addrole || deleterole){

//         if (addrole){
//             // create usergrp in usergroup table
//             //INSERT INTO usergroup SET username = ? AND usergrp = ?
//             db.query('INSERT INTO usergroup (username,usergrp) VALUES (?,?)', [hiddenuname, addrole], (error, result) => {
//                 if(error) {
//                     console.log('error usergroup >>>', error);
//                 } else {
                    
//                 } 
//             });
//             res.render('assignrole', {displayuname: 'Username',
//                 message: 'User details has been updated'
//             });
//             return ;
//         }
//         else if (deleterole){
//             // DELETE usergrp from usergroup table
//             db.query('DELETE FROM usergroup WHERE username = ? AND usergrp = ?', [hiddenuname, deleterole], (error, result) => {
//                 if(error) {
//                     console.log('error usergroup >>>', error);
//                 } else {
                    
//                 } 
//             });
//             res.render('assignrole', {displayuname: 'Username',
//                 message: 'User details has been removed'
//             });
//             return ;
//         }
//     } 
}