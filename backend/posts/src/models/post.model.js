import mongoose from 'mongoose';

// Schéma de publication (post utilisateur)
const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        trim: true // Supprime les espaces en début/fin
    },
    repostOf: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        default: null
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Fait référence à la collection "User"
    },
    createdAt: {
        type: Date,
        default: Date.now // Date de création automatique
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        text: {
            type: String,
            required: true,
            trim: true,
            maxlength: 280
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        replies: [{
            author: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            text: {
                type: String,
                required: true,
                trim: true,
                maxlength: 280
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }]
    }]
});

// Création du modèle Mongoose à partir du schéma
const Post = mongoose.model('Post', postSchema);

export default Post;
