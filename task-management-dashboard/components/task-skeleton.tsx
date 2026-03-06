'use client'

import { motion } from 'framer-motion'

export function TaskSkeleton() {
  return (
    <motion.div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="p-4 bg-card rounded-lg border border-border/50 space-y-3"
        >
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded w-full" />
          <div className="h-3 bg-muted rounded w-1/2" />
          <div className="flex gap-2 pt-2">
            <div className="h-5 bg-muted rounded-full w-16" />
            <div className="h-5 bg-muted rounded-full w-16" />
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

export function DashboardSkeleton() {
  return (
    <motion.div className="space-y-8">
      {/* Stats skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="p-4 bg-card rounded-lg border border-border/50 h-24"
          />
        ))}
      </div>

      {/* Kanban skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((col) => (
          <motion.div key={col} className="space-y-4">
            <div className="h-8 bg-muted rounded w-24" />
            <TaskSkeleton />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
