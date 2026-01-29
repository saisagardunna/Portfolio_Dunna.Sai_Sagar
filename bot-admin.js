const TelegramBot = require('node-telegram-bot-api');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Configuration
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8269338081:AAFbrSNSSrkwoqoL6ujj3-eHyXAyjpG_jNU';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://drllledoxzmbnbldprat.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRybGxsZWRveHptYm5ibGRwcmF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3ODUxNjAsImV4cCI6MjA1MjM2MTE2MH0.Rw8YqL0PGnkD9F_2r8vCvjF8Ls7JIoP6P8_K3VmPVEA';

console.log('🔧 Configuration:');
console.log('Token:', TELEGRAM_TOKEN ? 'Set ✅' : 'Missing ❌');
console.log('Supabase URL:', SUPABASE_URL);
console.log('Supabase Key:', SUPABASE_KEY ? 'Set ✅' : 'Missing ❌');

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Store user state for multi-step operations
const userStates = {};

console.log('🤖 Admin Bot is running...');
console.log('💬 Try sending /start to your bot on Telegram!');

// Test database connection
(async () => {
    try {
        const { count, error } = await supabase
            .from('projects')
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.error('❌ Database connection failed:', error.message);
            console.log('⚠️  Make sure you ran setup-database.sql in Supabase!');
        } else {
            console.log(`✅ Database connected! Found ${count || 0} projects.`);
        }
    } catch (err) {
        console.error('❌ Database test failed:', err.message);
    }
})();

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

// === COMMANDS ===

// /start - Welcome
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    console.log(`📩 /start from user ${userId}`);

    const welcomeMsg = `
🎯 *Welcome to Portfolio Admin Bot!*

Your Telegram ID: \`${userId}\`

*📋 View Commands:*
/projects - Open portfolio website
/list - List all projects
/view [id] - View project details

*✏️ Edit Commands:*
/add - Add new project
/edit [id] - Edit existing project
/delete [id] - Delete project

*🧭 Navigation Commands (Control Your Webpage!):*
/project or "project" - Open Projects page
/contact or "contact" - Open Contact page
/resume or "resume" - Open Resume page
/certificate or "certificate" - Open Certificates page
/home or "home" - Open Home page

*� Project Demo Commands:*
/open - List projects with live demos
/open [id] - Open project live demo by ID
/open [name] - Open project by name/keyword

*�🔧 Other:*
/stats - View statistics
/help - Show this help

_All changes update your live website instantly!_ 🚀
_Navigation commands will open pages on any browser viewing your portfolio!_ 🌐
_Demo commands will open project links in new tabs!_ 🎯
    `;

    bot.sendMessage(chatId, welcomeMsg, { parse_mode: 'Markdown' });
});

// /help
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Use /start to see all available commands!");
});

// /projects - Open website
bot.onText(/\/projects$/, async (msg) => {
    const chatId = msg.chat.id;
    console.log(`📩 /projects from user ${msg.from.id}`);

    bot.sendMessage(chatId, '🌐 *View Projects on Website*\n\nChoose an option:', {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: '🚀 Open Portfolio Website', url: 'http://localhost:8080/projects' }],
                [{ text: '📋 List Projects Here', callback_data: 'list_projects' }]
            ]
        }
    });
});

// /list - List all projects
bot.onText(/\/list/, async (msg) => {
    const chatId = msg.chat.id;
    console.log(`📩 /list from user ${msg.from.id}`);

    try {
        const { data: projects, error } = await supabase
            .from('projects')
            .select('id, title, category')
            .eq('is_active', true)
            .order('id');

        if (error) {
            console.error('Database error:', error);
            bot.sendMessage(chatId, `❌ *Database Error*\n\n⚠️ Did you run \`setup-database.sql\` in Supabase?\n\nError: ${error.message}`, { parse_mode: 'Markdown' });
            return;
        }

        if (!projects || projects.length === 0) {
            bot.sendMessage(chatId, '📭 *No Projects Found*\n\n💡 Run the SQL script in `setup-database.sql` to import your projects!', { parse_mode: 'Markdown' });
            return;
        }

        let message = '*📚 Your Projects:*\n\n';
        projects.forEach(p => {
            message += `${p.id}. *${p.title}* (${p.category})\n`;
        });
        message += `\n_Total: ${projects.length} projects_`;

        bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    } catch (error) {
        console.error('Error listing projects:', error);
        bot.sendMessage(chatId, `❌ *Database Connection Error*\n\n${error.message}`, { parse_mode: 'Markdown' });
    }
});

