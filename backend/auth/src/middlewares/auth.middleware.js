import jwt from 'jsonwebtoken';

// Middleware pour protéger les routes nécessitant une authentification
export const protect = (req, res, next) => {
    const auth = req.headers.authorization;

    // Vérifie la présence du header Authorization et qu'il commence par "Bearer "
    if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Accès refusé' });
    }

    try {
        // Extraction et vérification du token avec la clé secrète
        const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);

        // Attache l'utilisateur décodé à la requête pour qu'il soit accessible dans les contrôleurs
        req.user = decoded;

        // Passe au middleware suivant ou au contrôleur
        next();
    } catch {
        // Si la vérification échoue (token expiré, falsifié, etc.)
        res.status(401).json({ error: 'Token invalide' });
    }
};
