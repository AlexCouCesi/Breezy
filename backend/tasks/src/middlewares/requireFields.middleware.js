import axios from 'axios';

export function requireFields(fields) {
    return (req, res, next) => {
        const missingFields = fields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                error: `Les champs suivants sont requis : ${missingFields.join(', ')}`
            });
        }
        next(); 
    };
}

// vérifie si l'utilisateur a un rôle spécifique
export function requireRole(...roles) {
  return async (req, res, next) => {
    try {
      // Récupère le token depuis les headers
      const token = req.headers.authorization;
      if (!token) return res.status(401).json({ error: 'Token manquant' });

      // Appel au service auth pour valider le token et obtenir le rôle
      const response = await axios.get('http://auth:4000/api/auth/authenticate', {
        headers: { Authorization: token }
      });

      const user = response.data;
      if (!roles.includes(user.role)) {
        return res.status(403).json({ error: 'Accès interdit' });
      }

      // Ajoute l'utilisateur à la requête pour les middlewares suivants
      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Non authentifié' });
    }
  };
}