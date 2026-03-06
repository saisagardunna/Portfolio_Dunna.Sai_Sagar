# TaskFlow Project Structure

Complete guide to all files and components in the TaskFlow system.

## Directory Overview

```
/app
  /api
    /ai
      /generate-task
        route.ts          # Groq AI task generation endpoint
    /tasks
      route.ts           # GET/POST tasks endpoints
      /[id]
        route.ts         # PATCH/DELETE task endpoints
    /notifications
      route.ts           # GET/POST notifications endpoints
  layout.tsx             # Root layout with metadata and providers
  page.tsx               # Main page with TaskDashboard
  globals.css            # Design tokens and global styles

/components
  # Core Components
  task-dashboard.tsx     # Main dashboard with kanban board
  task-card.tsx          # Individual task card component
  kanban-column.tsx      # Kanban column container
  draggable-kanban.tsx   # Enhanced drag-and-drop kanban
  
  # AI & Input
  ai-task-input.tsx      # AI-powered task input with suggestions
  
  # Task Management
  task-modal.tsx         # Create/edit task modal
  task-stats.tsx         # Statistics dashboard cards
  
  # Calendar & Scheduling
  task-calendar.tsx      # Interactive calendar view
  schedule-view.tsx      # Scheduled tasks timeline view
  
  # Notifications
  notification-panel.tsx # Notification center
  
  # UX & Polish
  celebration.tsx        # Confetti animation on completion
  empty-state.tsx        # Empty state component
  task-skeleton.tsx      # Loading skeletons
  
  # UI Components (from shadcn/ui)
  /ui
    badge.tsx
    button.tsx
    card.tsx
    dialog.tsx
    input.tsx
    label.tsx
    select.tsx
    textarea.tsx
    sonner.tsx           # Toast notifications

/lib
  supabase.ts            # Supabase client setup
  task-utils.ts          # Task utilities, types, and helpers
  utils.ts              # General utilities (cn function)

/hooks
  use-tasks.ts           # SWR hooks for task data fetching
  use-mobile.ts          # Mobile detection hook

/scripts
  init-db.sql            # Database schema creation script

/public
  # Static assets (images, icons, etc.)

## File Descriptions

### API Routes

#### `/api/ai/generate-task/route.ts`
- **Purpose**: Generate tasks using Groq LLM
- **Method**: POST
- **Payload**: `{ prompt: string }`
- **Response**: `{ title, description, priority, due_date }`
- **Features**: Natural language parsing, intelligent categorization

#### `/api/tasks/route.ts`
- **Purpose**: Fetch and create tasks
- **Methods**: GET, POST
- **GET Params**: `userId`
- **POST Body**: Task data (title, description, etc.)
- **Returns**: Array of tasks or single created task

#### `/api/tasks/[id]/route.ts`
- **Purpose**: Update and delete individual tasks
- **Methods**: PATCH, DELETE
- **Params**: Task ID
- **Features**: Status updates, field modifications

#### `/api/notifications/route.ts`
- **Purpose**: Manage task notifications
- **Methods**: GET, POST
- **Features**: Real-time alerts, task reminders

### Components

#### Core Dashboard
- **task-dashboard.tsx**: Main orchestrator component
  - Manages task state
  - Handles CRUD operations
  - Coordinates sub-components
  - Features: Real-time updates, modal management

#### Task Display
- **task-card.tsx**: Individual task UI
  - Priority badges
  - Due date display
  - Edit/delete actions
  - Animations and hover effects

- **kanban-column.tsx**: Column container
  - Task grouping by status
  - Task count display
  - Column icons and styling

- **draggable-kanban.tsx**: Enhanced kanban with drag-drop
  - Reorder.Group for smooth dragging
  - Status change handling
  - Animation orchestration

#### Input & Creation
- **ai-task-input.tsx**: AI-powered task creation
  - Natural language input
  - Quick suggestion buttons
  - Loading states
  - Real-time AI feedback

- **task-modal.tsx**: Task creation/editing form
  - Title, description fields
  - Priority selection
  - Due date picker
  - Form validation

#### Calendar & Scheduling
- **task-calendar.tsx**: Calendar widget
  - Interactive date selection
  - Task highlighting
  - Due date navigation

- **schedule-view.tsx**: Timeline view
  - Today/Tomorrow grouping
  - Weekly/monthly buckets
  - Overdue alerts
  - Priority indicators

#### Notifications
- **notification-panel.tsx**: Notification center
  - Overdue alerts
  - Due today tasks
  - Recently completed
  - Statistics summary

#### Polish & UX
- **celebration.tsx**: Completion animations
  - Confetti effect
  - Celebration message
  - Auto-dismiss

- **empty-state.tsx**: Empty state UI
  - Icon display
  - Helpful messaging
  - Call-to-action buttons

- **task-skeleton.tsx**: Loading states
  - Dashboard skeleton
  - Task card skeleton
  - Smooth transitions

### Utilities

#### `lib/supabase.ts`
- Supabase client initialization
- Database connection setup
- Authentication (when added)

#### `lib/task-utils.ts`
- Task types and interfaces
- Status and priority enums
- Helper functions:
  - `createTask()`: API wrapper
  - `updateTask()`: Modification
  - `deleteTask()`: Removal
  - `formatDate()`: Date formatting
  - `getTaskStats()`: Statistics calculation
  - `groupTasksByDate()`: Grouping logic

#### `hooks/use-tasks.ts`
- `useTasks()`: Fetch tasks with SWR
- `useTasksGrouped()`: Pre-grouped task data
- `useNotifications()`: Real-time notifications
- Auto-revalidation and caching

### Database

#### Tables
1. **tasks**
   - Core task data
   - Status and priority
   - User relationship
   - Timestamps

2. **notifications**
   - Alert system
   - Task references
   - User targeting
   - Read status

3. **task_history** (future)
   - Change tracking
   - Audit log
   - Undo capability

## Data Flow

### Create Task
1. User inputs natural language in AI input
2. Frontend calls `/api/ai/generate-task`
3. Groq parses and returns structured data
4. Frontend calls `/api/tasks` to save
5. Supabase stores in `tasks` table
6. Frontend updates local state
7. Dashboard re-renders with new task

### Update Task Status
1. User drags task to new column
2. Drag handler calls `onStatusChange()`
3. Frontend calls `/api/tasks/[id]` PATCH
4. Supabase updates status
5. Notification created if completed
6. Frontend updates UI
7. Celebration animation triggered (if completed)

### View Notifications
1. Dashboard loads notification panel
2. Fetches from `/api/notifications`
3. Groups by type (overdue, due today, etc.)
4. Displays with icons and colors
5. Real-time updates every 10 seconds

## State Management

### Client-Side
- React hooks (useState)
- SWR for data fetching and caching
- Context for shared state (future)

### Server-Side
- Supabase PostgreSQL
- Row-level security (future)
- Automatic timestamps

## Styling System

### Colors
- Defined in `globals.css` as CSS variables
- Used throughout with Tailwind classes
- Dark theme optimized for productivity

### Components
- Shadcn/ui base components
- Custom class compositions in `globals.css`
- Tailwind for responsive design

### Animations
- Framer Motion for transitions
- Page transitions
- Drag animations
- Celebration effects

## Performance Considerations

1. **Data Fetching**
   - SWR with deduplication
   - 5-second intervals for task data
   - 10-second intervals for notifications

2. **Rendering**
   - Component splitting
   - Memoization where needed
   - Lazy loading for modals

3. **Bundle Size**
   - Tree-shaking enabled
   - Code splitting in Next.js
   - Minimal external dependencies

## Testing Strategy (Future)

- Unit tests for utilities
- Integration tests for API routes
- Component tests with React Testing Library
- E2E tests with Playwright
- Performance testing

## Deployment Pipeline

1. Code push to GitHub
2. Vercel builds project
3. Environment variables loaded
4. Database migrations verified
5. Deploy to preview/production
6. Health checks and monitoring

## Adding Features

### New Page
1. Create route in `/app`
2. Add layout if needed
3. Connect to existing components
4. Update navigation

### New API Endpoint
1. Create route in `/api`
2. Add database query
3. Add error handling
4. Update frontend fetch calls

### New Component
1. Create in `/components`
2. Add TypeScript types
3. Use existing UI components
4. Export from component
5. Import in parent

## Common Tasks

### Debug Database Issues
- Check `NEXT_PUBLIC_SUPABASE_URL` env var
- Verify table names in SQL
- Check Supabase dashboard for data
- Review API error responses

### Add New Task Field
1. Update database schema
2. Update Task interface in `task-utils.ts`
3. Update modal form
4. Update API routes
5. Update display components

### Modify Colors
1. Edit CSS variables in `globals.css`
2. Update color names if needed
3. Rebuild and test
4. Check all components use tokens

## Resources

- Full documentation in `TASKFLOW_FEATURES.md`
- Setup instructions in `SETUP_GUIDE.md`
- Component props in TypeScript files
- Utility functions in `lib/` folder

This structure is organized for scalability and maintainability. Each layer has a clear responsibility and components are reusable across the application.
