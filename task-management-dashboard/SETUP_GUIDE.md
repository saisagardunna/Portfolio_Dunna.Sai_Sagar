# TaskFlow Setup Guide

Complete guide to set up and deploy TaskFlow on your Vercel project.

## Prerequisites

1. Supabase account (free tier available at supabase.com)
2. Groq API key (free tier available at console.groq.com)
3. Vercel account connected to GitHub
4. Node.js 18+ installed locally

## Step 1: Supabase Setup

### Create Database Tables

1. Go to your Supabase project dashboard
2. Click "SQL Editor" in the left sidebar
3. Create a new query and paste the SQL from `scripts/init-db.sql`
4. Execute the query to create all tables with proper structure

### Get Supabase Credentials

1. Go to Project Settings → API
2. Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
3. Copy `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Save these for later

## Step 2: Groq API Key Setup

1. Visit https://console.groq.com/
2. Sign up or log in
3. Create a new API key
4. Copy the key → `GROQ_API_KEY`
5. Save for later

## Step 3: Environment Variables

Create `.env.local` in project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
GROQ_API_KEY=your_groq_api_key_here
```

## Step 4: Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## Step 5: Test Features

- Create a task using AI (describe what you want to do)
- Verify Groq AI parses the task correctly
- Create tasks manually via the modal
- Drag tasks between columns
- Check calendar view
- View notifications
- Verify database updates in Supabase

## Step 6: Deploy to Vercel

### Option 1: GitHub Integration (Recommended)

1. Push code to GitHub repository
2. Connect GitHub to Vercel project
3. Add environment variables in Vercel:
   - Project Settings → Environment Variables
   - Add all three env vars from Step 3
4. Deploy via `git push`

### Option 2: Manual Deploy

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --env-file .env.local

# Set env vars in Vercel dashboard after deployment
```

## Post-Deployment

1. Test all features on live deployment
2. Check browser console for errors
3. Verify database connections work
4. Test notifications functionality
5. Monitor Vercel analytics

## Troubleshooting

### Database Connection Issues
- Verify `NEXT_PUBLIC_SUPABASE_URL` and keys are correct
- Check Supabase project is active
- Ensure tables exist (run `init-db.sql` if missing)

### Groq API Errors
- Verify `GROQ_API_KEY` is valid and active
- Check API rate limits
- Ensure model name is correct: `llama-3.3-70b-versatile`

### Tasks Not Showing
- Check browser console for fetch errors
- Verify Supabase tables have data
- Check user_id is being passed correctly
- Clear browser cache and reload

### Drag & Drop Not Working
- Ensure Framer Motion is installed: `npm ls framer-motion`
- Check JavaScript is enabled
- Try different browser if issue persists

## Performance Optimization

### Database
- All queries use proper indexing
- Pagination ready for large task lists
- Real-time subscription support via Supabase

### Frontend
- SWR for client-side caching
- Code splitting with Next.js
- Optimized images and assets
- Minimal JavaScript bundle

### API
- Route handler optimization
- Error boundaries and fallbacks
- Request validation and sanitization

## Security Considerations

- Supabase RLS (Row Level Security) can be enabled
- API keys never exposed to client (future enhancement)
- Input validation on all forms
- CSRF protection via Next.js
- SQL injection prevention via parameterized queries

## Adding to Portfolio

### Showcase Points
1. **AI Integration**: Groq LLM for smart task parsing
2. **Real-time Data**: Supabase for instant updates
3. **Beautiful UX**: Framer Motion animations
4. **Full-stack**: Next.js, React, TypeScript
5. **Scalable**: Database design for growth
6. **Deployed**: Live on Vercel

### Demo Tips
- Show AI task generation first (impressive)
- Demo drag-and-drop animations
- Highlight calendar scheduling
- Show notification system
- Explain tech stack choices
- Mention future features

## Monitoring & Maintenance

### Regular Tasks
- Monitor error logs in Vercel
- Check database storage limits
- Review Groq API usage
- Update dependencies monthly

### Scaling Considerations
- Use Supabase connection pooling for more users
- Implement webhook systems for real-time updates
- Add caching layer for analytics
- Consider background jobs for notifications

## Support Resources

- Supabase Docs: https://supabase.com/docs
- Groq Docs: https://console.groq.com/docs
- Next.js Docs: https://nextjs.org/docs
- Vercel Docs: https://vercel.com/docs
- Framer Motion: https://www.framer.com/motion/

## Success Checklist

- [ ] Environment variables set
- [ ] Supabase tables created
- [ ] Groq API key obtained
- [ ] Local development works
- [ ] All features tested locally
- [ ] Deployed to Vercel
- [ ] Live deployment tested
- [ ] Error handling verified
- [ ] Performance optimized
- [ ] Portfolio integrated

Congratulations! Your TaskFlow system is ready to impress!