// /view [id] - View project details
bot.onText(/\/view (\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const projectId = parseInt(match[1]);
    console.log(`📩 /view ${projectId} from user ${msg.from.id}`);

    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', projectId)
            .single();

        if (error) throw error;

        bot.sendMessage(chatId, formatProject(data), { parse_mode: 'Markdown' });
    } catch (error) {
        console.error('View error:', error);
        bot.sendMessage(chatId, `❌ *Project Not Found*\n\nMake sure:\n• Database is set up\n• Project ID exists\n• Use /list to see all IDs`, { parse_mode: 'Markdown' });
    }
});

// /add - Start adding new project
bot.onText(/\/add/, (msg) => {
    const chatId = msg.chat.id;
    console.log(`📩 /add from user ${msg.from.id}`);

    userStates[chatId] = { action: 'add', step: 'title' };

    bot.sendMessage(chatId, '📝 *Adding New Project*\n\nEnter project title:', { parse_mode: 'Markdown' });
});

// /edit [id] - Start editing project
bot.onText(/\/edit (\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const projectId = parseInt(match[1]);
    console.log(`📩 /edit ${projectId} from user ${msg.from.id}`);

    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', projectId)
            .single();

        if (error) throw error;

        userStates[chatId] = {
            action: 'edit',
            projectId,
            project: data,
            step: 'menu'
        };

        const keyboard = {
            inline_keyboard: [
                [{ text: '✏️ Title', callback_data: `edit_title_${projectId}` }],
                [{ text: '💻 Tech Stack', callback_data: `edit_tech_${projectId}` }],
                [{ text: '📁 Category', callback_data: `edit_category_${projectId}` }],
                [{ text: '🔗 Link', callback_data: `edit_link_${projectId}` }],
                [{ text: '📝 Description', callback_data: `edit_description_${projectId}` }],
                [{ text: '❌ Cancel', callback_data: 'cancel' }]
            ]
        };

        bot.sendMessage(chatId, `*Editing: ${data.title}*\n\nWhat would you like to update?`, {
            parse_mode: 'Markdown',
            reply_markup: keyboard
        });
    } catch (error) {
        console.error('Edit error:', error);
        bot.sendMessage(chatId, `❌ *Cannot Edit Project*\n\nMake sure:\n• Database is set up\n• Project ID exists\n• Use /list to see all IDs\n\nError: ${error.message}`, { parse_mode: 'Markdown' });
    }
});

// /edit without ID - Show helpful message
bot.onText(/\/edit$/, async (msg) => {
    const chatId = msg.chat.id;
    console.log(`📩 /edit (no ID) from user ${msg.from.id}`);

    try {
        const { data: projects, error } = await supabase
            .from('projects')
            .select('id, title')
            .eq('is_active', true)
            .order('id');

        if (error) throw error;

        let message = '⚠️ *Usage:* `/edit [id]`\n\n';
        message += '📋 *Available Projects:*\n\n';
        projects.forEach(p => {
            message += `• /edit ${p.id} - ${p.title}\n`;
        });
        message += '\n_Click on a command above to edit that project_';

        bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    } catch (error) {
        bot.sendMessage(chatId, '❌ Please use: `/edit [id]`\n\nExample: `/edit 1`\n\nUse /list to see all project IDs', { parse_mode: 'Markdown' });
    }
});

// /delete without ID - Show helpful message  
bot.onText(/\/delete$/, async (msg) => {
    const chatId = msg.chat.id;
    console.log(`📩 /delete (no ID) from user ${msg.from.id}`);

    try {
        const { data: projects, error } = await supabase
            .from('projects')
            .select('id, title')
            .eq('is_active', true)
            .order('id');

        if (error) throw error;

        let message = '⚠️ *Usage:* `/delete [id]`\n\n';
        message += '📋 *Available Projects:*\n\n';
        projects.forEach(p => {
            message += `• /delete ${p.id} - ${p.title}\n`;
        });
        message += '\n_Click on a command above to delete that project_';

        bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    } catch (error) {
        bot.sendMessage(chatId, '❌ Please use: `/delete [id]`\n\nExample: `/delete 1`\n\nUse /list to see all project IDs', { parse_mode: 'Markdown' });
    }
});

