# TaskFlow - AI-Powered Task Management System

A comprehensive task management dashboard built with Next.js, Groq AI, Supabase, and Framer Motion animations.

## Features

### 1. AI-Powered Task Generation with Groq
- Natural language task creation using Groq's LLM
- Automatically parses task description, priority, and due date
- Smart suggestions for common task types
- Real-time task typing and classification

### 2. Kanban Board Dashboard
- Three-column workflow: To Do, In Progress, Completed
- Real-time task status updates
- Visual priority indicators (Low, Medium, High)
- Task count badges per column
- Responsive design for all screen sizes

### 3. Drag & Drop Functionality
- Smooth drag-and-drop between columns using Framer Motion
- Animated task reordering within columns
- Visual feedback during dragging
- Automatic status updates when tasks are moved

### 4. Calendar & Scheduling System
- Interactive calendar view with task dates
- Schedule view with grouped tasks:
  - Today/Tomorrow highlighting
  - This Week/This Month grouping
  - Later tasks organization
- Overdue task alerts with visual indicators
- Due date management and display

### 5. Task Management Features
- Create, edit, and delete tasks
- Task details: title, description, priority, due date
- Task history and status tracking
- Bulk operations support

### 6. Notifications & Alerts
- Real-time notification panel
- Overdue task alerts
- Due today notifications
- Recently completed task tracking
- Task completion celebrations with confetti animations

### 7. Task Statistics Dashboard
- Total tasks counter
- To Do / In Progress / Completed breakdown
- Overdue task tracking
- Visual stat cards with icons and colors
- Real-time statistics updates

### 8. Beautiful UI with Animations
- Modern dark theme with accent colors (Gold/Yellow)
- Smooth Framer Motion animations throughout
- Hover effects and transitions
- Loading skeletons for better UX
- Empty states with helpful guidance
- Celebration animations on task completion

## Technology Stack

### Frontend
- **Framework**: Next.js 16 with App Router
- **UI Components**: Shadcn/ui
- **Styling**: Tailwind CSS with custom design tokens
- **Animations**: Framer Motion with Reorder API
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Notifications**: Sonner toast notifications

### Backend
- **Database**: Supabase (PostgreSQL)
- **AI Integration**: Groq (via AI SDK)
- **API**: Next.js Route Handlers
- **Data Fetching**: SWR for client-side caching

### Deployment
- **Hosting**: Vercel
- **Environment Variables**: Supabase keys, Groq API key

## Database Schema

### Tasks Table
- `id`: UUID primary key
- `user_id`: String (user identifier)
- `title`: String (task title)
- `description`: Text (optional)
- `status`: Enum (todo, in-progress, completed)
- `priority`: Enum (low, medium, high)
- `due_date`: Timestamp (optional)
- `created_at`: Timestamp
- `updated_at`: Timestamp
- `ai_generated`: Boolean

### Notifications Table
- `id`: UUID primary key
- `user_id`: String
- `type`: Enum (task_created, task_updated, task_completed, task_reminder)
- `title`: String
- `message`: Text (optional)
- `task_id`: UUID (foreign key)
- `read`: Boolean
- `created_at`: Timestamp

### Task History Table
- `id`: UUID primary key
- `task_id`: UUID (foreign key)
- `user_id`: String
- `action`: String
- `old_value`: JSONB
- `new_value`: JSONB
- `created_at`: Timestamp

## API Endpoints

### Tasks
- `GET /api/tasks` - Fetch all tasks for a user
- `POST /api/tasks` - Create new task
- `PATCH /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

### AI Generation
- `POST /api/ai/generate-task` - Generate task with Groq AI

### Notifications
- `GET /api/notifications` - Fetch notifications
- `POST /api/notifications` - Create notification

## Usage

### Creating Tasks
1. Use the AI input at the top of the dashboard
2. Describe what you want to do in natural language
3. AI will parse and create the task automatically
4. Or manually create tasks through the "Add Task" button

### Managing Tasks
1. **View**: See all tasks in the kanban board or calendar
2. **Edit**: Click the edit icon to modify task details
3. **Move**: Drag and drop between columns to change status
4. **Delete**: Click the trash icon to remove tasks

### Tracking Progress
- Monitor statistics on the dashboard
- Check notifications for overdue and upcoming tasks
- View schedule for better time management
- Celebrate when tasks are completed

## Design System

### Colors
- **Primary**: #0f172a (dark background)
- **Accent**: #FFEF5E (gold/yellow)
- **Card**: #1f293c (card backgrounds)
- **Border**: #334155 (borders)
- **Foreground**: #f1f5f9 (text)
- **Muted**: #64748b (secondary text)

### Typography
- **Headings**: Bold weights for emphasis
- **Body**: Regular weight for readability
- **Monospace**: For technical content

### Spacing
- Uses Tailwind's spacing scale
- Consistent 4px grid system
- Gap utilities for layout spacing

## Future Enhancements

- Team collaboration and task sharing
- Recurring tasks and templates
- Advanced filtering and search
- Time tracking integration
- Analytics and reporting dashboard
- Mobile app (React Native)
- Slack integration
- Calendar sync (Google, Outlook)
- Performance metrics and burndown charts

## Environment Variables Required

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
```

## Getting Started

1. Install dependencies: `npm install`
2. Set up environment variables in `.env.local`
3. Run development server: `npm run dev`
4. Open http://localhost:3000

## Deployment on Vercel

1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel project settings
3. Deploy with `git push` to main branch
4. Access your deployed app at the Vercel URL

## Notes for Portfolio Integration

This task management system is production-ready and can be showcased as:
- Full-stack application with modern tech stack
- AI integration example
- Real-time collaborative features
- Responsive design showcase
- Animation and UX excellence
- Database design and optimization
- API design best practices

Perfect for demonstrating your capabilities in web development, AI integration, and product design!
