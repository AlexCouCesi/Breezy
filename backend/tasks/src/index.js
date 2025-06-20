import express from 'express';
import cors from 'cors';
import postsRouter from './routes/posts.routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/posts', postsRouter); // ← c’est ici qu’il échouait

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Tasks service is running on port ${PORT}`);
});