// /delete [id] - Delete project
bot.onText(/\/delete (\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const projectId = parseInt(match[1]);
    console.log(`📩 /delete ${projectId} from user ${msg.from.id}`);

    const keyboard = {
        inline_keyboard: [
            [
                { text: '✅ Yes, Delete', callback_data: `confirm_delete_${projectId}` },
                { text: '❌ Cancel', callback_data: 'cancel' }
            ]
        ]
    };

    bot.sendMessage(chatId, `⚠️ Are you sure you want to delete project #${projectId}?`, {
        reply_markup: keyboard
    });
});

// /stats - Show statistics
bot.onText(/\/stats/, async (msg) => {
    const chatId = msg.chat.id;
    console.log(`📩 /stats from user ${msg.from.id}`);

    try {
        const { count: total } = await supabase
            .from('projects')
            .select('*', { count: 'exact', head: true })
            .eq('is_active', true);

        const { data: categories } = await supabase
            .from('projects')
            .select('category')
            .eq('is_active', true);

        const catCounts = {};
        if (categories) {
            categories.forEach(p => {
                catCounts[p.category] = (catCounts[p.category] || 0) + 1;
            });
        }

        let statsMsg = `📊 *Portfolio Statistics*\n\n`;
        statsMsg += `Total Projects: ${total || 0}\n\n`;
        statsMsg += `*By Category:*\n`;
        Object.entries(catCounts).forEach(([cat, count]) => {
            statsMsg += `• ${cat}: ${count}\n`;
        });

        bot.sendMessage(chatId, statsMsg, { parse_mode: 'Markdown' });
    } catch (error) {
        console.error('Stats error:', error);
        bot.sendMessage(chatId, '❌ Error fetching stats.');
    }
});

// === NAVIGATION COMMANDS ===
// These commands will trigger navigation on the webpage

