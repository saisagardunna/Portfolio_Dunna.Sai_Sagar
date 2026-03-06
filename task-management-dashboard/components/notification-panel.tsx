'use client'

import { Task } from '@/lib/supabase'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface NotificationPanelProps {
  tasks: Task[]
  upcomingCount: number
}

export function NotificationPanel({
  tasks,
  upcomingCount,
}: NotificationPanelProps) {
  // Get overdue tasks
  const overdueTasks = tasks.filter((task) => {
    if (!task.due_date || task.status === 'completed') return false
    return new Date(task.due_date) < new Date()
  })

  // Get tasks due today
  const dueTodayTasks = tasks.filter((task) => {
    if (!task.due_date || task.status === 'completed') return false
    const dueDate = new Date(task.due_date)
    const today = new Date()
    return (
      dueDate.getDate() === today.getDate() &&
      dueDate.getMonth() === today.getMonth() &&
      dueDate.getFullYear() === today.getFullYear()
    )
  })

  // Get recently completed
  const recentlyCompleted = tasks
    .filter((t) => t.status === 'completed')
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )
    .slice(0, 3)

  return (
    <div className="space-y-4">
      {overdueTasks.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <p className="text-xs font-semibold text-red-400 uppercase">
              Overdue ({overdueTasks.length})
            </p>
          </div>
          <div className="space-y-1">
            {overdueTasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                className="p-2 bg-red-500/10 border border-red-500/20 rounded text-xs text-slate-200 truncate"
              >
                {task.title}
              </div>
            ))}
          </div>
        </div>
      )}

      {dueTodayTasks.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <p className="text-xs font-semibold text-amber-400 uppercase">
              Due Today ({dueTodayTasks.length})
            </p>
          </div>
          <div className="space-y-1">
            {dueTodayTasks.map((task) => (
              <div
                key={task.id}
                className="p-2 bg-amber-500/10 border border-amber-500/20 rounded text-xs text-slate-200 truncate"
              >
                {task.title}
              </div>
            ))}
          </div>
        </div>
      )}

      {recentlyCompleted.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <p className="text-xs font-semibold text-green-400 uppercase">
              Recently Completed
            </p>
          </div>
          <div className="space-y-1">
            {recentlyCompleted.map((task) => (
              <div
                key={task.id}
                className="p-2 bg-green-500/10 border border-green-500/20 rounded text-xs text-slate-200 truncate line-through"
              >
                {task.title}
              </div>
            ))}
          </div>
        </div>
      )}

      {overdueTasks.length === 0 &&
        dueTodayTasks.length === 0 &&
        recentlyCompleted.length === 0 && (
          <p className="text-sm text-slate-400 py-4 text-center">
            All caught up! 🎉
          </p>
        )}

      <div className="pt-4 border-t border-slate-700/30">
        <p className="text-xs text-slate-400">
          📊 {tasks.filter((t) => t.status !== 'completed').length} active
          tasks
        </p>
        <p className="text-xs text-slate-400">
          ✅ {tasks.filter((t) => t.status === 'completed').length} completed
        </p>
      </div>
    </div>
  )
}
