import User from '../models/user.model.js';

// Crée un nouvel utilisateur (données publiques venant du service auth)
export const createUser = async (req, res) => {
    const { username, email, _id } = req.body;
    try {
        const newUser = new User({ username, email, _id });
        await newUser.save();
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récupère tous les utilisateurs
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Récupère un utilisateur par son ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Met à jour un utilisateur
export const updateUser = async (req, res) => {
    try {
        const updateData = { ...req.body };

        // Si une nouvelle photo a été uploadée, ajoute son chemin/URL
        if (req.file) {
            updateData.profilePicture = req.file.path; // ou adapte selon ton besoin (URL publique, etc.)
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        if (!updatedUser) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Supprime un utilisateur
// ne le supprime pas dans la bdd d'authentification
export const deleteUser = async (req, res) => {
    try {
        const deleted = await User.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'User not found' });
        res.status(204).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// TODO : bannir un utilisateur
export const banUser = async (req, res) => {
    res.status(200).json({ message: `Utilisateur ${req.params.id} banni` });
};

// Suivre un autre utilisateur
export const followUser = async (req, res) => {
    const followerId = req.user.id;       // L'utilisateur connecté
    const followedId = req.params.id;     // L'utilisateur à suivre

    if (!followerId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const follower = await User.findById(followerId);
        const followed = await User.findById(followedId);
        if (!follower || !followed) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (followed.followers.includes(followerId)) {
            return res.status(400).json({ error: 'You are already following this user' });
        }

        followed.followers.push(followerId);
        follower.following.push(followedId);

        await follower.save();
        await followed.save();

        res.status(200).json({ message: `User ${followerId} followed user ${followedId}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Se désabonner d’un utilisateur
export const unfollowUser = async (req, res) => {
    const followerId = req.user.id;       // L'utilisateur connecté
    const followedId = req.params.id;     // L'utilisateur à désuivre

    if (!followerId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const follower = await User.findById(followerId);
        const followed = await User.findById(followedId);
        if (!follower || !followed) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!followed.followers.includes(followerId)) {
            return res.status(400).json({ error: 'You are not following this user' });
        }

        followed.followers.pull(followerId);
        follower.following.pull(followedId);

        await follower.save();
        await followed.save();

        res.status(200).json({ message: `User ${followerId} unfollowed user ${followedId}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
