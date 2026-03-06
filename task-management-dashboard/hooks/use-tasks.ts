import useSWR from 'swr'
import type { Task } from '@/lib/task-utils'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useTasks(userId: string) {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? `/api/tasks?userId=${userId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    },
  )

  return {
    tasks: data?.tasks || [],
    isLoading,
    error,
    mutate,
  }
}

export function useTasksGrouped(userId: string) {
  const { tasks, isLoading, error, mutate } = useTasks(userId)

  const grouped = {
    todo: tasks.filter((t: Task) => t.status === 'todo'),
    inProgress: tasks.filter((t: Task) => t.status === 'in-progress'),
    completed: tasks.filter((t: Task) => t.status === 'completed'),
  }

  return {
    tasks,
    grouped,
    isLoading,
    error,
    mutate,
  }
}

export function useNotifications(userId: string) {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? `/api/notifications?userId=${userId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 10000,
    },
  )

  return {
    notifications: data?.notifications || [],
    isLoading,
    error,
    mutate,
  }
}
