import express from 'express';
import {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    banUser,
    followUser,
    unfollowUser
} from '../controllers/users.controller.js';

import {
    requireFields,
    requireRole
} from '../middlewares/requireFields.middleware.js';

const router = express.Router();

// Créer un utilisateur (requiert username, email et _id)
router.post('/', requireFields(['username', 'email', '_id']), createUser);

// Récupérer tous les utilisateurs
router.get('/', getAllUsers);

// Récupérer un utilisateur par son ID
router.get('/:id', getUserById);

// Mettre à jour un utilisateur (requiert username et email)
router.put('/:id', requireFields(['username', 'email']), updateUser);

// Supprimer un utilisateur
router.delete('/:id', deleteUser);

// Bannir un utilisateur (réservé aux admins et modérateurs)
router.get('/:id/ban', requireRole('admin', 'moderator'), banUser);

// Suivre un utilisateur (rôle requis : user ou plus)
router.post('/:id/follow', requireRole('user', 'moderator', 'admin'), followUser);

// Ne plus suivre un utilisateur (mêmes rôles requis)
router.post('/:id/unfollow', requireRole('user', 'moderator', 'admin'), unfollowUser);

export default router;
