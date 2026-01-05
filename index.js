const express = require('express');
const bodyparser = require("body-parser");
const sendTelegramMessage = require("./sms");
require("dotenv").config();
const mysql = require("mysql2");

if (process.env.NODE_ENV !== "production") 
    {
  require("dotenv").config();
}


const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the pool connection ONCE
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MySQL connection error:", err.message);
    process.exit(1);
  }
  console.log("✅ MySQL Connected to Clever Cloud");
  connection.release(); // VERY IMPORTANT
});

module.exports = pool;


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

    pool.query(
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

    pool.query(
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

console.log(
  "BOT_TOKEN:",
  process.env.BOT_TOKEN
    ? process.env.BOT_TOKEN.slice(0, 10)
    : "❌ MISSING"
);

console.log("BOT_TOKEN length:", process.env.BOT_TOKEN?.length);
const PORT = process.env.PORT || process.env.APP_PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
