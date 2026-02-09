const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
const moment = require('moment');
const cron = require('node-cron');
const dotenv = require('dotenv');
const winston = require('winston');

// Load environment variables
dotenv.config();

// Set locale to Arabic for date formatting
moment.locale('ar');

// ====== إعدادات التليجرام ======
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || "ضع_توكن_البوت_هنا";
const CHAT_ID = process.env.CHAT_ID || "ضع_رقم_القناة_هنا";
const bot = new TelegramBot(TELEGRAM_TOKEN);

// ====== Logging Setup ======
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({ format: winston.format.simple() })
  ]
});

// ====== إعدادات المشاريع ======
const projects = [
  { name: "Polymarket ($POLY)", type: "Airdrop", action: "Bets + referrals + عدد الأسواق", link: "https://polymarket.com" },
  { name: "Rainbow Wallet ($RNBW)", type: "Airdrop/Points", action: "Daily usage + swaps + bridging", link: "https://rainbow.me" },
  { name: "Monad", type: "Farming", action: "dApps usage + transactions + NFTs minting", link: "https://monad.xyz" },
  { name: "Aster ($ASTER)", type: "Trading reward", action: "Perps trading volume", link: "https://aster.exchange" },
  { name: "Base Ecosystem", type: "Airdrop محتمل", action: "Aerodrome + Uniswap + Aave + dApps usage", link: "https://base.org" },
  { name: "MetaMask Rewards", type: "Points", action: "Daily wallet usage + swaps + bridging", link: "https://metamask.io" }
];

// ====== وظائف جلب البيانات ======
async function getCryptoData() {
  try {
    const res = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: { vs_currency: 'usd', order: 'market_cap_desc', per_page: 50, page: 1, price_change_percentage: '24h', sparkline: false }
    });
    return res.data;
  } catch (err) {
    logger.error("خطأ في جلب بيانات العملات:", err.message);
    return [];
  }
}

async function getBTCETHDominance() {
  try {
    const res = await axios.get('https://api.coingecko.com/api/v3/global');
    return res.data.data.market_cap_percentage;
  } catch (err) {
    logger.error("خطأ في جلب Dominance:", err.message);
    return { btc: 0, eth: 0 };
  }
}

async function getProjectNews() {
  try {
    const fallbackNews = [
      "- Polymarket يسجل أرقام قياسية في المراهنات السياسية",
      "- Base Ecosystem تشهد نمو كبير في TVL وعدد المستخدمين",
      "- Monad testnet يقترب من الإطلاق مع أداء عالية تحت الاختبار"
    ];
    return fallbackNews;
  } catch (err) {
    logger.error("خطأ في جلب الأخبار:", err.message);
    return ["- لا توجد أخبار متوفرة حاليًا", "- تابع X/Twitter للأخبار الطازجة", "- DYOR دائمًا"];
  }
}

// ====== توليد التاريخ بالعربي ======
function getArabicDate() {
  const arabicMonths = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  const day = moment().format('DD');
  const month = arabicMonths[moment().month()];
  const year = moment().format('YYYY');
  return `${day} ${month} ${year}`;
}

