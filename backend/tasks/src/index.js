import express from 'express';
import mongoose from 'mongoose';
import tasksRouter from './routes/tasks.routes.js';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/tasks', tasksRouter);

// Test route
app.get('/', (req, res) => {
    res.send('Hello from tasks service!');
});

// Mongo connection + server start
mongoose
    .connect(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE_NAME}`)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(port, () => {
        console.log(`Tasks service running at http://localhost:${port}`);});
    })
    .catch((err) => {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
    });
