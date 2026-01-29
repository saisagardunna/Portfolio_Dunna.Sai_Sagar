
const TelegramBot = require('node-telegram-bot-api');
const projects = require('./src/data/projects.json');
require('dotenv').config({ path: '.env.local' });

// Replace with your token if not using env var, but here we use the one provided
const token = '8269338081:AAFbrSNSSrkwoqoL6ujj3-eHyXAyjpG_jNU';

const bot = new TelegramBot(token, { polling: true });

console.log('Bot is starting...');

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const welcomeMessage = `
Welcome to Sagar's Portfolio Bot! 🚀

I can help you explore my projects and skills through this chat.

*Available Commands:*
/projects - View my portfolio projects
/about - Learn more about me
/contact - Get my contact information
/help - Show this help message
  `;
    bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown' });
});

bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Commands:\n/projects - List projects\n/about - My background\n/contact - Get in touch");
});

bot.onText(/\/projects/, (msg) => {
    const chatId = msg.chat.id;

    // Create an inline keyboard with project buttons
    const keyboard = projects.map(p => {
        // Telegram callback data has a limit of 64 bytes. We'll use a short ID or index.
        return [{ text: p.title, callback_data: `proj_${projects.indexOf(p)}` }];
    });

    bot.sendMessage(chatId, "Select a project to view details:", {
        reply_markup: {
            inline_keyboard: keyboard
        }
    });
});

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    if (data.startsWith('proj_')) {
        const index = parseInt(data.split('_')[1]);
        const p = projects[index];

        if (p) {
            const info = `
*${p.title}*
_${p.category}_

${p.description.join('\n• ')}

Technologies: ${p.tech.join(', ')}

[View Live Demo](${p.link})
            `;
            bot.sendMessage(chatId, info, { parse_mode: 'Markdown', disable_web_page_preview: false });
        }
    }

    // Answer callback to stop loading animation
    bot.answerCallbackQuery(query.id);
});

bot.onText(/\/about/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "I am a Full Stack Developer & AI Enthusiast based in India. I specialize in building scalable web apps using React, Node.js, and Python. Check out my /projects to see my work!");
});

bot.onText(/\/contact/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "📧 Email: saisagardunna@gmail.com\n🔗 GitHub: https://github.com/saisagardunna\n🔗 LinkedIn: [Check Profile](https://linkedin.com/in/saisagardunna)", { parse_mode: 'Markdown' });
});

bot.on('polling_error', (error) => {
    console.log(error.code);  // => 'EFATAL'
});
