import express from 'express';
import { createUser, getAllUsers, getUserById, updateUser, deleteUser, banUser, followUser } from '../controllers/users.controller.js';
import { requireFields, requireRole } from '../middlewares/requireFields.middleware.js';

const router = express.Router();

// Créer une utilisateur
router.post('/', requireFields(['username', 'email', 'id']), createUser);

// Récupérer toutes les utilisateurs
router.get('/', getAllUsers);

// Récupérer une utilisateur par ID
router.get('/:id', getUserById);

// Mettre à jour une utilisateur
router.put('/:id', requireFields(['username', 'email']), updateUser);

// Supprimer une utilisateur
router.delete('/:id', deleteUser);

// Bannir un utilisateur
router.get('/:id/ban', requireRole('admin', 'moderator'), banUser);

// Suivre une utilisateur
router.post('/:id/follow', requireRole('user', 'moderator', 'admin'), followUser);

export default router;
