import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';

import {
    register,
    login,
    logout,
    authenticate,
    refresh,
    verifyEmail,
    me,
    getUserById
} from '../controllers/auth.controller.js';

const router = express.Router();

// Route d'inscription (POST /register)
router.post('/register', register);

// Route de connexion (POST /login)
router.post('/login', login);

// Déconnexion : supprime le cookie de refreshToken (GET /logout)
router.get('/logout', logout);

// Vérification d'email (GET /verify)
router.get('/verify', verifyEmail);

// Authentifie un utilisateur à partir de son token (GET /authenticate)
router.get('/authenticate', authenticate);

// Rafraîchit un accessToken expiré à partir d’un refreshToken (GET /refresh)
router.get('/refresh', refresh);

// Récupère les infos de l'utilisateur connecté (GET /me)
// Protégé par un middleware JWT
router.get('/me', protect, me);

// Récupère un profil public à partir d’un ID utilisateur (GET /users/:id)
router.get('/users/:id', getUserById);

export default router;
