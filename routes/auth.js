const express = require('express');
const registerController = require('../controllers/registerController');
const updateController = require('../controllers/updateController');
// const currentGroupController = require('../controllers/groupController');
const assignRoleController = require('../controllers/assignRoleController');
const router = express.Router();

router.post('/register', registerController.register);
router.post('/update', updateController.update);
// router.post('/currentgroup', currentGroupController.user_list);
router.post('/assignrole', assignRoleController.assign);


module.exports = router;