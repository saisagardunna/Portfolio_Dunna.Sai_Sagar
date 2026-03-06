const TelegramBot = require('node-telegram-bot-api');
const { createClient } = require('@supabase/supabase-js');

// Must import precisely the same file as bot.js does
const projects = require('../src/data/projects.json');

const TOKEN        = process.env.TELEGRAM_BOT_TOKEN;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

// No polling for webhooks
const bot = new TelegramBot(TOKEN);

// Initialize Supabase correctly for Vercel
const supabase = createClient(SUPABASE_URL || 'missing', SUPABASE_KEY || 'missing');

async function sendNav(command, projectUrl = null) {
    const payload = { command };
    if (projectUrl) payload.project_url = projectUrl;

    try {
        const { error } = await supabase.from('navigation_commands').insert([payload]);
        if (error) console.error('Supabase error:', error.message);
        return !error;
    } catch (e) {
        console.error('sendNav error:', e.message);
        return false;
    }
}

const fmt = (p, i) => {
    const num  = i + 1;
    const desc = Array.isArray(p.description) ? p.description.map(d => `• ${d}`).join('\n') : p.description;
    const tech = Array.isArray(p.tech) ? p.tech.join(', ') : p.tech;
    const link = p.link ? `\n🔗 ${p.link}` : '\n⚠️ No live link';
    return `*${num}. ${p.title}*\n📁 ${p.category} | 💻 ${tech}\n\n${desc}${link}`;
};

