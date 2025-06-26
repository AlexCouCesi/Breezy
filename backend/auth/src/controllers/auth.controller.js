import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// Génère un access token de courte durée (2 minutes)
const generateAccessToken = (userId, email) => {
    return jwt.sign({ id: userId, email }, process.env.ACCESS_JWT_KEY, { expiresIn: '2m' });
};

// Génère un refresh token de plus longue durée (2 jours)
const generateRefreshToken = (email) => {
    return jwt.sign({ email }, process.env.REFRESH_JWT_KEY, { expiresIn: '2d' });
};

// Vérifie que le mot de passe respecte les critères de sécurité
const isStrongPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&€#\.])[A-Za-z\d@$!%*?&€#\.]{8,}$/;
    return regex.test(password);
};

// Crée un nouvel utilisateur après validation
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
        return res.status(201).json({ message: "Utilisateur créé", _id: newUser._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de l'inscription" });
    }
};

// Authentifie un utilisateur et renvoie un accessToken + refreshToken
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password)))
            return res.status(401).json({ error: "Identifiants invalides" });

        const accessToken = generateAccessToken(user._id, user.email);
        const refreshToken = generateRefreshToken(user.email);

        // Envoie sécurisé du refreshToken en cookie httpOnly
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

// Vérifie le token d'accès pour retourner les infos de l'utilisateur
export const authenticate = async (req, res) => {
    let token;
    const authHeader = req.headers["authorization"];
    if (authHeader?.startsWith("Bearer ")) {
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

        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        });
    } catch (err) {
        if (err.name === 'TokenExpiredError')
            return res.status(401).json({ message: "Token expiré " + err.message });

        return res.status(401).json({ message: "Token invalide " + err.message });
    }
};

// Rafraîchit le token d'accès à partir du refreshToken
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

// Retourne les infos utilisateur de l'utilisateur authentifié (utilise req.user injecté par un middleware)
export const me = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('username email avatar');
        if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });

        res.status(200).json({
            username: user.username,
            email: user.email,
            avatar: user.avatar || ''
        });
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Vérifie l'email
export const verifyEmail = (req, res) => {
    res.status(200).json({ message: "Email vérifié" });
};

// Supprime le cookie de refresh pour se déconnecter
export const logout = (req, res) => {
    res.clearCookie('refreshToken');
    res.status(200).json({ message: "Déconnexion réussie" });
};

// Retourne un profil utilisateur public (nom, avatar) depuis l'ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('username avatar');
        if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur' });
    }
};
