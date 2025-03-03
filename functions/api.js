import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';
import nodemailer from 'nodemailer';


const app = express();
const router =  express.Router()
app.use(cors());
app.use(express.json());
app.use((req, res, next)=>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    next();
})


router.get('/', (req, res) => {
    res.status(200).json({ success: true, message: 'Hello, World! My name is Kenny' });
});

// Configure the email transport
const transporter = nodemailer.createTransport({
    service: 'gmail', // e.g., 'gmail'
    auth: {
        user: 'shosanacodemia@gmail.com',
        pass: 'mgkr dhey vfry zdrc',
    },
    tls: {
        rejectUnauthorized: false, // Bypass SSL certificate validation
    },
});

// Handle POST request to send emails 
router.post('/send-email', (req, res) => {
    const formData = req.body;
    console.log(formData);
    const subject = formData.mainSubjectTitle || "Explore Stephen Feedback Emails";
    const htmlEmail = `
        <html>
            <body>
            <p>${formData.firstName} ${formData.lastName} just sent you a message with the following data:</p>
            <p>Subject: ${formData.subject}</p>
            <p>Message Body: ${formData.message}</p>
            <p>His/Her Phone/WhatSapp number is: ${formData.phone}</p>
            <p>His/Her Email address is: ${formData.email}</p>
            </body>
        </html>
    `;

    const mailOptions = {
        from: formData.email,
        to: ['shosanacodemia@gmail.com', formData.receiverEmail],
        subject: subject,
        html: htmlEmail,
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.status(500).json({ 
                success: false, 
                timeoutMessage: "Error: Request Timed Out. Check your network and try again.",
                errorMessage: "Error: Registration Failed.",
            });
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).json({ 
            success: true, 
            emailMessage: `Email sent successfully: ${info.response}`, 
            formMessage: 'Registration successful.'
            });
        }
    });
});


app.use("/.netlify/functions/api", router);
// eslint-disable-next-line no-undef
module.exports.handler = serverless(app);


