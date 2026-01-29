const TelegramBot = require('node-telegram-bot-api');
const projects = require('../src/data/projects.json');

// This webhook handler works with Vercel serverless functions
module.exports = async (req, res) => {
    // Only allow POST requests from Telegram
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;

    if (!token) {
        console.error('TELEGRAM_BOT_TOKEN not found in environment variables');
        return res.status(500).json({ error: 'Bot token not configured' });
    }

    const bot = new TelegramBot(token);
    const { message, callback_query } = req.body;

    try {
        // Handle regular messages
        if (message) {
            const chatId = message.chat.id;
            const text = message.text;

            if (text === '/start') {
                const welcomeMessage = `
Welcome to Sagar's Portfolio Bot! 🚀

I can help you explore my projects and skills through this chat.

*Available Commands:*
/projects - View my portfolio projects
/about - Learn more about me
/contact - Get my contact information
/help - Show this help message
        `;
                await bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown' });
            }
            else if (text === '/help') {
                await bot.sendMessage(chatId, "Commands:\n/projects - List projects\n/about - My background\n/contact - Get in touch");
            }
            else if (text === '/projects') {
                const keyboard = projects.map((p, idx) => {
                    return [{ text: p.title, callback_data: `proj_${idx}` }];
                });

                await bot.sendMessage(chatId, "Select a project to view details:", {
                    reply_markup: {
                        inline_keyboard: keyboard
                    }
                });
            }
            else if (text === '/about') {
                await bot.sendMessage(chatId, "I am a Full Stack Developer & AI Enthusiast based in India. I specialize in building scalable web apps using React, Node.js, and Python. Check out my /projects to see my work!");
            }
            else if (text === '/contact') {
                await bot.sendMessage(chatId, "📧 Email: saisagardunna@gmail.com\n🔗 GitHub: https://github.com/saisagardunna\n🔗 LinkedIn: [Check Profile](https://linkedin.com/in/saisagardunna)", { parse_mode: 'Markdown' });
            }
        }

        // Handle callback queries (button clicks)
        if (callback_query) {
            const chatId = callback_query.message.chat.id;
            const data = callback_query.data;

            if (data.startsWith('proj_')) {
                const index = parseInt(data.split('_')[1]);
                const p = projects[index];

                if (p) {
                    const info = `
*${p.title}*
_${p.category}_

• ${p.description.join('\n• ')}

Technologies: ${p.tech.join(', ')}

${p.link ? `[View Live Demo](${p.link})` : 'No live demo available'}
          `;
                    await bot.sendMessage(chatId, info, { parse_mode: 'Markdown', disable_web_page_preview: false });
                }
            }

            // Answer callback to stop loading animation
            await bot.answerCallbackQuery(callback_query.id);
        }

        res.status(200).json({ ok: true });
    } catch (error) {
        console.error('Error processing Telegram update:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
