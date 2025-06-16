import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const register = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;

        if (!email || !password || !confirmPassword) {
        return res.status(400).json({ error: "Tous les champs sont requis" });
        }

        if (password !== confirmPassword) {
        return res.status(400).json({ error: "Les mots de passe ne correspondent pas" });
        }

        if (password.length < 6) {
        return res.status(400).json({ error: "Le mot de passe doit faire au moins 6 caractères" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
        return res.status(400).json({ error: "Email déjà utilisé" });
        }

        const newUser = await User.create({ email, password });
        const token = generateToken(newUser._id);

        res.status(201).json({ token });
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de l'inscription" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ error: 'Identifiants invalides' });
        }
        const token = generateToken(user._id);
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
    };

    export const verifyEmail = (req, res) => {
    res.status(200).json({ message: "Email vérifié" });
};
