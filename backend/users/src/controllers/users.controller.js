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

// Récupère l'utilisateur connecté (via le token JWT)
export const getConnectedUser = async (req, res) => {
    try {
        const userId = req.user._id; // L'ID de l'utilisateur est extrait du token JWT
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' + userId });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Met à jour un utilisateur
export const updateUser = async (req, res) => {
    try {
        const updateData = { ...req.body };

        // Si une nouvelle photo a été uploadée, ajoute son chemin/URL
        if (req.file) {
            updateData.profilePicture = req.file.path;
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

// Suivre un autre utilisateur
export const followUser = async (req, res) => {
    try {
        const followerId = req.user?._id;
        const followedId = req.params.id;

        if (!followerId || !followedId) {
            return res.status(400).json({ error: 'ID manquant dans la requête.' });
        }

        if (followerId === followedId) {
            return res.status(400).json({ error: "Vous ne pouvez pas vous suivre vous-même." });
        }

        const follower = await User.findById(followerId);
        const followed = await User.findById(followedId);

        if (!follower || !followed) {
            return res.status(404).json({ error: "Utilisateur non trouvé." });
        }

        if (followed.followers.includes(followerId)) {
            return res.status(400).json({ error: "Déjà abonné à cet utilisateur." });
        }

        followed.followers.push(followerId);
        follower.following.push(followedId);

        await followed.save();
        await follower.save();

        res.status(200).json({ message: `Suivi de ${followed.username} réussi.` });
    } catch (err) {
        console.error("Erreur dans followUser :", err);
        res.status(500).json({ error: err.message });
    }
};

// Se désabonner d’un utilisateur
export const unfollowUser = async (req, res) => {
    try {
        const followerId = req.user?._id;
        const followedId = req.params.id;

        if (!followerId || !followedId) {
            return res.status(400).json({ error: 'ID manquant.' });
        }

        if (followerId === followedId) {
            return res.status(400).json({ error: "Impossible de se désabonner de soi-même." });
        }

        const follower = await User.findById(followerId);
        const followed = await User.findById(followedId);

        if (!follower || !followed) {
            return res.status(404).json({ error: "Utilisateur non trouvé." });
        }

        if (!followed.followers.includes(followerId)) {
            return res.status(400).json({ error: "Vous ne suivez pas cet utilisateur." });
        }

        // Ne pas utiliser ObjectId ici, Mongoose gère déjà les types
        followed.followers.pull(followerId);
        follower.following.pull(followedId);

        await followed.save();
        await follower.save();

        res.status(200).json({ message: `Désabonnement de ${followed.username} effectué.` });
    } catch (err) {
        console.error("Erreur dans unfollowUser :", err);
        res.status(500).json({ error: err.message });
    }
};
