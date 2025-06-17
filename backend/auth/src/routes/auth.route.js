import express from 'express';
import {
    register,
    login,
    authenticate,
    refresh,
    verifyEmail
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify', verifyEmail);
router.get('/authenticate', authenticate);
router.get('/refresh', refresh);

export default router;
