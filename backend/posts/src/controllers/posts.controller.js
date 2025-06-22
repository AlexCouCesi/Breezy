import Post from '../models/post.model.js';

// Crée un nouveau post
export const createPost = async (req, res) => {
    const { content } = req.body;
    const author = req.user?.id; // Récupéré depuis le middleware JWT

    // Vérifie que le contenu est présent et respecte la limite
    if (!content || content.length > 250) {
        return res.status(400).json({
            error: 'Le contenu du post est requis et doit contenir au maximum 250 caractères.'
        });
    }

    try {
        const newPost = new Post({ content, author });
        await newPost.save();
        res.status(201).json({ message: 'Post publié avec succès', post: newPost });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Like/unlike un post
export const likePost = async (req, res) => {
    const userId = req.user?.id;
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        const index = post.likes.indexOf(userId);
        let message;
        if (index === -1) {
            post.likes.push(userId);
            message = 'Like ajouté';
        } else {
            post.likes.splice(index, 1);
            message = 'Like retiré';
        }
        await post.save();
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Ajoute un commentaire à un post
export const addComment = async (req, res) => {
    const userId = req.user?.id;
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'Commentaire requis' });
    }
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        post.comments.push({ author: userId, text });
        await post.save();
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Répond à un commentaire sous un post
export const replyToComment = async (req, res) => {
    const userId = req.user?.id;
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'Réponse requise' });
    }
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        const comment = post.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ error: 'Commentaire introuvable' });
        comment.replies.push({ author: userId, text });
        await post.save();
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Récupère tous les posts, triés par date décroissante
export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Republie un post existant
export const repostPost = async (req, res) => {
    const userId = req.user?.id;
    try {
        const original = await Post.findById(req.params.id);
        if (!original) return res.status(404).json({ error: 'Post not found' });

        const newPost = new Post({
            content: original.content,
            author: userId,
            repostOf: original._id
        });
        await newPost.save();
        res.status(201).json({ message: 'Post republié', post: newPost });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Supprime un post (ou une republication)
export const deletePost = async (req, res) => {
    const userId = req.user?.id;
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        if (post.author.toString() !== userId) {
            return res.status(403).json({ error: 'Action non autorisée' });
        }
        await Post.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Récupère les posts d'un utilisateur spécifique
export const getPostsByUser = async (req, res) => {
    try {
        const posts = await Post.find({ author: req.params.userId }).sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};