import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const generateAccessToken = (userId, email) => {
    return jwt.sign({ id: userId, email }, process.env.ACCESS_JWT_KEY, { expiresIn: '2m' });
};

const generateRefreshToken = (email) => {
    return jwt.sign({ email }, process.env.REFRESH_JWT_KEY, { expiresIn: '2d' });
};

const isStrongPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&€#])[A-Za-z\d@$!%*?&€#]{8,}$/;
    return regex.test(password);
};

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password)
            return res.status(400).json({ error: "Champs requis manquants" });

        if (!isStrongPassword(password))
            return res.status(400).json({
                error: "Mot de passe trop faible (8+ caractères, majuscule, chiffre, symbole)"
            });

        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ error: "Email déjà utilisé" });

        const newUser = await User.create({ username, email, password });
        return res.status(201).json({ message: "Utilisateur créé !" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de l'inscription" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password)))
            return res.status(401).json({ error: "Identifiants invalides" });

        const accessToken = generateAccessToken(user._id, user.email);
        const refreshToken = generateRefreshToken(user.email);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 2 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({ accessToken });
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la connexion" });
    }
};

export const authenticate = async (req, res) => {
    let token;
    const authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    } else if (req.cookies?.accessToken) {
        token = req.cookies.accessToken;
    }

    if (!token)
        return res.status(401).json({ message: "Non autorisé" });

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_JWT_KEY);
        const user = await User.findOne({ email: decoded.email });
        if (!user) return res.status(401).json({ message: "Utilisateur introuvable" });

        res.sendStatus(200);
    } catch (err) {
        if (err.name === 'TokenExpiredError')
            return res.status(401).json({ message: "Token expiré" });

        return res.status(401).json({ message: "Token invalide" });
    }
};

export const refresh = async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken)
        return res.status(401).json({ message: "Non autorisé" });

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_JWT_KEY);
        const user = await User.findOne({ email: decoded.email });
        if (!user) return res.sendStatus(401);

        const newAccessToken = generateAccessToken(user._id, user.email);
        const newRefreshToken = generateRefreshToken(user.email);

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 2 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({ accessToken: newAccessToken });
    } catch {
        res.sendStatus(401);
    }
};

export const me = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('username email avatar');
        if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });
        res.status(200).json({
        username: user.username,
        email: user.email,
        avatar: user.avatar || '' // ou '/assets/default-avatar-white.png'
        });
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

export const verifyEmail = (req, res) => {
    res.status(200).json({ message: "Email vérifié" });
};

export const logout = (req, res) => {
    res.clearCookie('refreshToken');
    res.status(200).json({ message: "Déconnexion réussie" });
};  
