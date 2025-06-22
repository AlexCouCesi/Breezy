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

        const alreadyLiked = post.likes.some(id => id.toString() === userId);
        if (alreadyLiked) {
            post.likes = post.likes.filter(id => id.toString() !== userId);
        } else {
            post.likes.push(userId);
        }
        await post.save();
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Republie ou annule la republication d'un post
export const sharePost = async (req, res) => {
    const userId = req.user?.id;

    try {
        const originalPost = await Post.findById(req.params.id);
        if (!originalPost) return res.status(404).json({ error: 'Post not found' });

        // Vérifie si l'utilisateur a déjà partagé ce post
        const alreadyShared = await Post.findOne({ author: userId, repostOf: originalPost._id });
        if (alreadyShared) {
            // Supprimer la republication
            await Post.findByIdAndDelete(alreadyShared._id);
            return res.status(200).json({ message: 'Republication supprimée' });
        }

        // Crée un nouveau post de republication
        const sharedPost = new Post({
            author: userId,
            repostOf: originalPost._id,
            content: '', // Vide ou personnalisé si tu veux laisser un message en plus
        });

        await sharedPost.save();
        res.status(201).json({ message: 'Post republicated', post: sharedPost });

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