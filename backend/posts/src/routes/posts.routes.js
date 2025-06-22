import express from 'express';
import {
    createPost,
    getAllPosts,
    likePost,
    addComment,
    replyToComment
} from '../controllers/posts.controller.js';
import authenticateJWT from '../middlewares/authenticateJWT.middleware.js';

const router = express.Router();

// Route POST /api/posts/
// Création d'un nouveau post (authentification requise via JWT dans les cookies)
router.post('/', authenticateJWT, createPost);

// Route GET /api/posts/
// Récupération de tous les posts (accessible publiquement)
router.get('/', getAllPosts);

// Liker ou unliker un post
router.post('/:id/like', authenticateJWT, likePost);

// Ajouter un commentaire à un post
router.post('/:id/comment', authenticateJWT, addComment);

// Répondre à un commentaire existant
router.post('/:postId/comments/:commentId/reply', authenticateJWT, replyToComment);

export default router;
