const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

// Telegram Bot Token
const token = 'YOUR_TELEGRAM_BOT_TOKEN';
const bot = new TelegramBot(token, { polling: true });

// CoinGecko API endpoint
const coingeckoAPI = 'https://api.coingecko.com/api/v3';

// Function to fetch market data
async function fetchMarketData() {
    try {
        const response = await axios.get(`${coingeckoAPI}/coins/markets`, {
            params: {
                vs_currency: 'usd',
                order: 'market_cap_desc',
                per_page: 10,
                page: 1,
                sparkline: false
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching market data:', error);
        return null;
    }
}

// Post message function
async function postMessage(chatId, message) {
    try {
        await bot.sendMessage(chatId, message);
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

// Main function for daily posts
async function dailyPost(chatId) {
    const marketData = await fetchMarketData();
    if (marketData) {
        let message = 'Daily Crypto Market Update:\n';
        marketData.forEach(coin => {
            message += `\n${coin.name} (${coin.symbol.toUpperCase()}): $${coin.current_price.toFixed(2)} (24h Change: ${coin.price_change_percentage_24h.toFixed(2)}%)`;
        });
        await postMessage(chatId, message);
    } else {
        await postMessage(chatId, 'Failed to fetch market data.');
    }
}

// Set your Telegram chat ID and schedule daily posts
const chatId = 'YOUR_TELEGRAM_CHAT_ID';
setInterval(() => dailyPost(chatId), 86400000); // 24 hours in milliseconds
