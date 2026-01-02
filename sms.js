const axios = require("axios");
require("dotenv").config();

if (!process.env.BOT_TOKEN || !process.env.CHAT_ID) {
  throw new Error("❌ BOT_TOKEN or CHAT_ID not set in environment");
}

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

async function sendTelegramMessage(message) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    const res = await axios.post(url, {
      chat_id: CHAT_ID,
      text: message,
      parse_mode: "HTML"
    });
    console.log("✅ Telegram message sent");
    return res.data;
  } catch (err) {
    console.error("❌ Telegram Error:", err.response?.data || err.message);
  }
}

module.exports = sendTelegramMessage;
