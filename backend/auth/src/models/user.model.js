import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Définition du schéma utilisateur
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,          // Supprime les espaces inutiles
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,        // Unicité garantie dans la collection
        lowercase: true,     // Force l’email en minuscules
        trim: true,
        match: [/.+@.+\..+/, 'Email invalide'] // Validation basique d'email
    },
    password: {
        type: String,
        required: true,
        minlength: 6         // Protection de base (renforcée ailleurs par regex)
    },
    avatar: {
        type: String,
        default: ''          // Champ optionnel pour l'image de profil
    },
    role: {
        type: String,
        enum: ['user', 'moderator', 'admin'],
        default: 'user'
    }
}, {
    timestamps: true        // Ajoute automatiquement createdAt et updatedAt
});

// Middleware : hash du mot de passe avant enregistrement
userSchema.pre('save', async function (next) {
    // Si le mot de passe n’a pas été modifié, on ne le re-hash pas
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Méthode d’instance pour comparer un mot de passe candidat avec le hash stocké
userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
