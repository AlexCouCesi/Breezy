import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import usersRouter from './routes/users.routes.js';

const app = express();
const port = process.env.PORT || 3002;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB for users');
  app.listen(port, () => {
    console.log(`Users service running on http://localhost:${port}`);
  });
})
.catch((err) => {
  console.error('MongoDB connection failed:', err);
  process.exit(1);
});

app.use(cors({ origin: 'http://localhost:8080', credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use('/api/users', usersRouter);
