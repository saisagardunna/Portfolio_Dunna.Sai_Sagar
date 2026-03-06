'use client'

import { Card } from '@/components/ui/card'
import { getTaskStats, type Task } from '@/lib/task-utils'
import { CheckCircle2, Clock, ListTodo, AlertCircle } from 'lucide-react'

interface TaskStatsProps {
  tasks: Task[]
}

export function TaskStats({ tasks }: TaskStatsProps) {
  const stats = getTaskStats(tasks)

  const statItems = [
    {
      label: 'Total Tasks',
      value: stats.total,
      icon: ListTodo,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'To Do',
      value: stats.todo,
      icon: ListTodo,
      color: 'text-slate-400',
      bgColor: 'bg-slate-500/10',
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      icon: Clock,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: CheckCircle2,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'Overdue',
      value: stats.overdue,
      icon: AlertCircle,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statItems.map((item) => {
        const Icon = item.icon
        return (
          <Card
            key={item.label}
            className="bg-card border-border/50 p-4 hover:border-accent/50 transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  {item.label}
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {item.value}
                </p>
              </div>
              <div className={`${item.bgColor} p-3 rounded-lg`}>
                <Icon className={`w-5 h-5 ${item.color}`} />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
