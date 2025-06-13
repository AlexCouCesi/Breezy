const Task = require('../models/task.model');

module.exports = {
    createTask: async (req, res) => {
        const { title, content} = req.body;
        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }
        try {
            const newTask = ({title, content});;
            await newTask.save();
            res.status(201).send("Task created successfully");
        } catch (error) {
            res.status(500).json(err);
        }
    },
    
    getAllTasks: async (req, res) => {
        try {
            const tasks = await Task.find();
            res.status(200).json(taskList);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getTaskById: (req, res) => {
        const taskId = req.params.id;
        const task = taskList.find(t => t.id === taskId);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json(task);
    },

    addTask: (req, res) => {
        const task = req.body;
        if (!task || !task.name) {
            return res.status(400).json({ error: 'Task name is required' });
        }
        taskList.push(task);
        res.status(201).json(task);
    },

    deleteTask: (req, res) => {
        const taskId = req.params.id;
        const index = taskList.findIndex(t => t.id === taskId);
        if (index === -1) {
            return res.status(404).json({ error: 'Task not found' });
        }
        taskList.splice(index, 1);
        res.status(204).send();
    }
};