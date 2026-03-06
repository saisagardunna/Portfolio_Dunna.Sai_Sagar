'use client'

import { Task } from '@/lib/supabase'
import { Calendar } from '@/components/ui/calendar'
import { useState } from 'react'
import { format, isToday, isTomorrow } from 'date-fns'
import { Badge } from '@/components/ui/badge'

interface TaskCalendarProps {
  tasks: Task[]
}

export function TaskCalendar({ tasks }: TaskCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  // Get tasks for selected date
  const tasksForDate = tasks.filter((task) => {
    if (!task.due_date) return false
    const taskDate = new Date(task.due_date)
    return (
      taskDate.getDate() === selectedDate.getDate() &&
      taskDate.getMonth() === selectedDate.getMonth() &&
      taskDate.getFullYear() === selectedDate.getFullYear()
    )
  })

  // Get dates that have tasks
  const datesWithTasks = new Set(
    tasks
      .filter((t) => t.due_date)
      .map((t) => new Date(t.due_date!).toDateString())
  )

  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        disabled={(date) => date > new Date()}
        className="bg-slate-800/30 border-slate-700"
      />

      {tasksForDate.length > 0 && (
        <div className="space-y-2 pt-4 border-t border-slate-700">
          <p className="text-xs text-slate-400 uppercase tracking-wide">
            {isToday(selectedDate)
              ? 'Today'
              : isTomorrow(selectedDate)
                ? 'Tomorrow'
                : format(selectedDate, 'EEEE')}
          </p>
          <div className="space-y-2">
            {tasksForDate.map((task) => (
              <div
                key={task.id}
                className="p-2 bg-slate-700/30 rounded border border-slate-600/30 text-xs"
              >
                <p className="text-slate-100 font-medium truncate">
                  {task.title}
                </p>
                <div className="flex gap-1 mt-1">
                  <Badge
                    variant="outline"
                    className="text-xs"
                  >
                    {task.status}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="text-xs"
                  >
                    {task.priority}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tasksForDate.length === 0 && (
        <p className="text-sm text-slate-400 pt-4 text-center">
          No tasks for this date
        </p>
      )}
    </div>
  )
}
