import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

require('dotenv').config

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connecté'))
    .catch((err) => console.error(err));

// Routes ici
app.use('/api/users', require('./routes/userRoutes'));

app.listen(5000, () => console.log('Serveur backend sur http://localhost:5000'));
