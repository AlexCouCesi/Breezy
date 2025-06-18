import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';

import {
    register,
    login,
    logout,
    authenticate,
    refresh,
    verifyEmail,
    me
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/verify', verifyEmail);
router.get('/authenticate', authenticate);
router.get('/refresh', refresh);
router.get('/me', protect, me);

export default router;
