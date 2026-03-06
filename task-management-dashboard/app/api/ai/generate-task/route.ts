import { generateText } from 'ai'
import { createGroq } from '@ai-sdk/groq'
import { NextRequest, NextResponse } from 'next/server'

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    const systemPrompt = `You are a helpful task assistant. When the user describes what they want to do, generate a structured task with:
1. A clear, concise title
2. A brief description
3. An appropriate priority level (low, medium, or high)
4. An estimated due date if mentioned

Respond in JSON format: { "title": "...", "description": "...", "priority": "medium", "due_date": "YYYY-MM-DD" or null }`

    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      system: systemPrompt,
      prompt: `Create a task based on this: ${prompt}`,
      temperature: 0.7,
    })

    // Parse the response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json(
        { error: 'Failed to parse AI response' },
        { status: 500 }
      )
    }

    const taskData = JSON.parse(jsonMatch[0])
    return NextResponse.json(taskData)
  } catch (error) {
    console.error('[v0] Error generating task:', error)
    return NextResponse.json(
      { error: 'Failed to generate task' },
      { status: 500 }
    )
  }
}
