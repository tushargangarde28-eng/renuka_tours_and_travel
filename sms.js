const axios = require("axios");

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.Chat_id;

async function sendTelegramMessage(message) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    try {
        await axios.post(url, {
            chat_id: CHAT_ID,
            text: message,
            parse_mode: "HTML"
        });
    } catch (err) {
        console.error("Telegram Error:", err.response?.data || err.message);
    }
}
module.exports = sendTelegramMessage;