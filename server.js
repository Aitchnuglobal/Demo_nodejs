const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // your MySQL username
    password: '', // your MySQL password
    database: 'internship'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL connected...');
});

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'skylineshopify@gmail.com',
        pass: 'bqnr uwmj zsvb rowq'
    }
});

// Serve the signup page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/signup.html');
});

// Handle signup
app.post('/signup', (req, res) => {
    const {
        first_name,
        last_name,
        phone_number,
        email,
        college_name,
        branch,
        password
    } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    const query = 'INSERT INTO users (first_name, last_name, phone_number, email, college_name, branch, password) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [first_name, last_name, phone_number, email, college_name, branch, hashedPassword], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error registering user');
        }

        // Send confirmation email
        const mailOptions = {
            from: 'skylineshopify@gmail.com',
            to: email,
            subject: 'Registration Successful',
            text: `Hello ${first_name},

Thank you for registering with us. Your registration is successful.

Here are the details you provided:
First Name: ${first_name}
Last Name: ${last_name}
Phone Number: ${phone_number}
Email: ${email}
College Name: ${college_name}
Branch: ${branch}

Further steps:
- You will receive updates and notifications to this email.
- Stay tuned for more information about upcoming events and opportunities.

Best regards,
Your Company Name`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                return res.status(500).send('Error sending confirmation email');
            }

            console.log('Email sent: ' + info.response);
            res.redirect('/?success=1');
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});