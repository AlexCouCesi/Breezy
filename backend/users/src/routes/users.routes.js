import express from 'express';
import multer from 'multer';
import {
    createUser,
    getAllUsers,
    getUserById,
    getConnectedUser,
    updateUser,
    deleteUser,
    banUser,
    followUser,
    unfollowUser,
} from '../controllers/users.controller.js';

import {
    requireFields,
    requireRole,
    isSelfOrAdmin
} from '../middlewares/users.middleware.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/profile-pictures/' });

// Créer un utilisateur (requiert username, email et _id)
router.post('/', requireFields(['username', 'email', '_id']), createUser);

// Récupérer tous les utilisateurs
router.get('/', getAllUsers);

// Récupérer l'utilisateur connecté (via le token JWT)
// Placé avant /:id pour ne pas avoir de conflit
router.get('/me', requireRole('user', 'moderator', 'admin'), getConnectedUser);

// Récupérer un utilisateur par son ID
router.get('/:id', getUserById);

// Mettre à jour un utilisateur (requiert username et email)
router.put('/:id', isSelfOrAdmin, upload.single('photo'), updateUser);

// Supprimer un utilisateur
router.delete('/:id', isSelfOrAdmin, deleteUser);

// Bannir un utilisateur (réservé aux admins et modérateurs)
router.post('/:id/ban', requireRole('admin', 'moderator'), banUser);

// Suivre un utilisateur (rôle requis : user ou plus)
router.post('/:id/follow', requireRole('user', 'moderator', 'admin'), followUser);

// Ne plus suivre un utilisateur (mêmes rôles requis)
router.post('/:id/unfollow', requireRole('user', 'moderator', 'admin'), unfollowUser);

export default router;
