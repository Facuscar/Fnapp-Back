import dotenv from 'dotenv';
import express from 'express';

import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

dotenv.config();

connectDB();

const whitelist =  [process.env.WHITELISTED_URL];

const corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.includes(origin)) {
        callback(null, true)
    } else {
        callback(new Error('Cors error'));
    }
},
}

app.use(corsOptions);

app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log('Server running on port 4000');
});
