import express from 'express';
import multer from 'multer';
import {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    banUser,
    followUser,
    unfollowUser,
    getFollowing
} from '../controllers/users.controller.js';

import {
    requireFields,
    requireRole,
    isSelfOrAdmin,
} from '../middlewares/users.middleware.js';

import { protect } from '../middlewares/users.middleware.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/profile-pictures/' });

// Créer un utilisateur (requiert username, email et _id)
router.post('/', requireFields(['username', 'email', '_id']), createUser);

// Récupérer tous les utilisateurs
router.get('/', getAllUsers);

// Récupérer un utilisateur par son ID
router.get('/:id', getUserById);

// Mettre à jour un utilisateur (requiert username et email)
router.put('/:id', isSelfOrAdmin, upload.single('photo'), updateUser);

// Supprimer un utilisateur
router.delete('/:id', isSelfOrAdmin, deleteUser);

// Bannir un utilisateur (réservé aux admins et modérateurs)
router.post('/:id/ban', requireRole('admin', 'moderator'), banUser);

// S'abonner à un utilisateur (protégé par authentification + rôle)
router.post('/:id/follow', protect, requireRole('user', 'moderator', 'admin'), followUser);

// Se désabonner d'un utilisateur (DELETE plus propre que POST)
router.delete('/:id/follow', protect, requireRole('user', 'moderator', 'admin'), unfollowUser);

// Récupérer la liste des comptes suivis par un utilisateur
router.get('/:id/following', protect, getFollowing);

export default router;
