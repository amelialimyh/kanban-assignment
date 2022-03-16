const mysql = require('mysql');

const authCreate = (role, name) => {
    var sql = "SELECT * FROM accounts WHERE roles = ? AND name = ?"
    return (req, res, next) => {
        if (permissions.includes(role)) {
            next();
        } else {
            return res.status(401).json("You don't have permission!");
        }
    }
};

const authDisable = (req, res, next) => {};

const authReset = (req, res, next) => {};

module.exports = { authCreate, authDisable, authReset };