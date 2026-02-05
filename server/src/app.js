import 'dotenv/config';
import express from 'express';
import stripeRoute from './routes/stripe.js';

import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 6767;

app.use(cors({
    origin: '*'
}));
app.use(express.json());
app.use('/api', stripeRoute);

app.get('/', (req, res) => {
    res.json({ 
        message: 'yes, and this is the server!'
     });
});

app.listen(PORT, () => {
    console.log(`The server is currently running on: http://localhost:${PORT}`);
});