// Helper function to send navigation command
async function sendNavigationCommand(command) {
    try {
        const { error } = await supabase
            .from('navigation_commands')
            .insert([{ command }]);

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

// /project or just "project" - Navigate to projects page
bot.onText(/\/project|^project$/i, async (msg) => {
    const chatId = msg.chat.id;
    console.log(`📩 project command from user ${msg.from.id}`);

    const success = await sendNavigationCommand('projects');
    if (success) {
        bot.sendMessage(chatId, '🚀 *Opening Projects page on your website!*', { parse_mode: 'Markdown' });
    } else {
        bot.sendMessage(chatId, '❌ Failed to send navigation command. Make sure the database is set up.');
    }
});

// /contact or just "contact" - Navigate to contact page
bot.onText(/\/contact|^contact$/i, async (msg) => {
    const chatId = msg.chat.id;
    console.log(`📩 contact command from user ${msg.from.id}`);

    const success = await sendNavigationCommand('contact');
    if (success) {
        bot.sendMessage(chatId, '📧 *Opening Contact page on your website!*', { parse_mode: 'Markdown' });
    } else {
        bot.sendMessage(chatId, '❌ Failed to send navigation command. Make sure the database is set up.');
    }
});

// /resume or just "resume" - Navigate to resume page
bot.onText(/\/resume|^resume$/i, async (msg) => {
    const chatId = msg.chat.id;
    console.log(`📩 resume command from user ${msg.from.id}`);

    const success = await sendNavigationCommand('resume');
    if (success) {
        bot.sendMessage(chatId, '📄 *Opening Resume page on your website!*', { parse_mode: 'Markdown' });
    } else {
        bot.sendMessage(chatId, '❌ Failed to send navigation command. Make sure the database is set up.');
    }
});

// /certificate or just "certificate" - Navigate to certificates/gallery page
bot.onText(/\/certificate|^certificate$/i, async (msg) => {
    const chatId = msg.chat.id;
    console.log(`📩 certificate command from user ${msg.from.id}`);

    const success = await sendNavigationCommand('gallery');
    if (success) {
        bot.sendMessage(chatId, '🏆 *Opening Certificates page on your website!*', { parse_mode: 'Markdown' });
    } else {
        bot.sendMessage(chatId, '❌ Failed to send navigation command. Make sure the database is set up.');
    }
});

// /home or just "home" - Navigate to home page
bot.onText(/\/home|^home$/i, async (msg) => {
    const chatId = msg.chat.id;
    console.log(`📩 home command from user ${msg.from.id}`);

    const success = await sendNavigationCommand('home');
    if (success) {
        bot.sendMessage(chatId, '🏠 *Opening Home page on your website!*', { parse_mode: 'Markdown' });
    } else {
        bot.sendMessage(chatId, '❌ Failed to send navigation command. Make sure the database is set up.');
    }
});

// /open [project_id or keyword] - Open project live demo
bot.onText(/\/open(?:\s+(.+))?/i, async (msg, match) => {
    const chatId = msg.chat.id;
    const searchTerm = match[1]?.trim();

    console.log(`📩 /open command from user ${msg.from.id}, search: ${searchTerm}`);

    // If no search term provided, show available projects
    if (!searchTerm) {
        try {
            const { data: projects, error } = await supabase
                .from('projects')
                .select('id, title, link')
                .eq('is_active', true)
                .not('link', 'is', null)
                .order('id');

            if (error) throw error;

            if (!projects || projects.length === 0) {
                bot.sendMessage(chatId, '📭 No projects with live demos found.', { parse_mode: 'Markdown' });
                return;
            }

            let message = '🚀 *Available Projects with Live Demos:*\n\n';
            projects.forEach(p => {
                message += `• /open ${p.id} - ${p.title}\n`;
            });
            message += '\n_Example: /open 1 or /open threatnet_';

            bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
        } catch (error) {
            bot.sendMessage(chatId, '❌ Error fetching projects.');
        }
        return;
    }

    // Search for project by ID or title/keyword
    try {
        let project;

        // Check if searchTerm is a number (ID)
        if (!isNaN(searchTerm)) {
            const projectId = parseInt(searchTerm);
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('id', projectId)
                .eq('is_active', true)
                .single();

            if (!error) project = data;
        }

        // If not found by ID, search by title/keywords
        if (!project) {
            const { data: allProjects, error } = await supabase
                .from('projects')
                .select('*')
                .eq('is_active', true);

            if (!error && allProjects) {
                const searchLower = searchTerm.toLowerCase();
                project = allProjects.find(p => {
                    const titleMatch = p.title.toLowerCase().includes(searchLower);
                    const keywordMatch = p.keywords && p.keywords.some(k =>
                        k.toLowerCase().includes(searchLower)
                    );
                    return titleMatch || keywordMatch;
                });
            }
        }

        if (!project) {
            bot.sendMessage(chatId, `❌ Project "${searchTerm}" not found.\n\nUse /open to see available projects.`, { parse_mode: 'Markdown' });
            return;
        }

        if (!project.link) {
            bot.sendMessage(chatId, `📋 *${project.title}*\n\n⚠️ This project doesn't have a live demo link.`, { parse_mode: 'Markdown' });
            return;
        }

        // Send navigation command to open the project link
        const { error } = await supabase
            .from('navigation_commands')
            .insert([{
                command: 'open_project',
                project_id: project.id,
                project_url: project.link
            }]);

        if (error) {
            console.error('Navigation command error:', error);
        }

        // Also send direct link button
        const keyboard = {
            inline_keyboard: [
                [{ text: '🚀 Open Live Demo', url: project.link }]
            ]
        };

        bot.sendMessage(chatId,
            `🎯 *${project.title}*\n\n🔗 Opening live demo on your website!\n\nOr click the button below:`,
            {
                parse_mode: 'Markdown',
                reply_markup: keyboard
            }
        );

    } catch (error) {
        console.error('Open project error:', error);
        bot.sendMessage(chatId, '❌ Error opening project. Please try again.');
    }
});

// Handle callback queries (button clicks)
bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;
    console.log(`🔘 Callback: ${data} from user ${query.from.id}`);

    // Handle edit field selection
    if (data.startsWith('edit_')) {
        const [_, field, projectId] = data.split('_');
        const project = userStates[chatId]?.project;

        if (project) {
            userStates[chatId].editField = field;
            userStates[chatId].step = 'editing';

            const prompts = {
                title: 'Enter new title:',
                tech: 'Enter tech stack (comma-separated):',
                category: 'Enter category (Web Dev, AI/ML, Cloud/DevOps):',
                link: 'Enter project link:',
                description: 'Enter description points (one per line):'
            };

            bot.sendMessage(chatId, prompts[field]);
        }
    }

    // Handle delete confirmation
    if (data.startsWith('confirm_delete_')) {
        const projectId = parseInt(data.split('_')[2]);

        try {
            const { error } = await supabase
                .from('projects')
                .update({ is_active: false })
                .eq('id', projectId);

            if (error) throw error;

            bot.sendMessage(chatId, '✅ Project deleted successfully!');
        } catch (error) {
            console.error('Delete error:', error);
            bot.sendMessage(chatId, '❌ Error deleting project.');
        }
    }

    // Handle list projects callback
    if (data === 'list_projects') {
        // Trigger /list command
        bot.emit('message', { chat: { id: chatId }, text: '/list', from: query.from });
    }

    if (data === 'cancel') {
        delete userStates[chatId];
        bot.sendMessage(chatId, '❌ Operation cancelled.');
    }

    bot.answerCallbackQuery(query.id);
});

