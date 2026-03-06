'use client'

import { useState, useEffect, useCallback } from 'react'
import { Task } from '@/lib/supabase'
import { KanbanColumn } from './kanban-column'
import { TaskModal } from './task-modal'
import { AITaskInput } from './ai-task-input'
import { TaskStats } from './task-stats'
import { Button } from '@/components/ui/button'
import { Calendar, Menu, X, Bell } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { TaskCalendar } from './task-calendar'
import { NotificationPanel } from './notification-panel'

interface TaskDashboardProps {
  userId: string
}

export function TaskDashboard({ userId }: TaskDashboardProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | undefined>()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showCalendar, setShowCalendar] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks()
    const interval = setInterval(fetchTasks, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks', {
        headers: { 'x-user-id': userId },
      })
      if (response.ok) {
        const data = await response.json()
        setTasks(data || [])
      }
    } catch (error) {
      console.error('[v0] Error fetching tasks:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateTask = async (taskData: any) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify(taskData),
      })

      if (response.ok) {
        const newTask = await response.json()
        setTasks([...tasks, newTask])
        toast.success('Task created! ✨')
      } else {
        throw new Error('Failed to create task')
      }
    } catch (error) {
      console.error('[v0] Error creating task:', error)
      toast.error('Failed to create task')
    }
  }

  const handleUpdateTask = async (taskData: Partial<Task>) => {
    if (!selectedTask) return

    try {
      const response = await fetch(`/api/tasks/${selectedTask.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify(taskData),
      })

      if (response.ok) {
        const updatedTask = await response.json()
        setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)))
        setSelectedTask(undefined)
        toast.success('Task updated! 🎉')
      } else {
        throw new Error('Failed to update task')
      }
    } catch (error) {
      console.error('[v0] Error updating task:', error)
      toast.error('Failed to update task')
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { 'x-user-id': userId },
      })

      if (response.ok) {
        setTasks(tasks.filter((t) => t.id !== taskId))
        toast.success('Task deleted')
      } else {
        throw new Error('Failed to delete task')
      }
    } catch (error) {
      console.error('[v0] Error deleting task:', error)
      toast.error('Failed to delete task')
    }
  }

  const handleStatusChange = useCallback(
    async (taskId: string, newStatus: 'todo' | 'in-progress' | 'completed') => {
      try {
        const response = await fetch(`/api/tasks/${taskId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': userId,
          },
          body: JSON.stringify({ status: newStatus }),
        })

        if (response.ok) {
          const updatedTask = await response.json()
          setTasks(tasks.map((t) => (t.id === taskId ? updatedTask : t)))

          // Show animation for completion
          if (newStatus === 'completed') {
            toast.success('Task completed! 🎉', {
              description: 'Great work!',
            })
          }
        }
      } catch (error) {
        console.error('[v0] Error updating task status:', error)
        toast.error('Failed to update task')
      }
    },
    [tasks, userId]
  )

  const todoTasks = tasks.filter((t) => t.status === 'todo')
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress')
  const completedTasks = tasks.filter((t) => t.status === 'completed')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white">TaskFlow</h1>
              <p className="text-slate-400 text-sm">
                AI-Powered Task Management Dashboard
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowNotifications(!showNotifications)}
                className="border-slate-700 hover:bg-slate-800"
              >
                <Bell className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowCalendar(!showCalendar)}
                className="border-slate-700 hover:bg-slate-800"
              >
                <Calendar className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* AI Task Input */}
          <AITaskInput onTaskGenerated={handleCreateTask} />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Task Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <TaskStats tasks={tasks} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Kanban Board */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-slate-400">Loading tasks...</p>
              </div>
            ) : (
              <motion.div layout className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KanbanColumn
                  title="To Do"
                  status="todo"
                  tasks={todoTasks}
                  onEditTask={(task) => {
                    setSelectedTask(task)
                    setIsModalOpen(true)
                  }}
                  onDeleteTask={handleDeleteTask}
                >
                  <Button
                    onClick={() => {
                      setSelectedTask(undefined)
                      setIsModalOpen(true)
                    }}
                    variant="outline"
                    className="w-full text-sm border-slate-600 hover:bg-slate-700"
                  >
                    + Add Task
                  </Button>
                </KanbanColumn>

                <KanbanColumn
                  title="In Progress"
                  status="in-progress"
                  tasks={inProgressTasks}
                  onEditTask={(task) => {
                    setSelectedTask(task)
                    setIsModalOpen(true)
                  }}
                  onDeleteTask={handleDeleteTask}
                >
                  <div className="text-xs text-slate-400 text-center py-2">
                    Drag from To Do
                  </div>
                </KanbanColumn>

                <KanbanColumn
                  title="Completed"
                  status="completed"
                  tasks={completedTasks}
                  onEditTask={(task) => {
                    setSelectedTask(task)
                    setIsModalOpen(true)
                  }}
                  onDeleteTask={handleDeleteTask}
                />
              </motion.div>
            )}
          </div>

          {/* Sidebar - Calendar & Notifications */}
          <AnimatePresence>
            {(showCalendar || showNotifications) && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="lg:col-span-1 space-y-4"
              >
                {showCalendar && (
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                    <h2 className="font-semibold text-slate-100 mb-4">
                      Calendar
                    </h2>
                    <TaskCalendar tasks={tasks} />
                  </div>
                )}

                {showNotifications && (
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 max-h-96 overflow-y-auto">
                    <h2 className="font-semibold text-slate-100 mb-4">
                      Notifications
                    </h2>
                    <NotificationPanel
                      tasks={tasks}
                      upcomingCount={todoTasks.filter((t) => t.due_date).length}
                    />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        open={isModalOpen}
        task={selectedTask}
        onOpenChange={setIsModalOpen}
        onSave={selectedTask ? handleUpdateTask : handleCreateTask}
      />
    </div>
  )
}
