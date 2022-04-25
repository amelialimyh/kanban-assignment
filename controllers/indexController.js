const db = require('../dbServer');

exports.index = (req, res) => {
    const { app_acronym_btn } = req.body;

    var selected_app = []

    db.query('SELECT task_id FROM task WHERE task_app_acronym = ?', [app_acronym_btn], (error, result) => {
        if (error){
            console.log(error);
        }

        if (app_acronym_btn){
            for (let i = 0; i < result.length; i++){
                selected_app.push(result[i]);
            }
            res.render('index', {
                selected_app: result,
                current_user: req.session.username,
                isLoggedin: req.session.isLoggedIn
            })
        }
    });
}