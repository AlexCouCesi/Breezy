import express from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/users.routes.js';
import cookieParser from 'cookie-parser';

const app = express();
const port = process.env.PORT || 5000;

// Middleware global : parse les corps JSON
app.use(express.json());

// Middleware pour parser les cookies
app.use(cookieParser());

// Route principale pour la gestion des utilisateurs
app.use('/api/users', usersRouter);

// Connexion à MongoDB suivie du démarrage du serveur
mongoose
    .connect(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE_NAME}`)
    .then(() => {
        console.log('Connected to MongoDB');

        app.listen(port, () => {
            console.log(`Users service running at http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection failed:', err);
        process.exit(1); // Arrêt du processus si échec de la BDD
    });
