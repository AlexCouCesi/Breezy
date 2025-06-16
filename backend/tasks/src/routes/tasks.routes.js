import express from 'express';
import { createTask, getAllTasks, getTaskById, updateTask, deleteTask } from '../controllers/tasks.controller.js';
import requireFields from '../middlewares/requireFields.middleware.js';

const router = express.Router();

// Créer une tâche
router.post('/', requireFields(['title', 'content']), createTask);

// Récupérer toutes les tâches
router.get('/', getAllTasks);

// Récupérer une tâche par ID
router.get('/:id', getTaskById);

// Mettre à jour une tâche
router.put('/:id', requireFields(['title', 'content']), updateTask);

// Supprimer une tâche
router.delete('/:id', deleteTask);

export default router;
