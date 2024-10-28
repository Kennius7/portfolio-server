/* eslint-disable no-undef */
import express from 'express';
import cors from 'cors';
import { createHmac } from 'crypto';
import dotenv from 'dotenv';
import Paystack from 'paystack';


const app = express();
app.use(cors());
app.use(express.json())
dotenv.config();
// const port = 5000;
// const secret = "xxxxxxxxxxxxxxx";



const port = process.env.PORT;
const secret = process.env.SECRET_KEY;
const paystack = Paystack(secret);



app.get('/', (req, res) => {
    console.log(req.body); // Use req.body instead of req.data
    res.send('Hello, World!');
});

// app.post('/webhook/url', (req, res) => {
//     const hash = createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
//     if (hash == req.headers['x-paystack-signature']) {
//         console.log(req.body); // Use req.body instead of req.data
//     }

//     res.sendStatus(200); // Use res.sendStatus(200) instead of res.send(200)
// });

app.post('/webhook/url', async (req, res) => {
    try {
        const hash = createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
        if (hash === req.headers['x-paystack-signature']) {
            // Verify the event with Paystack
            const event = paystack.webhook.verify(req.rawBody, req.headers['x-paystack-signature']);

            // Handle different event types
            switch (event.event) {
                case 'charge.success':
                    console.log('Payment was successful');
                    break;
                case 'charge.failure':
                    console.log('Payment failed');
                    break;
                // Add more cases for other event types you want to handle

                default:
                    console.log('Unhandled event type:', event.event);
                    break;
            }
        }

        res.sendStatus(200);
    } catch (error) {
        console.error('Error processing Paystack webhook:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

