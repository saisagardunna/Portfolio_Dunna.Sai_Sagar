const GROQ_API_KEY = process.env.VITE_GROQ_API_KEY;

export const generateTaskFromAI = async (input) => {
    if (!GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY not found in environment variables");
    }

    const systemPrompt = `
    You are a smart task assistant.
    Extract task details from the user input.
    Return a JSON object with:
    - title: string (concise task name)
    - description: string (optional details)
    - priority: "low" | "medium" | "high" (default to medium if not specified)
    - due_date: string (ISO date format YYYY-MM-DDTHH:mm:ss.sssZ, calculate based on relative terms like "tomorrow", "next week" relative to now)
    
    Current Date: ${new Date().toISOString()}

    Only return the JSON object. No markdown.
  `;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: input }
                ],
                temperature: 0.1,
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Failed to generate task");
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        return JSON.parse(content);

    } catch (error) {
        console.error("AI Task Generation Error:", error);
        throw error;
    }
};
