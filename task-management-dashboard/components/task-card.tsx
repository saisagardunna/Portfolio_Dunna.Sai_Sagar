'use client'

import { Task } from '@/lib/supabase'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { format } from 'date-fns'
import { Trash2, Edit2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface TaskCardProps {
  task: Task
  onEdit?: (task: Task) => void
  onDelete?: (taskId: string) => void
  isDragging?: boolean
}

const priorityColors = {
  low: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  medium: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  high: 'bg-red-500/20 text-red-300 border-red-500/30',
}

const statusIcons = {
  todo: '📝',
  'in-progress': '⚙️',
  completed: '✅',
}

export function TaskCard({ task, onEdit, onDelete, isDragging }: TaskCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      whileDrag={{ scale: 1.02, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`p-4 bg-card border-border/50 hover:border-accent/50 transition-all cursor-grab active:cursor-grabbing ${
          isDragging ? 'opacity-60 scale-95 shadow-lg' : 'shadow-md'
        }`}
      >
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-100 text-sm break-words line-clamp-2">
                {statusIcons[task.status]} {task.title}
              </h3>
              {task.description && (
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>
            <div className="flex gap-1 flex-shrink-0">
              {onEdit && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(task)}
                  className="h-6 w-6 p-0 hover:bg-slate-700"
                >
                  <Edit2 className="w-3 h-3" />
                </Button>
              )}
              {onDelete && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(task.id)}
                  className="h-6 w-6 p-0 hover:bg-red-900/20"
                >
                  <Trash2 className="w-3 h-3 text-red-400" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <Badge
              variant="outline"
              className={`text-xs ${priorityColors[task.priority]}`}
            >
              {task.priority}
            </Badge>
            {task.due_date && (
              <span className="text-xs text-slate-400">
                📅 {format(new Date(task.due_date), 'MMM d')}
              </span>
            )}
            {task.ai_generated && (
              <Badge variant="secondary" className="text-xs bg-purple-500/20 text-purple-300 border-purple-500/30">
                🤖 AI
              </Badge>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
