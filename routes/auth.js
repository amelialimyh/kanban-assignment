const express = require('express');
const registerController = require('../controllers/registerController');
const updateUserController = require('../controllers/updateUserController');
const assignRoleController = require('../controllers/assignRoleController');
const createAppController = require('../controllers/createAppController');
const editAppController = require('../controllers/editAppController');
// const createTaskController = require('../controllers/createTaskController');
const updateTaskController = require('../controllers/updateTaskController');
const indexController = require('../controllers/indexController');
const router = express.Router();

router.post('/register', registerController.register);
router.post('/updateuser', updateUserController.updateuser);
router.post('/assignrole', assignRoleController.assign);
router.post('/createapp', createAppController.createapp);
router.post('/editapp', editAppController.editapp);
// router.post('/createtask', createTaskController.createtask);
router.post('/updatetask', updateTaskController.updatetask);
router.post('/index', indexController.index);
router.post('/', indexController.index);

module.exports = router;