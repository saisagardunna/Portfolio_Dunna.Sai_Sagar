
const TelegramBot = require('node-telegram-bot-api');
const { createClient } = require('@supabase/supabase-js');
const projects = require('./src/data/projects.json');
require('dotenv').config({ path: '.env.local' });

const TOKEN        = process.env.TELEGRAM_BOT_TOKEN;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!TOKEN || !SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing env vars! Check .env.local has TELEGRAM_BOT_TOKEN, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY');
    process.exit(1);
}

const bot      = new TelegramBot(TOKEN, { polling: true });
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log('🤖 Sagar Portfolio Bot starting...');
console.log(`📦 ${projects.length} projects loaded`);

// ─── Test Supabase on startup ───────────────────────────────
(async () => {
    const { error } = await supabase
        .from('navigation_commands')
        .select('id')
        .limit(1);
    if (error) {
        console.error('❌ Supabase connection FAILED:', error.message);
        console.error('   → Run fix-navigation-table.sql in Supabase SQL Editor!');
    } else {
        console.log('✅ Supabase connected — navigation_commands table reachable');
    }
})();

// ─── Core helper: push a row to navigation_commands ────────
async function sendNav(chatId, command, projectUrl = null) {
    const payload = { command };
    if (projectUrl) payload.project_url = projectUrl;

    const { error } = await supabase
        .from('navigation_commands')
        .insert([payload]);

    if (error) {
        console.error(`❌ Supabase insert failed (${command}):`, error.message);
        if (chatId) {
            bot.sendMessage(chatId,
                `❌ *Supabase error:* ${error.message}\n\nRun \`fix-navigation-table.sql\` in Supabase SQL Editor.`,
                { parse_mode: 'Markdown' }
            );
        }
        return false;
    }
    console.log(`✅ nav command sent: ${command}${projectUrl ? ' → ' + projectUrl : ''}`);
    return true;
}

// ─── Format one project for display ─────────────────────────
const fmt = (p, i) => {
    const num  = i + 1;
    const desc = Array.isArray(p.description)
        ? p.description.map(d => `• ${d}`).join('\n')
        : p.description;
    const tech = Array.isArray(p.tech) ? p.tech.join(', ') : p.tech;
    const link = p.link ? `\n🔗 ${p.link}` : '\n⚠️ No live link';
    return `*${num}. ${p.title}*\n📁 ${p.category} | 💻 ${tech}\n\n${desc}${link}`;
};

// ════════════════════════════════════════════════════════════
//  /start
// ════════════════════════════════════════════════════════════
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const name = msg.from.first_name || 'there';

    bot.sendMessage(chatId, `👋 Hey *${name}*\\! Welcome to *Sai Sagar's Portfolio Bot* 🚀

Control the portfolio website on your PC from your phone\\!

*🌐 Navbar Controls \\(opens page on PC\\):*
/home — 🏠 Home page
/myprojects — 🗂 Projects page
/myabout — 👤 About page
/mycontact — 📧 Contact page
/mychat — 💬 Community chat
/gallery — 🏆 Certificates gallery
/resume — 📄 Resume
/tasks — ✅ Task dashboard

*🚀 Open Project on PC:*
/open — List all 14 projects
/open 1 — Open project \\#1 on PC
/open 14 — Open project \\#14 on PC
/open blog — Search by keyword

*📋 Info:*
/projects — Browse all projects \\(Telegram\\)
/about — About Sai Sagar
/skills — Technical skills
/contact — Contact info
/stats — Portfolio stats

_Make sure the portfolio is open in your PC browser first\\!_`, {
        parse_mode: 'MarkdownV2'
    });
});

// ════════════════════════════════════════════════════════════
//  NAVBAR CONTROLS — each opens the page on the PC browser
// ════════════════════════════════════════════════════════════

bot.onText(/\/home/, async (msg) => {
    const chatId = msg.chat.id;
    const ok = await sendNav(chatId, 'home');
    if (ok) bot.sendMessage(chatId, '🏠 *Home page opening on your PC!*', { parse_mode: 'Markdown' });
});

bot.onText(/\/myprojects/, async (msg) => {
    const chatId = msg.chat.id;
    const ok = await sendNav(chatId, 'projects');
    if (ok) bot.sendMessage(chatId, '🗂 *Projects page opening on your PC!*', { parse_mode: 'Markdown' });
});

