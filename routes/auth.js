const express = require('express');
const registerController = require('../controllers/registerController');
const updateController = require('../controllers/updateController');
const assignRoleController = require('../controllers/assignRoleController');
const createAppController = require('../controllers/createAppController');
const editAppController = require('../controllers/editAppController');
const createTaskController = require('../controllers/createTaskController');
const router = express.Router();

router.post('/register', registerController.register);
router.post('/update', updateController.update);
router.post('/assignrole', assignRoleController.assign);
router.post('/createapp', createAppController.createapp);
router.post('/editapp', editAppController.editapp);
router.post('/createtask/:id', createTaskController.createtask);


module.exports = router;