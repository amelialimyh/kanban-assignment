const authCreate = (permissions) => {
    return (req, res, next) => {
        const userRole = req.body.role
        if (permissions.includes(userRole)) {
            next();
        } else {
            return res.status(401).json("You don't have permission!");
        }
    }
};

const authDisable = (req, res, next) => {};

const authReset = (req, res, next) => {};

module.exports = { authCreate, authDisable, authReset };