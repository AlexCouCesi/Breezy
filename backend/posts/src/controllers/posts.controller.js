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

export const deleteComment = async (req, res) => {
    const userId = req.user?.id;
    const { postId, commentId } = req.params;

    console.log("🧪 Tentative suppression commentaire :", { postId, commentId, userId });

    try {
        const post = await Post.findById(postId);
        if (!post) {
            console.warn("❌ Post introuvable :", postId);
            return res.status(404).json({ error: 'Post introuvable' });
        }

        const comment = post.comments.id(commentId);
        if (!comment) {
            console.warn("❌ Commentaire introuvable :", commentId);
            return res.status(404).json({ error: 'Commentaire introuvable' });
        }

        if (comment.author.toString() !== userId) {
            console.warn("⛔ Utilisateur non autorisé :", userId);
            return res.status(403).json({ error: 'Action non autorisée' });
        }

        // ✅ Supprime proprement le commentaire sans .remove()
        post.comments = post.comments.filter(c => c._id.toString() !== commentId);
        await post.save();

        // Recharge le post mis à jour
        const updatedPost = await Post.findById(postId);
        res.status(200).json(updatedPost);
    } catch (err) {
        console.error("🔥 Erreur lors de deleteComment :", err);
        res.status(500).json({ error: 'Erreur serveur : ' + err.message });
    }
};

export const deleteReply = async (req, res) => {
    const userId = req.user?.id;
    const { postId, commentId, replyId } = req.params;

    console.log("🧪 Tentative suppression réponse :", { postId, commentId, replyId, userId });

    try {
        const post = await Post.findById(postId);
        if (!post) {
            console.warn("❌ Post introuvable :", postId);
            return res.status(404).json({ error: 'Post introuvable' });
        }

        const comment = post.comments.id(commentId);
        if (!comment) {
            console.warn("❌ Commentaire introuvable :", commentId);
            return res.status(404).json({ error: 'Commentaire introuvable' });
        }

        const reply = comment.replies.id(replyId);
        if (!reply) {
            console.warn("❌ Réponse introuvable :", replyId);
            return res.status(404).json({ error: 'Réponse introuvable' });
        }

        if (reply.author.toString() !== userId) {
            console.warn("⛔ Utilisateur non autorisé à supprimer la réponse");
            return res.status(403).json({ error: 'Action non autorisée' });
        }

        // Supprimer proprement sans utiliser .remove()
        comment.replies = comment.replies.filter(r => r._id.toString() !== replyId);
        await post.save();

        // Recharger le post mis à jour
        const updatedPost = await Post.findById(postId);
        res.status(200).json(updatedPost);
    } catch (err) {
        console.error("🔥 Erreur lors de deleteReply :", err);
        res.status(500).json({ error: 'Erreur serveur : ' + err.message });
    }
};
