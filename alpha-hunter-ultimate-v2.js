// alpha-hunter-ultimate-v2.js

// Load necessary modules
const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');
const axios = require('axios');
const winston = require('winston');
const moment = require('moment-jalaali');
require('dotenv').config();

// Setup logging
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' })
    ]
});

// Telegram bot setup
const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// API retry logic
async function fetchDataWithRetry(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            logger.error(`Error fetching data from ${url}: ${error.message}`);
            if (i === retries - 1) throw error; // Rethrow on last attempt
        }
    }
}

// Function to send messages in Arabic
function sendArabicMessage(chatId, message) {
    const formattedMessage = moment().locale('fa').format('jYYYY/jM/jD HH:mm:ss');
    bot.sendMessage(chatId, \`\${message} - \${formattedMessage}\`);
}

// Cron job to send daily updates
cron.schedule('0 9 * * *', async () => {
    try {
        const data = await fetchDataWithRetry('https://api.example.com/data');
        // Process data and send message
        // Example: Send data to Telegram group/chat
        sendArabicMessage(YOUR_CHAT_ID, 'Daily Crypto Update: ' + JSON.stringify(data));
    } catch (error) {
        logger.error(`Cron job error: ${error.message}`);
    }
});

// Event listener for incoming messages
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Welcome to the Crypto Bot!');
    sendArabicMessage(chatId, 'رسالة ترحيبية!'); // Arabic welcome message
});
