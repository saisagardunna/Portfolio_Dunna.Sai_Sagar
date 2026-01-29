const TelegramBot = require('node-telegram-bot-api');
const { createClient } = require('@supabase/supabase-js');

// Configuration
const token = process.env.TELEGRAM_BOT_TOKEN;
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

// Initialize Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper: Format project for display
function formatProject(p) {
    return `
*${p.title}*
📁 Category: ${p.category}
💻 Tech: ${Array.isArray(p.tech) ? p.tech.join(', ') : p.tech}
🔗 Link: ${p.link || 'None'}
📝 Description:
• ${Array.isArray(p.description) ? p.description.join('\n• ') : p.description}
🆔 ID: ${p.id}
    `.trim();
}

// Helper function to send navigation command
async function sendNavigationCommand(command, params = {}) {
    try {
        const payload = { command, ...params };
        const { error } = await supabase
            .from('navigation_commands')
            .insert([payload]);

        if (error) {
            console.error('Navigation command error:', error);
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error sending navigation command:', error);
        return false;
    }
}

// Webhook Handler
module.exports = async (req, res) => {
    // Only allow POST requests from Telegram
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!token) {
        console.error('TELEGRAM_BOT_TOKEN not found');
        return res.status(500).json({ error: 'Bot token not configured' });
    }

    const bot = new TelegramBot(token, { polling: false });
    const { message, callback_query } = req.body;

    try {
        // === HANDLE MESSAGES ===
        if (message) {
            const chatId = message.chat.id;
            const text = message.text || '';
            const userId = message.from.id;

            console.log(`📩 Message from ${userId}: ${text}`);

            // 1. /start
            if (text === '/start') {
                const welcomeMsg = `
🎯 *Welcome back to Portfolio Admin Bot!*

I am connected to your Supabase database. 🗄️

*📋 Project Commands:*
/list - List all projects
/view [id] - View project details
/open [id/name] - Open project live demo
/delete [id] - Delete project

*🧭 Navigation:*
/project - Open Projects page
/contact - Open Contact page
/resume - Open Resume page
/home - Open Home page
/certificate - Open Certificates page

*⚠️ Note for Vercel:*
Complex multi-step commands like /add and /edit are best run locally.
But basic management works here!
                `;
                await bot.sendMessage(chatId, welcomeMsg, { parse_mode: 'Markdown' });
            }

            // 2. /ping
            else if (text === '/ping') {
                // Test DB connection
                const { count, error } = await supabase.from('projects').select('*', { count: 'exact', head: true });
                if (error) {
                    await bot.sendMessage(chatId, `⚠️ Bot is alive, but DB connection failed: ${error.message}`);
                } else {
                    await bot.sendMessage(chatId, `Pong! 🏓\nServer: Online\nDatabase: Connected (${count} projects)`);
                }
            }

            // 3. /list
            else if (text === '/list') {
                const { data: projects, error } = await supabase
                    .from('projects')
                    .select('id, title, category')
                    .eq('is_active', true)
                    .order('id');

                if (error) {
                    await bot.sendMessage(chatId, `❌ Database Error: ${error.message}`);
                } else if (!projects || projects.length === 0) {
                    await bot.sendMessage(chatId, '📭 No projects found in database.');
                } else {
                    let msg = '*📚 Your Projects:*\n\n';
                    projects.forEach(p => msg += `${p.id}. *${p.title}* (${p.category})\n`);
                    msg += `\n_Total: ${projects.length}_`;
                    await bot.sendMessage(chatId, msg, { parse_mode: 'Markdown' });
                }
            }

            // 4. /view [id]
            else if (text.startsWith('/view ')) {
                const id = text.split(' ')[1];
                const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();
                if (error || !data) {
                    await bot.sendMessage(chatId, '❌ Project not found.');
                } else {
                    await bot.sendMessage(chatId, formatProject(data), { parse_mode: 'Markdown' });
                }
            }

            // 5. /delete [id]
            else if (text.startsWith('/delete ')) {
                const id = text.split(' ')[1];
                const { error } = await supabase.from('projects').update({ is_active: false }).eq('id', id);
                if (error) {
                    await bot.sendMessage(chatId, `❌ Delete failed: ${error.message}`);
                } else {
                    await bot.sendMessage(chatId, `✅ Project ${id} deleted (set to inactive).`);
                }
            }

            // 6. Navigation Commands
            else if (['/project', 'project'].includes(text.toLowerCase())) {
                await sendNavigationCommand('projects');
                await bot.sendMessage(chatId, '🚀 Opening Projects page...');
            }
            else if (['/contact', 'contact'].includes(text.toLowerCase())) {
                await sendNavigationCommand('contact');
                await bot.sendMessage(chatId, '📧 Opening Contact page...');
            }
            else if (['/resume', 'resume'].includes(text.toLowerCase())) {
                await sendNavigationCommand('resume');
                await bot.sendMessage(chatId, '📄 Opening Resume page...');
            }
            else if (['/home', 'home'].includes(text.toLowerCase())) {
                await sendNavigationCommand('home');
                await bot.sendMessage(chatId, '🏠 Opening Home page...');
            }
            else if (['/certificate', 'certificate'].includes(text.toLowerCase())) {
                await sendNavigationCommand('gallery');
                await bot.sendMessage(chatId, '🏆 Opening Certificates page...');
            }

            // 7. /open [id/name]
            else if (text.startsWith('/open')) {
                const term = text.replace('/open', '').trim();
                let project = null;

                if (!term) {
                    // List available demos
                    const { data } = await supabase.from('projects').select('id, title').eq('is_active', true).not('link', 'is', null);
                    let msg = "🚀 *Projects with Demos:*\n";
                    data?.forEach(p => msg += `• /open ${p.id} - ${p.title}\n`);
                    await bot.sendMessage(chatId, msg, { parse_mode: 'Markdown' });
                } else {
                    // Search
                    if (!isNaN(term)) {
                        const { data } = await supabase.from('projects').select('*').eq('id', term).single();
                        project = data;
                    } else {
                        const { data } = await supabase.from('projects').select('*').eq('is_active', true).ilike('title', `%${term}%`).limit(1).single();
                        project = data;
                    }

                    if (project && project.link) {
                        await sendNavigationCommand('open_project', { project_id: project.id, project_url: project.link });
                        await bot.sendMessage(chatId, `🎯 Opening demo for *${project.title}*!`, { parse_mode: 'Markdown' });
                    } else if (project) {
                        await bot.sendMessage(chatId, `⚠️ ${project.title} has no live link.`);
                    } else {
                        await bot.sendMessage(chatId, `❌ Project not found.`);
                    }
                }
            }

            // 8. Help / Fallback
            else {
                // Ignore unknown commands or handle generic text
            }
        }

        res.status(200).json({ ok: true });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: error.message });
    }
};
