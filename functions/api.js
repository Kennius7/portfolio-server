import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';


const app = express();
const router =  express.Router()
app.use(cors());
app.use(express.json());




router.get('/', (req, res) => {
    res.status(200).json({ success: true, message: 'Hello, World!' });
});



app.use("/.netlify/functions/api", router);
// eslint-disable-next-line no-undef
module.exports.handler = serverless(app);












