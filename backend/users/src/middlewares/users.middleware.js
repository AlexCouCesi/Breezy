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
			await authenticateUser(req, res, next);
			// Vérifie si le rôle utilisateur est autorisé
			if (!roles.includes(req.user.role)) {
				return res.status(403).json({ error: 'Accès interdit' });
			}
			next();
		} catch (err) {
			// Erreur d'appel ou token invalide
			return res.status(401).json({ error: 'Non authentifié ' + err.message });
		}
	};
}

export async function isSelfOrAdmin(req, res, next) {
	try {
		await authenticateUser(req, res, next);

		const userIdFromToken = req.user?._id || req.user?.id;
		const userRole = req.user?.role;
		const userIdFromParams = req.params.id;

		if (userRole === 'admin' || userIdFromToken === userIdFromParams) {
			return next();
		}
		return res.status(403).json({ message: "Accès refusé." });
	} catch (error) {
		return res.status(401).json({ error: 'Non authentifié' });
	}
}

async function authenticateUser(req, res) {
	// Récupère le token JWT depuis les headers
	let token;
    const authHeader = req.headers["authorization"];
    if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    } else if (req.cookies?.accessToken) {
        token = req.cookies.accessToken;
    }

	// Appelle le service d'auth pour authentifier l'utilisateur
	try {
		console.log('Authentification avec token:', token);
		const response = await axios.get('http://auth:4000/api/auth/authenticate', {
			headers: { Authorization: 'Bearer ' + token }
		});
		// Attache l'utilisateur à req pour l'exploiter dans les contrôleurs suivants
		req.user = response.data;
	} catch (error) {
		throw new Error('Token invalide ou authentification échouée ' + error.message);
	}
}