import { toast } from 'sonner'

export interface Task {
  id: string
  user_id: string
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  due_date?: string
  created_at: string
  updated_at: string
  tags?: string[]
}

export interface Notification {
  id: string
  user_id: string
  type: 'task_created' | 'task_updated' | 'task_completed' | 'task_reminder'
  title: string
  message?: string
  task_id?: string
  read: boolean
  created_at: string
}

export const taskStatuses = [
  { value: 'todo', label: 'To Do', icon: '📋' },
  { value: 'in-progress', label: 'In Progress', icon: '⚡' },
  { value: 'completed', label: 'Completed', icon: '✅' },
] as const

export const priorityLevels = [
  { value: 'low', label: 'Low', color: 'bg-blue-500' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
  { value: 'high', label: 'High', color: 'bg-red-500' },
] as const

export async function createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    })

    if (!response.ok) throw new Error('Failed to create task')
    const data = await response.json()
    toast.success('Task created successfully')
    return data.task
  } catch (error) {
    toast.error('Failed to create task')
    console.error(error)
    throw error
  }
}

export async function updateTask(id: string, updates: Partial<Task>) {
  try {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })

    if (!response.ok) throw new Error('Failed to update task')
    const data = await response.json()
    toast.success('Task updated successfully')
    return data.task
  } catch (error) {
    toast.error('Failed to update task')
    console.error(error)
    throw error
  }
}

export async function deleteTask(id: string) {
  try {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) throw new Error('Failed to delete task')
    toast.success('Task deleted successfully')
  } catch (error) {
    toast.error('Failed to delete task')
    console.error(error)
    throw error
  }
}

export async function generateTaskWithAI(description: string, userId: string) {
  try {
    const response = await fetch('/api/ai/generate-task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, userId }),
    })

    if (!response.ok) throw new Error('Failed to generate task')
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error generating task:', error)
    throw error
  }
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function isOverdue(dueDate: string) {
  return new Date(dueDate) < new Date()
}

export function getTaskStats(tasks: Task[]) {
  return {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    overdue: tasks.filter(
      (t) => t.due_date && isOverdue(t.due_date) && t.status !== 'completed',
    ).length,
  }
}

export function groupTasksByDate(tasks: Task[]) {
  const grouped: Record<string, Task[]> = {}

  tasks.forEach((task) => {
    const date = task.due_date ? formatDate(task.due_date) : 'No Due Date'
    if (!grouped[date]) {
      grouped[date] = []
    }
    grouped[date].push(task)
  })

  return grouped
}
