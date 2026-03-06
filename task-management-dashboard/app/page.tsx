'use client'

import { TaskDashboard } from '@/components/task-dashboard'
import { useEffect, useState } from 'react'

export default function Page() {
  const [userId, setUserId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Generate or retrieve a user ID (in production, use actual auth)
    const storedUserId = localStorage.getItem('taskflow_user_id')
    if (storedUserId) {
      setUserId(storedUserId)
    } else {
      const newUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('taskflow_user_id', newUserId)
      setUserId(newUserId)
    }
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">TaskFlow</h1>
          <p className="text-slate-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return <TaskDashboard userId={userId} />
}
