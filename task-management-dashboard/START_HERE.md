# TaskFlow - START HERE

Welcome! You've got an amazing AI-powered task management system. Here's how to get it running in 5 minutes.

## 30-Second Overview

TaskFlow is a full-stack task management app with:
- 🤖 AI task generation (Groq)
- 📋 Kanban board with drag-and-drop
- 📅 Calendar scheduling
- 🔔 Real-time notifications
- ✨ Beautiful animations
- 🚀 Ready to deploy

## Quick Start (5 minutes)

### 1. Get Your API Keys

**Supabase Keys:**
1. Go to [supabase.com](https://supabase.com)
2. Create account (free tier works great)
3. Create a project
4. Go to Settings → API
5. Copy `Project URL` and `anon public` key

**Groq API Key:**
1. Go to [console.groq.com](https://console.groq.com)
2. Create account (free tier available)
3. Create API key
4. Copy the key

### 2. Create `.env.local`

In your project root, create a file named `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=paste_your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste_your_supabase_key_here
GROQ_API_KEY=paste_your_groq_key_here
```

### 3. Setup Database

1. Go to your Supabase project
2. Click "SQL Editor" (left sidebar)
3. Click "New query"
4. Copy everything from `scripts/init-db.sql`
5. Paste into the editor
6. Click "Run"

Done! Your database is ready.

### 4. Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Test It

1. Try the AI: Type "Build a dashboard by Friday" in the input
2. Drag a task to "In Progress"
3. Drag a task to "Completed" (watch the celebration!)
4. Click the calendar icon
5. Click the notification bell

## Deploy to Vercel

```bash
vercel --env-file .env.local
```

Set the environment variables in Vercel dashboard. Done!

## Documentation Guide

**Quick questions?**
- **Setup Help**: Read [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **Features**: Read [TASKFLOW_FEATURES.md](TASKFLOW_FEATURES.md)
- **Architecture**: Read [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)
- **Quick Tips**: Read [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
- **Portfolio**: Read [PORTFOLIO_SHOWCASE.md](PORTFOLIO_SHOWCASE.md)
- **What Was Built**: Read [BUILD_SUMMARY.md](BUILD_SUMMARY.md)

## Troubleshooting

### Tasks not showing?
- Check env vars in `.env.local`
- Check database tables exist in Supabase
- Clear browser cache and reload

### AI not working?
- Verify `GROQ_API_KEY` is valid
- Check you're on free Groq tier (limited requests)
- Try a simpler prompt

### Can't drag tasks?
- Refresh the page
- Check JavaScript is enabled
- Try different browser

More help? See [SETUP_GUIDE.md](SETUP_GUIDE.md) Troubleshooting section.

## What's Included

✅ Complete frontend (React + Next.js)
✅ Complete backend (API routes)
✅ Database schema (SQL ready)
✅ All features implemented
✅ Beautiful UI with animations
✅ Full documentation
✅ Deployment ready

## Project Files

```
Key Files:
- app/page.tsx          ← Main app
- components/           ← All UI components
- app/api/              ← Backend endpoints
- scripts/init-db.sql   ← Database setup
- globals.css           ← Colors & styles
```

## Next Steps

1. ✅ Setup env vars
2. ✅ Create database
3. ✅ Run locally
4. ✅ Test features
5. ✅ Deploy to Vercel
6. ✅ Share on portfolio
7. ✅ Impress people!

## Show This Off

The **most impressive part**: AI task generation
- Type: "Build a landing page by Friday with dark theme"
- AI instantly parses it into a task
- People are always impressed

Try it! It genuinely works.

## Need More Help?

1. **Features?** → TASKFLOW_FEATURES.md
2. **Setup stuck?** → SETUP_GUIDE.md
3. **Code questions?** → PROJECT_STRUCTURE.md
4. **Quick answer?** → QUICK_REFERENCE.md
5. **Portfolio tips?** → PORTFOLIO_SHOWCASE.md
6. **What was built?** → BUILD_SUMMARY.md
7. **Overall guide?** → README.md

## Key Commands

```bash
npm run dev          # Start development
npm run build        # Build for production
vercel --env-file .env.local  # Deploy
npm run lint        # Check code
```

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
GROQ_API_KEY=gsk_...
```

Get from:
- Supabase: Project Settings → API
- Groq: console.groq.com/keys

## That's It!

You're all set. The application is:
- ✅ Full-featured
- ✅ Production-ready
- ✅ Beautiful
- ✅ Documented
- ✅ Easy to deploy
- ✅ Impressive to showcase

**Go get those API keys and deploy!** 🚀

---

**Questions?** Check the relevant documentation file above.

**Stuck?** Read SETUP_GUIDE.md - it has detailed troubleshooting.

**Ready to impress?** Deploy and share the URL. The AI demo will wow people.

Good luck! This is going to be great on your portfolio.
