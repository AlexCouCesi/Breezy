import axios from 'axios';

// Middleware de validation de champs obligatoires dans req.body
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

// Middleware de vérification de rôle utilisateur via appel au service auth
export function requireRole(...roles) {
	return async (req, res, next) => {
		try {
			await authenticateUser(req, res);
			if (!roles.includes(req.user.role)) {
				return res.status(403).json({ error: 'Accès interdit' });
			}
			next();
		} catch (err) {
			return res.status(401).json({ error: 'Non authentifié' });
		}
	};
}

export function isSelfOrAdmin(req, res, next) {
	authenticateUser(req, res)
		.then(() => {
			const userIdFromToken = req.user?._id || req.user?.id;
			const userRole = req.user?.role;
			const userIdFromParams = req.params.id;

			if (userRole === 'admin' || userIdFromToken === userIdFromParams) {
				return next();
			}
			return res.status(403).json({ message: "Accès refusé." });
		})
		.catch(() => res.status(401).json({ error: 'Non authentifié' }));
}

export function protect(req, res, next) {
	authenticateUser(req, res)
		.then(() => next())
		.catch(() => res.status(401).json({ error: 'Non authentifié' }));
}

async function authenticateUser(req, res) {
	const token = req.headers.authorization;
	if (!token) throw new Error('Token manquant');

	try {
		const response = await axios.get('http://auth:4000/api/auth/authenticate', {
			headers: { Authorization: token }
		});
		req.user = response.data;
	} catch (error) {
		throw new Error('Token invalide ou authentification échouée');
	}
}
