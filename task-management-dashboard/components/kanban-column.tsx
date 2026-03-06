'use client'

import React from "react"

import { Task } from '@/lib/supabase'
import { TaskCard } from './task-card'
import { motion } from 'framer-motion'

interface KanbanColumnProps {
  title: string
  status: 'todo' | 'in-progress' | 'completed'
  tasks: Task[]
  onEditTask?: (task: Task) => void
  onDeleteTask?: (taskId: string) => void
  children?: React.ReactNode
}

const columnConfig = {
  todo: { icon: '📝', color: 'border-blue-500/30', bgColor: 'bg-blue-500/5', label: 'bg-blue-500/10' },
  'in-progress': { icon: '⚡', color: 'border-amber-500/30', bgColor: 'bg-amber-500/5', label: 'bg-amber-500/10' },
  completed: { icon: '✅', color: 'border-green-500/30', bgColor: 'bg-green-500/5', label: 'bg-green-500/10' },
}

export function KanbanColumn({
  title,
  status,
  tasks,
  onEditTask,
  onDeleteTask,
  children,
}: KanbanColumnProps) {
  const config = columnConfig[status]

  return (
    <motion.div
      layout
      className={`flex flex-col bg-secondary/20 rounded-lg border ${config.color} p-4 h-full min-h-96`}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">{config.icon}</span>
        <h2 className="font-semibold text-foreground">{title}</h2>
        <span className={`ml-auto ${config.label} text-muted-foreground text-xs px-2 py-1 rounded-full`}>
          {tasks.length}
        </span>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
        <motion.div layout className="space-y-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}
        </motion.div>
      </div>

      {children && <div className="mt-3 pt-3 border-t border-slate-700/30">{children}</div>}
    </motion.div>
  )
}
