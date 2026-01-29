# 🎯 Telegram Admin Bot - Complete Guide

## 🚀 What Does This Do?

You can now **control your entire portfolio website from your phone** using Telegram! Add, edit, and delete projects from anywhere, and see changes on your live website instantly!

## 📋 Step 1: Set Up Database

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Open your project: `https://drllledoxzmbnbldprat.supabase.co`
3. Go to **SQL Editor**
4. Copy and paste the contents of `setup-database.sql`
5. Click **RUN** to create the projects table

## 🤖 Step 2: Run the Admin Bot

### Locally (for testing):
```bash
node bot-admin.js
```

### On Cloud (24/7):
Follow the deployment guide in `TELEGRAM_BOT_DEPLOYMENT.md` but use the `bot-admin.js` file instead.

## 📱 Step 3: Use These Commands on Telegram

Open **@Sagar_portfoliobot** on your phone and try these:

### 👀 View Commands:
```
/list              - See all your projects
/view 1            - View details of project #1
/stats             - See portfolio statistics
```

### ✏️ Edit Commands:
```
/add               - Add a new project (guided process)
/edit 1            - Edit project #1
/delete 1          - Delete project #1
```

### 📝 Adding a Project (Example):

```
You: /add
Bot: Enter project title:

You: My Awesome New Project
Bot: Enter tech stack (comma-separated):

You: React, Node.js, MongoDB
Bot: Enter category (Web Dev, AI/ML, Cloud/DevOps):

You: Web Dev
Bot: Enter project link (or "none"):

You: https://myproject.vercel.app
Bot: Enter description points (one per line):

You: Built scalable web application
Implemented real-time features
Deployed on Vercel with CI/CD

Bot: ✅ Project added successfully! 🎉
```

### ✏️ Editing a Project (Example):

```
You: /edit 1
Bot: [Shows buttons for Title, Tech, Category, Link, Description]

[You tap "Title"]
Bot: Enter new title:

You: Updated Project Name
Bot: ✅ Project updated successfully!
```

## 🌟 Features:

✅ **Add Projects** - Complete guided process
✅ **Edit Projects** - Update any field easily  
✅ **Delete Projects** - Remove outdated work
✅ **Real-time Updates** - Website updates instantly
✅ **Statistics** - See your portfolio stats
✅ **Mobile Control** - Manage from anywhere

## 🔐 Security (Optional):

To restrict access to only you:

1. Message **@userinfobot** on Telegram to get your user ID
2. Add to `.env.local`:
   ```
   ADMIN_TELEGRAM_ID=your_user_id_here
   ```
3. Update line 16 in `bot-admin.js`:
   ```javascript
   return userId == ADMIN_USER_ID;
   ```

## 📂 Files Created:

```
├── bot-admin.js              - Admin bot with full CRUD operations
├── setup-database.sql        - Database schema for Supabase
├── src/components/Projects.js - Updated to load from database
└── TELEGRAM_ADMIN_GUIDE.md   - This guide
```

## 🎮 Try It Now!

1. ✅ Database is ready (run setup-database.sql)
2. ✅ Run: `node bot-admin.js`
3. ✅ Open Telegram → @Sagar_portfoliobot
4. ✅ Type: `/list`
5. ✅ Try: `/add` to create a new project!

Your website will automatically show all changes! 🚀
