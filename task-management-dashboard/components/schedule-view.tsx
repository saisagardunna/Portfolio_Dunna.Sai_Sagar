'use client'

import { Task } from '@/lib/supabase'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format, isToday, isTomorrow, differenceInDays } from 'date-fns'
import { AlertCircle, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

interface ScheduleViewProps {
  tasks: Task[]
}

export function ScheduleView({ tasks }: ScheduleViewProps) {
  // Sort tasks by due date
  const sortedTasks = [...tasks]
    .filter((t) => t.due_date && t.status !== 'completed')
    .sort((a, b) => {
      if (!a.due_date || !b.due_date) return 0
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
    })

  const groupedTasks = sortedTasks.reduce(
    (acc, task) => {
      if (!task.due_date) return acc
      const dueDate = new Date(task.due_date)
      const today = new Date()
      const daysFromNow = differenceInDays(dueDate, today)

      let group = 'later'
      if (isToday(dueDate)) group = 'today'
      else if (isTomorrow(dueDate)) group = 'tomorrow'
      else if (daysFromNow <= 7) group = 'week'
      else if (daysFromNow <= 30) group = 'month'

      if (!acc[group]) acc[group] = []
      acc[group].push(task)
      return acc
    },
    {} as Record<string, Task[]>,
  )

  const groups = [
    { key: 'today', label: '📌 Today', icon: '🔴' },
    { key: 'tomorrow', label: '📅 Tomorrow', icon: '🟠' },
    { key: 'week', label: '📆 This Week', icon: '🟡' },
    { key: 'month', label: '🗓️ This Month', icon: '🟢' },
    { key: 'later', label: '⏰ Later', icon: '⚪' },
  ]

  const priorityColors = {
    low: 'text-blue-400',
    medium: 'text-yellow-400',
    high: 'text-red-400',
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => {
        const groupTasks = groupedTasks[group.key] || []
        if (groupTasks.length === 0) return null

        return (
          <motion.div
            key={group.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span>{group.icon}</span>
              {group.label}
              <Badge variant="secondary" className="ml-auto text-xs">
                {groupTasks.length}
              </Badge>
            </h3>

            <div className="space-y-2">
              {groupTasks.map((task) => {
                const dueDate = new Date(task.due_date!)
                const isOverdue =
                  dueDate < new Date() && task.status !== 'completed'

                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-3 rounded-lg border transition-all ${
                      isOverdue
                        ? 'bg-red-500/10 border-red-500/30'
                        : 'bg-card border-border/50 hover:border-accent/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground line-clamp-1">
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {format(dueDate, 'MMM d, h:mm a')}
                          </span>
                          {isOverdue && (
                            <>
                              <AlertCircle className="w-3 h-3 text-red-400" />
                              <span className="text-xs text-red-400">
                                Overdue
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            priorityColors[task.priority]
                          }`}
                        >
                          {task.priority}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="text-xs capitalize"
                        >
                          {task.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )
      })}

      {Object.values(groupedTasks).flat().length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No upcoming tasks scheduled
          </p>
        </div>
      )}
    </div>
  )
}
