import jwt from 'jsonwebtoken';

// Middleware pour valider un access token JWT présent dans les cookies
export default function authenticateJWT(req, res, next) {
    const token = req.cookies?.accessToken;

    // Vérifie la présence du token dans les cookies
    if (!token) {
        return res.status(401).json({ error: 'Token manquant ou invalide' });
    }

    try {
        // Vérifie et décode le token avec la clé secrète
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attache les données décodées à req.user pour les routes suivantes
        req.user = decoded;

        // Continue vers le prochain middleware ou contrôleur
        next();
    } catch (err) {
        // Token présent mais non valide (ex: expiré ou modifié)
        return res.status(403).json({ error: 'Token invalide ou expiré' });
    }
}
