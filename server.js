const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const { doc, getDoc, setDoc } = require('firebase/firestore');
const { db } = require('./FirebaseConfig');



dotenv.config();
const PORT = process.env.PORT || 3300;
const app = express();
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.status(200).json({ success: true, message: "I'm building this server for portfolios" });
});

app.get("/passadmin", (req, res)=>{
    const userNameEnv = process.env.USER_NAME;
    const passwordEnv = process.env.PASSWORD;
    if (userNameEnv.length === 6 && passwordEnv.length === 14) {
        res.status(200).json({ 
            success: true, 
            msg: "Credentials fetched successfully", 
            data: { 
                userName: process.env.USER_NAME, 
                password: process.env.PASSWORD,
            } 
        });
    } else {
        res.status(500).json({ success: false, errMsg: "Credentials fetching failed" });
    }
})

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
app.post('/send-email', (req, res) => {
    const formData = req.body;
    console.log(formData);
    const subject = "Shosan Code Hub Class Registrations";
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
        from: 'shosanacodemia@gmail.com',
        to: 'shosanacodemia@gmail.com',
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

// API endpoint to serve countdown data
app.get('/countdown', async (req, res) => {
    const getDateRef = doc(db, "Current-Date", "date_document");
    const fetchDateData = await getDoc(getDateRef);
    if (fetchDateData.data().date) {
        res.status(200).json({ success: true, date: fetchDateData.data().date.toString() });
    } else {
        res.status(404).json({ success: false, msg: "Date not found" });
    }
});

app.post('/countdown', async (req, res)=>{
    const updatedDate = req.body.date;
    await setDoc(doc(db, "Current-Date", "date_document"), { date: updatedDate })
    .then(()=>{
        res.status(200).json({ success: true, msg: "Date Updated Successfully" })
    })
    .catch((error)=>{
        res.status(500).json({ success: false, msg: `Error updating Date: ${error}` })
    })
})



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
