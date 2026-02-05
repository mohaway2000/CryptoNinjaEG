const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const { DateTime } = require('luxon');

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

if (!token || !chatId) {
  console.error('TELEGRAM_BOT_TOKEN أو TELEGRAM_CHAT_ID مش موجودين');
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: false });

async function main() {
  let message = '';

  try {
    // التاريخ بتوقيت مصر
    const egyptNow = DateTime.utc().setZone('Africa/Cairo');
    const dateStr = egyptNow.toFormat('dd LLLL yyyy', { locale: 'ar-EG' });

    message = `🥷🔥💀 ألفا يومية سرية من CryptoNinjaEG 🥷🔥💀\n` +
              `📅 التاريخ: ${dateStr}\n` +
              `🤑💎🪂 خليك نينجا وصيد الفرص قبل الجميع! 🪂💎🤑\n\n`;

    // الفرص الثابتة
    message += `🪂🔥💰 أقوى 6 فرص إيردروب وفارمينج نشطة الآن 🔥🪂💰\n\n` +
               `1. 💱 Hyperliquid Season 2 📈 → تداول perps → مكافآت كبيرة\n   🔗 hyperliquid.xyz\n\n` +
               `2. 👛 MetaMask Rewards 🤑 → نقاط من swaps + bridging\n   🔗 metamask.io\n\n` +
               `3. 🌉 Base Ecosystem 🚀 → فارم عبر Aerodrome/Uniswap/Aave\n   🔗 base.org\n\n` +
               `4. 🔗 LayerZero V2 🪂 → نقاط من cross-chain\n   🔗 layerzero.network\n\n` +
               `5. 🖼️ OpenSea Rewards 🎨 → نقاط من NFT trading\n   🔗 opensea.io\n\n` +
               `6. 💱 Aster Perps DEX 📈 → نقاط عالية (CZ backed)\n   🔗 aster.exchange\n\n`;

    // جلب أقوى 5 gainers
    let gainersText = '⚠️ تعذر جلب بيانات السوق حاليًا\n';
    try {
      const res = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
        params: {
          vs_currency: 'usd',
          order: 'price_change_percentage_24h_desc',
          per_page: 5,
          page: 1,
          sparkline: false
        },
        timeout: 10000
      });

      const coins = res.data;
      gainersText = coins.map((c, i) => {
        const ch = c.price_change_percentage_24h?.toFixed(2) ?? '0.00';
        const p = c.current_price?.toLocaleString('en-US', { minimumFractionDigits: 2 }) ?? '—';
        const sign = Number(ch) >= 0 ? '🟢 +' : '🔴 ';
        return `${i+1}. ${c.symbol.toUpperCase()} (${c.name})\n   ${sign}${ch}%   •   $${p}`;
      }).join('\n\n');

      gainersText = `🚀📈 أقوى 5 عملات صاعدة اليوم (24h) 🚀📈\n\n${gainersText}`;
    } catch (e) {
      console.warn('CoinGecko error:', e.message);
    }

    message += gainersText + '\n\n';

    // الختام
    message += `🥷💀🤑 تابعنا يوميًا للألفا الحصري!\n` +
               `@Mohaway2000   #CryptoNinjaEG 🥷🤑💰🪂\n\n` +
               `DYOR – المخاطر موجودة دائمًا`;

    await bot.sendMessage(chatId, message, {
      parse_mode: 'Markdown',
      disable_web_page_preview: true
    });

    console.log('تم الإرسال بنجاح');
  } catch (err) {
    console.error('خطأ:', err.message);
    process.exit(1);
  }
}

main();
