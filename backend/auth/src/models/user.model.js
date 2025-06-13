import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
    unique: true,
    trim: true
    },
    email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
    },
    passwordHash: {
    type: String,
    required: true
    },
    isVerified: {
    type: Boolean,
    default: false
    },
    verificationToken: String,
}, { timestamps: true });

// Méthode pour comparer un mot de passe
userSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.passwordHash);
};

export default mongoose.model('User', userSchema);