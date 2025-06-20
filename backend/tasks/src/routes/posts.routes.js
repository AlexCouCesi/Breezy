import express from 'express';
import { createPost, getAllPosts } from '../controllers/posts.controller.js';
import authenticateJWT from '../middlewares/authenticateJWT.js';

const router = express.Router();

// Créer un post (authentifié)
router.post('/', authenticateJWT, createPost);

// Récupérer tous les posts (public)
router.get('/', getAllPosts);

export default router;