// ====== توليد المنشور ======
async function generatePost() {
  try {
    const date = getArabicDate();
    const cryptoData = await getCryptoData();
    const dominance = await getBTCETHDominance();
    const news = await getProjectNews();

    if (cryptoData.length === 0) {
      logger.warn("تعذر جلب بيانات السوق – استخدام fallback");
    }

    // Top 5 Gainers و Losers
    const gainers = cryptoData.sort((a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0)).slice(0, 5);
    const losers = cryptoData.sort((a, b) => (a.price_change_percentage_24h || 0) - (b.price_change_percentage_24h || 0)).slice(0, 5);

    let post = `🥷🔥💀 *ألفا يومية من CryptoNinjaEG* 🥷🔥💀\n`;
    post += `📅 *التاريخ:* ${date}\n\n`;

    post += `🤑💎🪂 *ملخص السوق اليوم:*\n`;
    post += `• BTC dominance: ${dominance.btc ? dominance.btc.toFixed(1) : 'غير متوفر'}%\n`;
    post += `• ETH dominance: ${dominance.eth ? dominance.eth.toFixed(1) : 'غير متوفر'}%\n`;
    post += `• حالة السوق: ${gainers.length > 0 && gainers[0].price_change_percentage_24h > 0 ? '📈 ارتفاع خفيف' : '📉 تصحيح/هبوط'}\n`;
    post += `• فرص Altseason: تبدأ تتحرك مع حركة الـ altcoins\n\n`;

    post += `🪂🔥💰 *فرص الإيردروب والفارمينج:* 🔥🪂💰\n\n`;
    projects.forEach((p, i) => {
      post += `${i+1}️⃣ *${p.name}*\n`;
      post += `   • نوع: ${p.type}\n`;
      post += `   • الطريقة: ${p.action}\n`;
      post += `   • [رابط رسمي](${p.link})\n\n`;
    });

    post += `🚀📈 *أبرز العملات الصاعدة (Top 5 Gainers):* 📈🚀\n\n`;
    if (gainers.length === 0) {
      post += `⚠️ تعذر جلب البيانات – تحقق على CoinGecko\n\n`;
    } else {
      gainers.forEach((c, i) => {
        const change = c.price_change_percentage_24h ? c.price_change_percentage_24h.toFixed(2) : '0.00';
        const volume = c.total_volume ? (c.total_volume / 1000000).toFixed(1) : 'غير متوفر';
        post += `${i+1}. *${c.name}* (${c.symbol.toUpperCase()})\n`;
        post += `   💰 السعر: $${c.current_price.toFixed(4)}\n`;
        post += `   🟢 التغير: +${change}%\n`;
        post += `   📊 الحجم: $${volume}M\n\n`;
      });
    }

    post += `📉 *أبرز العملات الهابطة (Top 5 Losers):* 📉\n\n`;
    if (losers.length === 0) {
      post += `⚠️ تعذر جلب البيانات – تحقق على CoinGecko\n\n`;
    } else {
      losers.forEach((c, i) => {
        const change = c.price_change_percentage_24h ? c.price_change_percentage_24h.toFixed(2) : '0.00';
        const volume = c.total_volume ? (c.total_volume / 1000000).toFixed(1) : 'غير متوفر';
        post += `${i+1}. *${c.name}* (${c.symbol.toUpperCase()})\n`;
        post += `   💰 السعر: $${c.current_price.toFixed(4)}\n`;
        post += `   🔴 التغير: ${change}%\n`;
        post += `   📊 الحجم: $${volume}M\n\n`;
      });
    }

    post += `📊 *أخبار السوق المهمة اليوم:*
\n`;
    news.forEach((n, i) => {
      post += `${i+1}. ${n}\n`;
    });
    post += `\n`;

    post += `🥷💡 *نصيحة النينجا اليومية:*\n\n`;
    post += `✅ ركّز على 2-3 مشاريع حقيقية فقط يوميًا\n`;
    post += `✅ التفاعل العضوي: transactions + swaps + staking\n`;
    post += `✅ تجنب multi-wallet spam والانتشار العشوائي\n`;
    post += `✅ استثمر اللي تقدر تخسره فقط – السوق عالي المخاطرة\n`;
    post += `✅ *DYOR دائمًا* ولا تستثمر بناءً على آراء الآخرين\n\n`;

    post += `📢 *تذكير:* تابعنا يوميًا للألفا الحصري! @Mohaway2000 #CryptoNinjaEG 🥷🤑💰🪂`;

    return post;
  } catch (err) {
    logger.error("خطأ في توليد المنشور:", err.message);
    return "⚠️ خطأ في توليد المنشور اليومي. جرب مرة أخرى لاحقًا.";
  }
}

// ====== إرسال المنشور ======
async function sendPost() {
  try {
    const post = await generatePost();
    await bot.sendMessage(CHAT_ID, post, { parse_mode: "Markdown" });
    logger.info("✅ تم إرسال المنشور بنجاح!");
  } catch (err) {
    logger.error("خطأ في إرسال المنشور:", err.message);
  }
}

// ====== جدولة التشغيل اليومي ======
cron.schedule('0 9 * * *', () => {
  logger.info("بدء تشغيل المنشور اليومي...");
  sendPost();
});

logger.info("🤖 بوت CryptoNinjaEG قيد التشغيل...");