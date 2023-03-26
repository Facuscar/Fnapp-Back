import dotenv from 'dotenv';
import express from 'express';

import connectDB from './config/db.js';

const app = express();

dotenv.config();

connectDB();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log('Server running on port 4000');
});