bot.onText(/\/myabout/, async (msg) => {
    const chatId = msg.chat.id;
    const ok = await sendNav(chatId, 'about');
    if (ok) bot.sendMessage(chatId, '👤 *About page opening on your PC!*', { parse_mode: 'Markdown' });
});

bot.onText(/\/mycontact/, async (msg) => {
    const chatId = msg.chat.id;
    const ok = await sendNav(chatId, 'contact');
    if (ok) bot.sendMessage(chatId, '📧 *Contact page opening on your PC!*', { parse_mode: 'Markdown' });
});

bot.onText(/\/mychat/, async (msg) => {
    const chatId = msg.chat.id;
    const ok = await sendNav(chatId, 'chat');
    if (ok) bot.sendMessage(chatId, '💬 *Community Chat opening on your PC!*', { parse_mode: 'Markdown' });
});

bot.onText(/\/gallery/, async (msg) => {
    const chatId = msg.chat.id;
    const ok = await sendNav(chatId, 'gallery');
    if (ok) bot.sendMessage(chatId, '🏆 *Certificates Gallery opening on your PC!*', { parse_mode: 'Markdown' });
});

bot.onText(/\/resume/, async (msg) => {
    const chatId = msg.chat.id;
    const ok = await sendNav(chatId, 'resume');
    if (ok) bot.sendMessage(chatId, '📄 *Resume opening on your PC!*', { parse_mode: 'Markdown' });
});

bot.onText(/\/tasks/, async (msg) => {
    const chatId = msg.chat.id;
    const ok = await sendNav(chatId, 'tasks');
    if (ok) bot.sendMessage(chatId, '✅ *Task Dashboard opening on your PC!*', { parse_mode: 'Markdown' });
});

// ════════════════════════════════════════════════════════════
//  /open  — open a specific project on the PC browser
// ════════════════════════════════════════════════════════════
bot.onText(/\/open(?:\s+(.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const arg = match[1]?.trim();

    // No arg → print numbered list
    if (!arg) {
        let list = '*All ' + projects.length + ' Projects*\n' +
            'Type /open [number] to open on your PC:\n\n';
        projects.forEach((p, i) => {
            list += (p.link ? '🟢' : '⚫') + ' /open ' + (i + 1) + ' — ' + p.title + '\n';
        });
        list += '\n_Example: /open 1 opens on your PC_';
        return bot.sendMessage(chatId, list, { parse_mode: 'Markdown' });
    }

    // Resolve project
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
        return bot.sendMessage(chatId,
            `❌ Project *"${arg}"* not found.\nUse /open to see all ${projects.length} projects.`,
            { parse_mode: 'Markdown' }
        );
    }

    if (!p.link) {
        return bot.sendMessage(chatId,
            `⚠️ *${p.title}* has no live link yet.`,
            { parse_mode: 'Markdown' }
        );
    }

    // Push to Supabase → PC browser opens it via TelegramNavigationListener
    const ok = await sendNav(chatId, 'open_project', p.link);
    const info = fmt(p, index);

    if (ok) {
        bot.sendMessage(chatId,
            `${info}\n\n✅ *Opening on your PC browser now!*`,
            { parse_mode: 'Markdown', disable_web_page_preview: true }
        );
    } else {
        // Fallback button if Supabase failed
        bot.sendMessage(chatId, info, {
            parse_mode: 'Markdown',
            reply_markup: { inline_keyboard: [[{ text: '🚀 Open Manually', url: p.link }]] }
        });
    }
});

// ════════════════════════════════════════════════════════════
//  /projects — inline keyboard (Telegram-side viewer)
// ════════════════════════════════════════════════════════════
bot.onText(/\/projects$/, (msg) => {
    const chatId = msg.chat.id;
    const keyboard = projects.map((p, i) => [
        { text: `${i + 1}. ${p.title}`, callback_data: `proj_${i}` }
    ]);
    keyboard.push([{ text: '🖥 Open Projects on PC', callback_data: 'nav_projects' }]);

    bot.sendMessage(chatId, `🗂 *All ${projects.length} Projects* — tap to view:`, {
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: keyboard }
    });
});

// ════════════════════════════════════════════════════════════
//  /about, /skills, /contact, /stats, /help
// ════════════════════════════════════════════════════════════
bot.onText(/\/about/, (msg) => {
    bot.sendMessage(msg.chat.id, `👨‍💻 *Sai Sagar Dunna*
*Role:* Associate Software Engineer
*Education:* B.Tech CSE (AI & ML) — Malla Reddy University | CGPA 8.89
*Location:* India 🇮🇳

• Python (FastAPI, Flask) | React + TypeScript
• AWS, Docker, Terraform | AI/ML — NLP, CNN
• ${projects.length}+ live projects serving real users

Use /myabout to open the About page on your PC!`, { parse_mode: 'Markdown' });
});

