import express from 'express';
import {
    createPost,
    getAllPosts,
    getPostsByUser,
    likePost,
    addComment,
    replyToComment,
    repostPost,
    deletePost
} from '../controllers/posts.controller.js';
import authenticateJWT from '../middlewares/authenticateJWT.middleware.js';

const router = express.Router();

// Route POST /api/posts/
// Création d'un nouveau post (authentification requise via JWT dans les cookies)
router.post('/', authenticateJWT, createPost);

// Route GET /api/posts/
// Récupération de tous les posts (accessible publiquement)
router.get('/', getAllPosts);

// Récupérer les posts d'un utilisateur
router.get('/user/:userId', getPostsByUser);

// Liker ou unliker un post
router.post('/:id/like', authenticateJWT, likePost);

// Ajouter un commentaire à un post
router.post('/:id/comment', authenticateJWT, addComment);

// Répondre à un commentaire existant
router.post('/:postId/comments/:commentId/reply', authenticateJWT, replyToComment);

// Republier un post existant
router.post('/:id/repost', authenticateJWT, repostPost);

// Republier un post
router.post('/:id/repost', authenticateJWT, repostPost);

// Supprimer un post ou une republication
router.delete('/:id', authenticateJWT, deletePost);

export default router;
