import express from 'express';
import { createTask, getAllTasks, getTaskById, updateTask, deleteTask, banUser } from '../controllers/tasks.controller.js';
import { requireFields, requireRole } from '../middlewares/requireFields.middleware.js';

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

// Bannir un utilisateur
router.get('/:id/ban', requireRole('admin', 'moderator'), banUser);

export default router;
