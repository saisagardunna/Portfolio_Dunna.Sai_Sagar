'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Sparkles, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

interface AITaskInputProps {
  onTaskGenerated: (taskData: {
    title: string
    description?: string
    priority: 'low' | 'medium' | 'high'
    due_date?: string
    status?: 'todo'
  }) => void
}

export function AITaskInput({ onTaskGenerated }: AITaskInputProps) {
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([
    'Build a landing page',
    'Fix authentication bug',
    'Review pull requests',
    'Write documentation',
    'Deploy to production',
  ])

  const handleGenerateTask = async (inputPrompt: string = prompt) => {
    if (!inputPrompt.trim()) {
      toast.error('Please describe what you want to do')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/ai/generate-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: inputPrompt }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate task')
      }

      const taskData = await response.json()
      onTaskGenerated({
        ...taskData,
        status: 'todo',
      })
      setPrompt('')
      toast.success('Task created with AI assistance! 🤖')
    } catch (error) {
      console.error('[v0] Error generating task:', error)
      toast.error('Failed to generate task. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full space-y-3">
      <div className="flex gap-2">
        <Input
          placeholder="Tell AI what you want to do... (e.g., 'Build a dashboard by Friday')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleGenerateTask()}
          disabled={isLoading}
          className="bg-slate-800/50 border-slate-700/50 text-slate-100 placeholder:text-slate-500 focus:border-accent/50"
        />
        <Button
          onClick={() => handleGenerateTask()}
          disabled={isLoading || !prompt.trim()}
          className="bg-accent hover:bg-accent/90 text-accent-foreground whitespace-nowrap"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate
            </>
          )}
        </Button>
      </div>

      {/* Quick suggestions */}
      <AnimatePresence>
        {!prompt && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2"
          >
            {suggestions.map((suggestion) => (
              <motion.button
                key={suggestion}
                onClick={() => handleGenerateTask(suggestion)}
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1 text-xs rounded-full bg-slate-700/50 hover:bg-slate-600 text-slate-300 transition-colors border border-slate-600/50 flex items-center gap-1 disabled:opacity-50"
              >
                {suggestion}
                <ChevronRight className="w-3 h-3" />
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
