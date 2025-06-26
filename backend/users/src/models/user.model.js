import mongoose from 'mongoose';

// Schéma public d’un utilisateur
const userSchema = new mongoose.Schema({
    // Utilise l’_id fourni depuis le service d’authentification
    _id: String,
    // Nom d’utilisateur public
    username: String,
    // Email associé
    email: String,
    // Biographie courte
    biography: String,
    // Photo de profil (URL)
    profilePicture: String,
    // Liste des utilisateurs qui suivent ce compte
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }
    ],    
    // Liste des utilisateurs suivis par ce compte
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }
    ]
});

// Création du modèle Mongoose
const User = mongoose.model('User', userSchema);

export default User;
