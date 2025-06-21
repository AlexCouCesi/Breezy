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

// Récupère tous les posts, triés par date décroissante
export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
