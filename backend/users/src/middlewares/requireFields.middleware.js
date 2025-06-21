import axios from 'axios';

// Middleware de validation de champs obligatoires dans req.body
export function requireFields(fields) {
    return (req, res, next) => {
        // Filtre les champs manquants dans la requête
        const missingFields = fields.filter(field => !req.body[field]);

        // S'il en manque, renvoie une erreur 400
        if (missingFields.length > 0) {
            return res.status(400).json({
                error: `Les champs suivants sont requis : ${missingFields.join(', ')}`
            });
        }

        // Sinon, passe au middleware suivant
        next(); 
    };
}

// Middleware de vérification de rôle utilisateur via appel au service auth
export function requireRole(...roles) {
  return async (req, res, next) => {
    try {
      // Récupère le token JWT depuis les headers
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ error: 'Token manquant' });
      }

      // Appelle le service d'auth pour authentifier l'utilisateur
      const response = await axios.get('http://auth:4000/api/auth/authenticate', {
        headers: { Authorization: token }
      });

      const user = response.data;

      // Vérifie si le rôle utilisateur est autorisé
      if (!roles.includes(user.role)) {
        return res.status(403).json({ error: 'Accès interdit' });
      }

      // Attache l'utilisateur à req pour l'exploiter dans les contrôleurs suivants
      req.user = user;
      next();
    } catch (err) {
      // Erreur d'appel ou token invalide
      return res.status(401).json({ error: 'Non authentifié' });
    }
  };
}
