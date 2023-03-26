import dotenv from 'dotenv';
import express from 'express';

import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

dotenv.config();

connectDB();

app.use('/api/users', userRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log('Server running on port 4000');
});
