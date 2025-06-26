import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.route.js';

// Chargement des variables d'environnement (.env)
dotenv.config();

const app = express();

// Middleware CORS : autorise les requêtes du frontend (port 3000)
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true // Autorise l'envoi de cookies
}));

// Middleware pour parser le corps des requêtes JSON
app.use(express.json());

// Middleware pour parser les formulaires
app.use(express.urlencoded({ extended: true }));

// Middleware pour parser les cookies (utile pour le refreshToken)
app.use(cookieParser());

// Routes d'authentification sous le préfixe /api/auth
app.use('/api/auth', authRouter);

// Connexion à MongoDB puis lancement du serveur
const PORT = process.env.PORT || 4000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');
        app.listen(PORT, () => console.log(`Auth server running on port ${PORT}`));
    })
    .catch(err => {
        console.error('DB connection error:', err);
        process.exit(1); // Quitte le process si la BDD échoue
    });
