const express = require('express');
const bodyparser = require("body-parser");
const mysql = require('mysql2');
require("dotenv").config();
const sendTelegramMessage = require("./sms");


const conn = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.PORT
});


const app = express();
app.use(bodyparser.urlencoded());
app.use('/public', express.static('public'));

app.get('/', function (req, res) {
    res.render('index.ejs');
});

app.post("/home_form", async function (req, res) {
    const d = req.body;

    const sql = `
        INSERT INTO bookings 
        (first_name, last_name, email, mobile, from_city, to_city, travel_date, travel_time) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    conn.query(
        sql,
        [
            d.first_name,
            d.last_name,
            d.email,
            d.mobile,
            d.from_city,
            d.to_city,
            d.travel_date,
            d.travel_time
        ],
        async function (err, result) {
            if (err) {
                console.log(err);
                return res.send("Error");
            }

            // 📩 Telegram Message
            const message = `
🚕 <b>New Cab Booking</b>

👤 Name: ${d.first_name} ${d.last_name}
📞 Mobile: ${d.mobile}
📧 Email: ${d.email}

📍 From: ${d.from_city}
🏁 To: ${d.to_city}

📅 Date: ${d.travel_date}
⏰ Time: ${d.travel_time}
            `;

            await sendTelegramMessage(message);

            res.redirect("/");
        }
    );
});



app.get('/about', function (req, res) {
    res.render('about.ejs');
});

app.get('/driver', function (req, res) {
    res.render('driver.ejs');
});

app.post("/save_booking", function (req, res) {
    var d = req.body;
    const sql = `
        INSERT INTO bookings 
        (first_name, last_name, email, mobile, from_city, to_city, travel_date, travel_time) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    conn.query(
        sql,
        [
            d.first_name,
            d.last_name,
            d.email,
            d.mobile,
            d.from_city,
            d.to_city,
            d.travel_date,
            d.travel_time
        ],
        async function (err, result) {
            if (err) {
                console.log(err);
                return res.send("Error");
            }

            // 📩 Telegram Message
            const message = `
🚕 <b>New Cab Booking</b>

👤 Name: ${d.first_name} ${d.last_name}
📞 Mobile: ${d.mobile}
📧 Email: ${d.email}

📍 From: ${d.from_city}
🏁 To: ${d.to_city}

📅 Date: ${d.travel_date}
⏰ Time: ${d.travel_time}
            `;

            await sendTelegramMessage(message);

            res.redirect("/contact");
        }
    );
});


app.get('/contact', function (req, res) {
    res.render('contact.ejs');
});
app.listen(process.env.Webport || 8000, function () {
    console.log("Server started on port 8000");
});
