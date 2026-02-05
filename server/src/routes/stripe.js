import express from 'express';
import { initiatePaymentIntent } from '../controllers/stripeController.js'

const router = express.Router();

router.post('/create-payment-intent', initiatePaymentIntent);

export default router;