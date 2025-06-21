import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import postsRouter from './routes/posts.routes.js';
import mongoose from 'mongoose';
import usersRouter from './routes/users.routes.js';

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB connecté pour tasks"))
.catch(err => console.error("Erreur MongoDB tasks:", err));

const app = express();

app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use('/api/posts', postsRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Tasks service is running on port ${PORT}`);
});
// Routes
app.use('/api/users', usersRouter);

// Mongo connection + server start
mongoose
    .connect(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE_NAME}`)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(port, () => {
        console.log(`Users service running at http://localhost:${port}`);});
    })
    .catch((err) => {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
    });
