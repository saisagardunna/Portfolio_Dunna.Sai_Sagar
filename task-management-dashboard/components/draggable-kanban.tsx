'use client'

import React, { useState } from 'react'
import { Task } from '@/lib/supabase'
import { motion, Reorder, AnimatePresence } from 'framer-motion'
import { KanbanColumn } from './kanban-column'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface DraggableKanbanProps {
  todoTasks: Task[]
  inProgressTasks: Task[]
  completedTasks: Task[]
  onStatusChange: (taskId: string, newStatus: 'todo' | 'in-progress' | 'completed') => Promise<void>
  onEditTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
  onAddTask: () => void
}

export function DraggableKanban({
  todoTasks,
  inProgressTasks,
  completedTasks,
  onStatusChange,
  onEditTask,
  onDeleteTask,
  onAddTask,
}: DraggableKanbanProps) {
  const [todoList, setTodoList] = useState(todoTasks)
  const [inProgressList, setInProgressList] = useState(inProgressTasks)
  const [completedList, setCompletedList] = useState(completedTasks)

  React.useEffect(() => {
    setTodoList(todoTasks)
    setInProgressList(inProgressTasks)
    setCompletedList(completedTasks)
  }, [todoTasks, inProgressTasks, completedTasks])

  const handleDragEnd = async (
    task: Task,
    newStatus: 'todo' | 'in-progress' | 'completed',
  ) => {
    const currentStatus = task.status as 'todo' | 'in-progress' | 'completed'

    if (currentStatus === newStatus) return

    try {
      await onStatusChange(task.id, newStatus)

      // Show celebration animation for completion
      if (newStatus === 'completed') {
        toast.success('Task completed! 🎉', {
          description: 'Great work!',
          duration: 2000,
        })
      }
    } catch (error) {
      console.error('[v0] Error updating task:', error)
      toast.error('Failed to update task')
    }
  }

  const handleListReorder = (newList: Task[], status: 'todo' | 'in-progress' | 'completed') => {
    if (status === 'todo') setTodoList(newList)
    if (status === 'in-progress') setInProgressList(newList)
    if (status === 'completed') setCompletedList(newList)
  }

  return (
    <motion.div layout className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* To Do Column */}
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Reorder.Group
          axis="y"
          values={todoList}
          onReorder={(newList) => handleListReorder(newList, 'todo')}
          className="space-y-0"
        >
          <KanbanColumn
            title="To Do"
            status="todo"
            tasks={todoList}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
          >
            <Button
              onClick={onAddTask}
              variant="outline"
              className="w-full text-sm border-slate-600 hover:bg-slate-700 bg-transparent"
            >
              + Add Task
            </Button>
          </KanbanColumn>
        </Reorder.Group>
      </motion.div>

      {/* In Progress Column */}
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Reorder.Group
          axis="y"
          values={inProgressList}
          onReorder={(newList) => handleListReorder(newList, 'in-progress')}
          className="space-y-0"
        >
          <KanbanColumn
            title="In Progress"
            status="in-progress"
            tasks={inProgressList}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
          >
            <div className="text-xs text-slate-400 text-center py-2">
              Drag tasks here
            </div>
          </KanbanColumn>
        </Reorder.Group>
      </motion.div>

      {/* Completed Column */}
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Reorder.Group
          axis="y"
          values={completedList}
          onReorder={(newList) => handleListReorder(newList, 'completed')}
          className="space-y-0"
        >
          <KanbanColumn
            title="Completed"
            status="completed"
            tasks={completedList}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
          />
        </Reorder.Group>
      </motion.div>
    </motion.div>
  )
}
