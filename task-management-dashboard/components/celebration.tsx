'use client'

import { motion } from 'framer-motion'

interface CelebrationProps {
  isActive: boolean
  onComplete?: () => void
}

export function Celebration({ isActive, onComplete }: CelebrationProps) {
  if (!isActive) return null

  // Create confetti pieces
  const confetti = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    delay: i * 0.05,
    duration: 2.5 + Math.random() * 0.5,
    left: Math.random() * 100,
    rotation: Math.random() * 360,
    scale: 0.5 + Math.random() * 0.5,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{ opacity: 1, y: -10, scale: piece.scale }}
          animate={{
            opacity: 0,
            y: window.innerHeight + 20,
            rotate: piece.rotation,
            scale: 0,
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: 'easeIn',
          }}
          onAnimationComplete={() => {
            if (piece.id === confetti.length - 1 && onComplete) {
              onComplete()
            }
          }}
          className="absolute w-2 h-2 bg-accent rounded-full"
          style={{ left: `${piece.left}%` }}
        />
      ))}

      {/* Celebration text */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 flex items-center justify-center pointer-events-none"
      >
        <motion.div
          animate={{ y: -50 }}
          transition={{ duration: 2 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold text-accent mb-2">Awesome!</h2>
          <p className="text-lg text-muted-foreground">Task completed</p>
        </motion.div>
      </motion.div>
    </div>
  )
}