module.exports = async (req, res) => {
    try {
        if (!TOKEN || !SUPABASE_URL || !SUPABASE_KEY) {
            console.error('Missing environment variables in Vercel. Ensure VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, and TELEGRAM_BOT_TOKEN exist in the Vercel dashboard variables!');
            return res.status(500).json({ error: 'Config missing' });
        }

        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method not allowed' });
        }

        const body = req.body;
        if (!body) return res.status(200).json({ ok: true });

        const message = body.message;
        const callback_query = body.callback_query;

        // HANDLE MESSAGES
        if (message && message.text && message.text.startsWith('/')) {
            const chatId = message.chat.id;
            const text = message.text.trim();
            const cmdMatch = text.match(/^(\/[a-zA-Z0-9_]+)(?:\s+(.+))?/);
            if (!cmdMatch) return res.status(200).json({ ok: true });

            const cmd = cmdMatch[1].toLowerCase();
            const arg = cmdMatch[2]?.trim();

            if (cmd === '/start') {
                const name = message.from?.first_name || 'there';
                await bot.sendMessage(chatId, `👋 Hey *${name}*\\! Welcome to *Sai Sagar's Portfolio Bot* 🚀\n\nControl the website on your PC from your phone\\!\n\n*🌐 Navbar Controls \\(opens page on PC\\):*\n/home — 🏠 Home page\n/myprojects — 🗂 Projects page\n/myabout — 👤 About page\n/mycontact — 📧 Contact page\n/mychat — 💬 Community chat\n/gallery — 🏆 Certificates gallery\n/resume — 📄 Resume\n/tasks — ✅ Task dashboard\n\n*🚀 Open Project on PC:*\n/open — List all ${projects.length} projects\n/open 1 — Open project \\#1 on PC\n/open 14 — Open project \\#14 on PC\n/open blog — Search by keyword\n\n*📋 Info:*\n/projects — Browse all projects \\(Telegram\\)\n/about — About Sai Sagar\n/skills — Technical skills\n/contact — Contact info\n/stats — Portfolio stats`, { parse_mode: 'MarkdownV2' });
            }
            else if (['/home', '/myprojects', '/myabout', '/mycontact', '/mychat', '/gallery', '/resume', '/tasks'].includes(cmd)) {
                const routeMap = {
                    '/home': 'home', '/myprojects': 'projects', '/myabout': 'about',
                    '/mycontact': 'contact', '/mychat': 'chat', '/gallery': 'gallery',
                    '/resume': 'resume', '/tasks': 'tasks'
                };
                const ok = await sendNav(routeMap[cmd]);
                if (ok) await bot.sendMessage(chatId, `✅ *Page opening on your PC!*`, { parse_mode: 'Markdown' });
                else await bot.sendMessage(chatId, `❌ Supabase command failed`, { parse_mode: 'Markdown' });
            }
            else if (cmd === '/open') {
                if (!arg) {
                    let list = `🗂 *All ${projects.length} Projects*\nType /open [number] to open on your PC:\n\n`;
                    projects.forEach((p, i) => list += `${p.link ? '🟢' : '⚫'} /open ${i + 1} — ${p.title}\n`);
                    await bot.sendMessage(chatId, list, { parse_mode: 'Markdown' });
                } else {
                    let p = null, index = -1;
                    if (!isNaN(arg)) {
                        index = parseInt(arg) - 1;
                        if (index >= 0 && index < projects.length) p = projects[index];
                    } else {
                        const s = arg.toLowerCase();
                        index = projects.findIndex(proj => 
                            proj.title.toLowerCase().includes(s) || 
                            (proj.keywords && proj.keywords.some(k => k.toLowerCase().includes(s))) ||
                            (Array.isArray(proj.tech) && proj.tech.some(t => t.toLowerCase().includes(s)))
                        );
                        if (index !== -1) p = projects[index];
                    }

                    if (!p) {
                        await bot.sendMessage(chatId, `❌ Project *"${arg}"* not found.`, { parse_mode: 'Markdown' });
                    } else if (!p.link) {
                        await bot.sendMessage(chatId, `⚠️ *${p.title}* has no live link yet.`, { parse_mode: 'Markdown' });
                    } else {
                        const ok = await sendNav('open_project', p.link);
                        if (ok) {
                            await bot.sendMessage(chatId, `${fmt(p, index)}\n\n✅ *Opening on your PC browser now!*`, { parse_mode: 'Markdown', disable_web_page_preview: true });
                        } else {
                            await bot.sendMessage(chatId, fmt(p, index), { parse_mode: 'Markdown', reply_markup: { inline_keyboard: [[{ text: '🚀 Open Manually', url: p.link }]] }});
                        }
                    }
                }
            }
            else if (cmd === '/projects') {
                const keyboard = projects.map((p, i) => [{ text: `${i + 1}. ${p.title}`, callback_data: `proj_${i}` }]);
                keyboard.push([{ text: '🖥 Open Projects on PC', callback_data: 'nav_projects' }]);
                await bot.sendMessage(chatId, `🗂 *All ${projects.length} Projects* — tap to view:`, { parse_mode: 'Markdown', reply_markup: { inline_keyboard: keyboard } });
            }
            else if (cmd === '/about') {
                await bot.sendMessage(chatId, `👨‍💻 *Sai Sagar Dunna*\n*Role:* Associate Software Engineer\n*Education:* B.Tech CSE (AI & ML) — Malla Reddy University | CGPA 8.89\n*Location:* India 🇮🇳\n\n• Python (FastAPI, Flask) | React + TypeScript\n• AWS, Docker, Terraform | AI/ML — NLP, CNN\n• ${projects.length}+ live projects serving real users\n\nUse /myabout to open the About page on your PC!`, { parse_mode: 'Markdown' });
            }
            else if (cmd === '/skills') {
                await bot.sendMessage(chatId, `🛠 *Technical Skills*\n\n*Languages:* 🐍 Python | 🟦 TypeScript | 🟨 JavaScript\n*Backend:* ⚡ FastAPI | 🌶 Flask | REST APIs\n*Frontend:* ⚛️ React | CSS/PostCSS\n*AI/ML:* 🧠 NLP | Conversational AI | 👁 CNN\n*Cloud:* ☁️ AWS | 🐳 Docker | 🏗 Terraform | 🔄 n8n\n*DB:* 🐘 PostgreSQL | ⚡ Supabase\n*Tools:* 🐙 Git | 🧪 Postman | 📊 Hugging Face`, { parse_mode: 'Markdown' });
            }
            else if (cmd === '/contact') {
                await bot.sendMessage(chatId, `📬 *Contact Sai Sagar*\n\n📧 saisagardunna@gmail.com\n📞 +91 63010 51163\n🔗 [GitHub](https://github.com/saisagardunna)\n💼 [LinkedIn](https://www.linkedin.com/in/sai-sagar-aa104624b/)\n🐦 [X/Twitter](https://x.com/saga91151555)\n📸 [Instagram](https://www.instagram.com/saisagar2689/)\n\nUse /mycontact to open Contact page on PC!`, { parse_mode: 'Markdown', disable_web_page_preview: true });
            }
            else if (cmd === '/stats') {
                const cats = {}; let live = 0;
                projects.forEach(p => { cats[p.category] = (cats[p.category] || 0) + 1; if (p.link) live++; });
                const catText = Object.entries(cats).map(([c, n]) => `  • ${c}: ${n}`).join('\n');
                await bot.sendMessage(chatId, `📊 *Portfolio Stats*\n\n📦 Total: *${projects.length}*\n🔗 Live demos: *${live}*\n\n*By Category:*\n${catText}`, { parse_mode: 'Markdown' });
            }
            else if (cmd === '/help') {
                await bot.sendMessage(chatId, `🆘 *All Commands*\n\n🌐 *PC Controls:*\n/home  /myprojects  /myabout\n/mycontact  /mychat  /gallery\n/resume  /tasks\n\n🚀 *Open Projects on PC:*\n/open — list all\n/open 1 to /open 14 — open by number\n/open blog — search by name\n\n📋 *Info:*\n/projects /about /skills /contact /stats`, { parse_mode: 'Markdown' });
            }
        }
        
        // HANDLE CALLBACK QUERIES
        else if (callback_query) {
            const chatId = callback_query.message.chat.id;
            const data = callback_query.data;

            if (data.startsWith('proj_')) {
                const i = parseInt(data.split('_')[1]);
                const p = projects[i];
                if (p) {
                    await bot.sendMessage(chatId, fmt(p, i), {
                        parse_mode: 'Markdown', disable_web_page_preview: false,
                        reply_markup: p.link ? { inline_keyboard: [[{ text: '🚀 Open on PC', callback_data: `openpc_${i}` }, { text: '📱 Open Here', url: p.link }]] } : undefined
                    });
                }
            } else if (data.startsWith('openpc_')) {
                const i = parseInt(data.split('_')[1]);
                const p = projects[i];
                if (p && p.link) {
                    await sendNav('open_project', p.link);
                    await bot.answerCallbackQuery(callback_query.id, { text: `Opening ${p.title} on PC! 🖥`, show_alert: false });
                }
            } else if (data === 'nav_projects') {
                await sendNav('projects');
                await bot.answerCallbackQuery(callback_query.id, { text: 'Projects page opening on PC! 🖥', show_alert: false });
            } else {
                await bot.answerCallbackQuery(callback_query.id);
            }
        }

        return res.status(200).json({ ok: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return res.status(500).json({ error: error.message });
    }
};