// Handle text messages (for multi-step operations)
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    // Ignore commands
    if (text && text.startsWith('/')) return;

    const state = userStates[chatId];
    if (!state) return;

    // Handle ADD project flow
    if (state.action === 'add') {
        if (!state.data) state.data = {};

        if (state.step === 'title') {
            state.data.title = text;
            state.step = 'tech';
            bot.sendMessage(chatId, '💻 Enter tech stack (comma-separated):');
        }
        else if (state.step === 'tech') {
            state.data.tech = text.split(',').map(t => t.trim());
            state.step = 'category';
            bot.sendMessage(chatId, '📁 Enter category (Web Dev, AI/ML, Cloud/DevOps):');
        }
        else if (state.step === 'category') {
            state.data.category = text;
            state.step = 'link';
            bot.sendMessage(chatId, '🔗 Enter project link (or "none"):');
        }
        else if (state.step === 'link') {
            state.data.link = text.toLowerCase() === 'none' ? null : text;
            state.step = 'description';
            bot.sendMessage(chatId, '📝 Enter description points (one per line):');
        }
        else if (state.step === 'description') {
            state.data.description = text.split('\n').filter(l => l.trim());
            state.data.keywords = [];

            // Insert into database
            try {
                const { error } = await supabase
                    .from('projects')
                    .insert([state.data]);

                if (error) throw error;

                bot.sendMessage(chatId, '✅ Project added successfully! 🎉\n\nUse /list to see all projects.');
                delete userStates[chatId];
            } catch (error) {
                console.error('Error adding project:', error);
                bot.sendMessage(chatId, `❌ Error adding project: ${error.message}\n\nPlease try again.`);
                delete userStates[chatId];
            }
        }
    }

    // Handle EDIT project flow
    if (state.action === 'edit' && state.step === 'editing') {
        const field = state.editField;
        const projectId = state.projectId;
        let updateData = {};

        if (field === 'tech') {
            updateData.tech = text.split(',').map(t => t.trim());
        } else if (field === 'description') {
            updateData.description = text.split('\n').filter(l => l.trim());
        } else {
            updateData[field] = text;
        }

        try {
            const { error } = await supabase
                .from('projects')
                .update(updateData)
                .eq('id', projectId);

            if (error) throw error;

            bot.sendMessage(chatId, '✅ Project updated successfully!');
            delete userStates[chatId];
        } catch (error) {
            console.error('Update error:', error);
            bot.sendMessage(chatId, `❌ Error updating project: ${error.message}`);
            delete userStates[chatId];
        }
    }
});

bot.on('polling_error', (error) => {
    console.error('⚠️ Polling error:', error.code, error.message);
});

console.log('\n✅ Bot setup complete. Waiting for messages...\n');
