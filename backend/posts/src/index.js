import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import postsRouter from './routes/posts.routes.js';
import mongoose from 'mongoose';

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB connecté pour tasks"))
.catch(err => console.error("Erreur MongoDB tasks:", err));

const app = express();

// Configuration CORS : autorise les requêtes du reverse proxy
app.use(cors({
    origin: 'http://localhost:8080', // NGINX
    credentials: true               // Permet l'envoi des cookies
}));

// Middleware pour parser les cookies
app.use(cookieParser());

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Route principale du microservice posts
app.use('/api/posts', postsRouter);

// Lancement du serveur
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Tasks service is running on port ${PORT}`);
});
