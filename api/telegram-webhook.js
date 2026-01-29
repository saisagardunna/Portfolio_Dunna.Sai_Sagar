const TelegramBot = require('node-telegram-bot-api');

// This webhook handler works with Vercel serverless functions
module.exports = async (req, res) => {
    console.log('Incoming webhook request:', req.method);

    // Only allow POST requests from Telegram
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;

    if (!token) {
        console.error('TELEGRAM_BOT_TOKEN not found in environment variables');
        return res.status(500).json({ error: 'Bot token not configured' });
    }

    try {
        // Initialize bot instance for this request only
        const bot = new TelegramBot(token, { polling: false });

        // Safely load projects data
        let projects = [];
        try {
            projects = require('../src/data/projects.json');
            console.log('Projects loaded successfully, count:', projects.length);
        } catch (err) {
            console.error('Failed to load projects.json:', err);
            // Don't crash, just work with empty projects
        }

        const { message, callback_query } = req.body;
        console.log('Update type:', message ? 'Message' : callback_query ? 'Callback' : 'Unknown');

        // Handle regular messages
        if (message) {
            const chatId = message.chat.id;
            const text = message.text || '';
            console.log(`Received message "${text}" from ${chatId}`);

            if (text === '/start') {
                const welcomeMessage = `
Welcome to Sagar's Portfolio Bot! 🚀

I can help you explore my projects and skills through this chat.

*Available Commands:*
/projects - View my portfolio projects
/about - Learn more about me
/contact - Get my contact information
/ping - Check if bot is alive
`;
                await bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown' });
            }
            else if (text === '/ping') {
                await bot.sendMessage(chatId, "Pong! 🏓 I am alive and running on Vercel.");
            }
            else if (text === '/help') {
                await bot.sendMessage(chatId, "Commands:\n/projects - List projects\n/about - My background\n/contact - Get in touch\n/ping - Test connection");
            }
            else if (text === '/projects') {
                if (projects.length === 0) {
                    await bot.sendMessage(chatId, "Sorry, I couldn't load the projects data at the moment. Please try again later.");
                } else {
                    const keyboard = projects.map((p, idx) => {
                        return [{ text: p.title, callback_data: `proj_${idx}` }];
                    });

                    await bot.sendMessage(chatId, "Select a project to view details:", {
                        reply_markup: {
                            inline_keyboard: keyboard
                        }
                    });
                }
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
            console.log(`Received callback "${data}" from ${chatId}`);

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
        res.status(500).json({ error: error.message, stack: error.stack });
    }
};
