const express = require('express');
const registerController = require('../controllers/registerController');
const updateController = require('../controllers/updateController');
const assignRoleController = require('../controllers/assignRoleController');
const kanbanBoardController = require('../controllers/kanbanBoardController');
const router = express.Router();

router.post('/register', registerController.register);
router.post('/update', updateController.update);
router.post('/assignrole', assignRoleController.assign);
router.post('/kanbanboard', kanbanBoardController.create);


module.exports = router;