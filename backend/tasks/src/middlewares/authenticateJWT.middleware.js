import jwt from 'jsonwebtoken';

export default function authenticateJWT(req, res, next) {
    const token = req.cookies?.accessToken; // ← lit dans le cookie

    if (!token) {
        return res.status(401).json({ error: 'Token manquant ou invalide' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Token invalide ou expiré' });
    }
}