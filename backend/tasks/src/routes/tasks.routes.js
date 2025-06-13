const express = require('express');
const router = express.Router();

const tasksController = require('../controllers/tasks.controller.js');
const requireFileds = require('../middlewares/requireFields.middleware.js');

router.post('/', requireFields(["title", "content"]), tasksController.createTask);
router.get('/', tasksController.getAllTasks);
router.get('/:id', tasksController.getTaskById);
router.put('/:id', requireFileds(["title", "content", "completed"]), tasksController.updateTask);
router.delete('/:id', tasksController.deleteTask);

module.exports = router;