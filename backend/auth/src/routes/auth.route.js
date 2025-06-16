import express from 'express';
import { body } from 'express-validator';
import { register, verifyEmail, login } from '../controllers/auth.controller.js';
const router = express.Router();

// POST /api/auth/register
router.post(
    '/register',
    [
    body('username')
        .isLength({ min: 3, max: 30 })
        .withMessage('Le nom doit comporter entre 3 et 30 caractères'),
    body('email').isEmail().withMessage('Email invalide'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Le mot de passe doit faire au moins 6 caractères'),
    ],
    register
);

// GET /api/auth/verify/:token
router.get('/verify/:token', verifyEmail);

// POST /api/auth/login
router.post(
    '/login',
    [
    body('email').isEmail().withMessage('Email invalide'),
    body('password').notEmpty().withMessage('Mot de passe requis'),
    ],
    login
);

export default router;