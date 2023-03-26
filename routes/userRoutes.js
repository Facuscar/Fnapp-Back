import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
   res.send('From the API');
});

export default router;