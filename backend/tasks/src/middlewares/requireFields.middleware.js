export default function requireFields(fields) {
    return (req, res, next) => {
        const missingFields = fields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                error: `Les champs suivants sont requis : ${missingFields.join(', ')}`
            });
        }
        next(); // il manquait cette ligne !
    };
}
