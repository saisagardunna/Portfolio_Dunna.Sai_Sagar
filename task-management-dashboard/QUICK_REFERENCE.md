# TaskFlow - Quick Reference Guide

Fast lookup for common tasks and commands.

## Setup in 5 Minutes

```bash
# 1. Install
npm install

# 2. Create .env.local with:
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
# GROQ_API_KEY=...

# 3. Run database setup
# Execute scripts/init-db.sql in Supabase

# 4. Start dev
npm run dev

# 5. Open http://localhost:3000
```

## Common Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linting
vercel --env-file .env.local  # Deploy to Vercel
```

## File Locations

| Need | Location |
|------|----------|
| Create task component | `/components/` |
| Add API endpoint | `/app/api/` |
| Database schema | `/scripts/init-db.sql` |
| Utilities | `/lib/` |
| Custom hooks | `/hooks/` |
| Global styles | `/app/globals.css` |
| Component exports | Check each file |

## API Quick Links

```bash
# Create task
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Task","priority":"medium"}'

# Get tasks
curl "http://localhost:3000/api/tasks?userId=user123"

# AI generate task
curl -X POST http://localhost:3000/api/ai/generate-task \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Build a dashboard"}'
```

## Component Hierarchy

```
app/page.tsx
└── TaskDashboard
    ├── TaskStats
    ├── DraggableKanban
    │   ├── KanbanColumn (x3)
    │   │   └── TaskCard (x many)
    │   │       ├── TaskModal (edit)
    │   │       └── Delete button
    ├── TaskCalendar / ScheduleView
    ├── NotificationPanel
    └── AITaskInput
```

## Environment Variables Checklist

```env
# Required for Supabase
NEXT_PUBLIC_SUPABASE_URL=              ✓ Copy from Supabase dashboard
NEXT_PUBLIC_SUPABASE_ANON_KEY=         ✓ Copy from Supabase dashboard

# Required for Groq AI
GROQ_API_KEY=                          ✓ Get from console.groq.com
```

## Deployment Checklist

- [ ] Environment variables set in Vercel
- [ ] Database schema created (`scripts/init-db.sql`)
- [ ] All tests passing locally
- [ ] `npm run build` succeeds
- [ ] No console errors
- [ ] Features tested on deployed app

## Styling Quick Tips

```tsx
// Use design tokens instead of hardcoded colors
// DO:
<div className="bg-card text-foreground border-border">

// DON'T:
<div className="bg-slate-800 text-white border-slate-700">

// For layouts, prefer flex
<div className="flex items-center justify-between gap-4">

// Responsive with Tailwind
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

## Common Modifications

### Change Accent Color
Edit in `globals.css`:
```css
:root {
  --accent: 47 100% 56%;  /* Change these values */
  --accent-foreground: 2 11% 5%;
}
```

### Add New Task Status
1. Update database schema
2. Update Task type in `lib/task-utils.ts`
3. Update `kanban-column.tsx` config
4. Update API routes

### Add New API Endpoint
```ts
// Create /app/api/new-endpoint/route.ts
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    // Your logic here
    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
```

### Add Animation to Component
```tsx
import { motion } from 'framer-motion'

export function MyComponent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      Content
    </motion.div>
  )
}
```

## Debugging

### Check Database Connection
```ts
// In any API route
const { data, error } = await supabase
  .from('tasks')
  .select('*')
  .limit(1)

console.log('[v0] DB test:', { data, error })
```

### Check Groq API
```ts
// In API route
const { text } = await generateText({
  model: groq('llama-3.3-70b-versatile'),
  prompt: 'Test prompt',
})
console.log('[v0] Groq response:', text)
```

### View Network Requests
- Open DevTools (F12)
- Go to Network tab
- Filter by Fetch/XHR
- Check request/response

## Performance Tips

1. **Reduce Re-renders**: Use callbacks and memoization
2. **Code Split**: Use dynamic imports for large components
3. **Optimize Images**: Use Next.js Image component
4. **Cache Data**: SWR already handles this
5. **Lazy Load**: Defer non-critical imports

## Security Reminders

- ✅ Never expose API keys in client code
- ✅ Always validate inputs on backend
- ✅ Use environment variables for secrets
- ✅ Sanitize user input
- ✅ Use parameterized queries (Supabase handles this)

## Git Workflow

```bash
# Feature branch
git checkout -b feature/task-feature
git add .
git commit -m "Add new feature"
git push origin feature/task-feature

# Automatic Vercel deployment on PR
# Manual deployment
git push origin main
```

## Monitoring URLs

| Service | URL |
|---------|-----|
| Vercel | vercel.com/dashboard |
| Supabase | supabase.com/projects |
| Groq | console.groq.com |
| GitHub | github.com/your-repo |

## Getting Help

```bash
# Check Next.js docs
https://nextjs.org/docs

# Check Supabase docs
https://supabase.com/docs

# Check Groq docs
https://console.groq.com/docs

# Check Tailwind docs
https://tailwindcss.com/docs

# Check React docs
https://react.dev
```

## Quick Test Checklist

```
[ ] Create task with AI
[ ] Create task manually
[ ] Edit task
[ ] Delete task
[ ] Drag task to In Progress
[ ] Drag task to Completed
[ ] View calendar
[ ] View schedule
[ ] Check notifications
[ ] View statistics
```

## Performance Benchmarks

Target metrics:
- Build time: <60s
- Page load: <2s
- First paint: <1s
- Time to interactive: <2s
- Lighthouse score: 90+

## Keyboard Shortcuts (Future)

```
Ctrl+K     Search/Command palette
Ctrl+N     New task
Ctrl+E     Edit selected task
Ctrl+D     Delete selected task
Esc        Close modal
Enter      Submit form
```

## Deploy Preview

```bash
# Automatic with Vercel
git push origin feature-branch

# Manual preview
vercel --prod
```

## Rollback if Needed

```bash
# In Vercel dashboard
Deployments → Select older version → Promote
```

## Production Checklist

- [ ] All env vars configured
- [ ] Database backups enabled
- [ ] Monitoring/alerts set up
- [ ] Error tracking enabled
- [ ] Analytics configured
- [ ] SEO optimized
- [ ] Performance monitored
- [ ] Security audited

---

For detailed info, see:
- 📚 README.md
- 🔧 SETUP_GUIDE.md
- 📋 TASKFLOW_FEATURES.md
- 🏗️ PROJECT_STRUCTURE.md