bot.onText(/\/skills/, (msg) => {
    bot.sendMessage(msg.chat.id, `🛠 *Technical Skills*

*Languages:* 🐍 Python | 🟦 TypeScript | 🟨 JavaScript
*Backend:* ⚡ FastAPI | 🌶 Flask | REST APIs
*Frontend:* ⚛️ React | CSS/PostCSS
*AI/ML:* 🧠 NLP | Conversational AI | 👁 CNN
*Cloud:* ☁️ AWS | 🐳 Docker | 🏗 Terraform | 🔄 n8n
*DB:* 🐘 PostgreSQL | ⚡ Supabase
*Tools:* 🐙 Git | 🧪 Postman | 📊 Hugging Face`, { parse_mode: 'Markdown' });
});

bot.onText(/\/contact/, (msg) => {
    bot.sendMessage(msg.chat.id, `📬 *Contact Sai Sagar*

📧 saisagardunna@gmail.com
📞 +91 63010 51163
🔗 [GitHub](https://github.com/saisagardunna)
💼 [LinkedIn](https://www.linkedin.com/in/sai-sagar-aa104624b/)
🐦 [X/Twitter](https://x.com/saga91151555)
📸 [Instagram](https://www.instagram.com/saisagar2689/)

Use /mycontact to open Contact page on PC!`, { parse_mode: 'Markdown', disable_web_page_preview: true });
});

bot.onText(/\/stats/, (msg) => {
    const cats = {};
    let live = 0;
    projects.forEach(p => {
        cats[p.category] = (cats[p.category] || 0) + 1;
        if (p.link) live++;
    });
    const catText = Object.entries(cats).map(([c, n]) => `  • ${c}: ${n}`).join('\n');
    bot.sendMessage(msg.chat.id, `📊 *Portfolio Stats*\n\n📦 Total: *${projects.length}*\n🔗 Live demos: *${live}*\n\n*By Category:*\n${catText}`, { parse_mode: 'Markdown' });
});

bot.onText(/\/help/, (msg) => {
    bot.sendMessage(msg.chat.id, `🆘 *All Commands*

🌐 *PC Controls:*
/home  /myprojects  /myabout
/mycontact  /mychat  /gallery
/resume  /tasks

🚀 *Open Projects on PC:*
/open — list all
/open 1 to /open 14 — open by number
/open blog — search by name

📋 *Info:*
/projects /about /skills /contact /stats`, { parse_mode: 'Markdown' });
});

// ════════════════════════════════════════════════════════════
//  Callback queries
// ════════════════════════════════════════════════════════════
bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const data  = query.data;

    if (data.startsWith('proj_')) {
        const i = parseInt(data.split('_')[1]);
        const p = projects[i];
        if (p) {
            bot.sendMessage(chatId, fmt(p, i), {
                parse_mode: 'Markdown',
                disable_web_page_preview: false,
                reply_markup: p.link
                    ? { inline_keyboard: [[{ text: '🚀 Open on PC', callback_data: `openpc_${i}` }, { text: '📱 Open Here', url: p.link }]] }
                    : undefined
            });
        }
    }

    if (data.startsWith('openpc_')) {
        const i = parseInt(data.split('_')[1]);
        const p = projects[i];
        if (p && p.link) {
            const ok = await sendNav(chatId, 'open_project', p.link);
            bot.answerCallbackQuery(query.id, { text: ok ? `Opening ${p.title} on PC! 🖥` : '❌ Supabase error', show_alert: !ok });
            return;
        }
    }

    if (data === 'nav_projects') {
        const ok = await sendNav(chatId, 'projects');
        bot.answerCallbackQuery(query.id, { text: ok ? 'Projects page opening on PC! 🖥' : '❌ Supabase error', show_alert: !ok });
        return;
    }

    bot.answerCallbackQuery(query.id);
});

// ════════════════════════════════════════════════════════════
//  Polling error
// ════════════════════════════════════════════════════════════
bot.on('polling_error', (err) => {
    console.error('⚠️ Polling error:', err.code, err.message);
});

console.log('✅ Bot ready! Send /start on Telegram.\n');
