import express from 'express';
import { createPost, getAllPosts } from '../controllers/posts.controller.js';
import authenticateJWT from '../middlewares/authenticateJWT.middleware.js';

const router = express.Router();

// Route POST /api/posts/
// Création d'un nouveau post (authentification requise via JWT dans les cookies)
router.post('/', authenticateJWT, createPost);

// Route GET /api/posts/
// Récupération de tous les posts (accessible publiquement)
router.get('/', getAllPosts);

export default router;
