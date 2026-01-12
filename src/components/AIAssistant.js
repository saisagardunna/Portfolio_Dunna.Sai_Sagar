
import React, { useState, useRef, useEffect } from 'react';
import '../styles/ai-assistant.css';


const GROQ_API_KEY = process.env.VITE_GROQ_API_KEY || 'your-api-key-here';


const SYSTEM_PROMPT = `
You are the AI Assistant for Sai Sagar Dunna.Your goal is to answer questions about his portfolio, skills, and projects accurately based on the data below.
Do not answer questions unrelated to Sai Sagar Dunna.

PROFESSIONAL SUMMARY:
Associate Software Engineer with hands - on experience building production - ready applications using Python (FastAPI, Flask) and React with TypeScript.Strong foundation in REST APIs, authentication, and scalable systems.Experienced in AI - driven products, workflow automation, and cloud infrastructure with proven track record in revenue - generating platforms.

    EDUCATION:
- B.Tech in CSE(AI & ML) from Malla Reddy University(2022 - Present): CGPA 8.89 %.
- Intermediate from Narayana Junior College(2020 - 2022): 83.2 %.

TECHNICAL SKILLS:
- Languages: Python, TypeScript, JavaScript.
- Backend: FastAPI, Flask, REST APIs, Authentication, API Design.
- Frontend: React, TypeScript, Hooks, State Management.
- AI / ML: Prompt Engineering, NLP, Resume Parsing, Conversational AI, CNN, Deep Learning.
- Database: MySQL, PostgreSQL.
- Automation: n8n, Webhooks, Twilio API, WhatsApp API, Telegram API.
- Cloud / DevOps: AWS(EC2, S3, EBS), Terraform, Docker, CI / CD.
- Tools: Git, Linux, Postman, VS Code, Streamlit.

    PROJECTS:
1. Startup Business Platform(Moores) - Live: moores.vercel.app
    - Revenue - generating platform using React/TypeScript.
        - Served 10 + customers with 100 + orders.
   - Reduced processing time by 40 % using custom workflows.
   - Achieved 99 % uptime.
2. AI Mock Interview Platform - Live: ai - mock - interview - iota - wine.vercel.app
    - Built with FastAPI, React, TypeScript.
   - Generates 50 + adaptive follow - up questions per session.
   - Handles 200 + API requests daily with < 250ms latency.
3. AI Resume - Based Interview Bot - Live: interviewbot - e9fzdrte4s86agcbdfv2uz.streamlit.app
    - Python / Streamlit / NLP app extracting 15 + data points with 90 % accuracy.
4. AI Travel Planning Application - Live: travel - eight - sooty.vercel.app
    - Optimized routing reducing travel time by 30 %.
5. Skin Cancer Detection System - GitHub: github.com / saisagardunna / cancer_detection
    - CNN model trained on 8000 + images with 92 % accuracy.
   - Sub - 2 second processing time.
6. Workflow Automation & Cloud Infrastructure
    - Automations delivering 1000 + monthly messages via n8n / Twilio / Telegram.
   - Reduced manual Excel updates by 75 %.
   - Managed 5 + EC2 instances via Terraform.
7. AI Recipe Generator - Live: recipe - generator2.vercel.app
    - 1.5s response time, 95 % user satisfaction.

        CERTIFICATIONS:
- AWS Certified
    - Google AI / ML Internship
        - Deloitte Job Simulation
            - NPTEL
            - Python(U.Michigan & U.Penn)

LANGUAGES:
- English(Professional), Telugu(Native), Hindi(Fluent).

    Tone: Professional, helpful, enthusiastic.
If asked about contact, suggest checking the contact links on the site.
`;

const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hi! I'm Sai's AI Assistant. Ask me anything about his projects or skills!" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY} `,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile', // Latest supported model
                    messages: [
                        { role: 'system', content: SYSTEM_PROMPT },
                        ...messages.map(m => ({ role: m.role, content: m.content })),
                        userMsg
                    ],
                    temperature: 0.7,
                    max_tokens: 300
                })
            });

            const data = await response.json();

            if (data.choices && data.choices[0]) {
                const botMsg = { role: 'assistant', content: data.choices[0].message.content };
                setMessages(prev => [...prev, botMsg]);
            } else {
                console.error('Groq Response:', data);
                throw new Error(`API Error: ${data.error?.message || 'Empty Response'} `);
            }
        } catch (error) {
            console.error('AI Error Detailed:', error);
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                console.error('Network Error: Check CORS or internet connection.');
            }
            setMessages(prev => [...prev, { role: 'assistant', content: `Sorry, I'm having trouble connecting. Error: ${error.message}` }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-widget">
            {!isOpen && (
                <button className="ai-fab" onClick={() => setIsOpen(true)}>
                    <svg className="ai-icon" viewBox="0 0 24 24">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                    </svg>
                </button>
            )}

            {isOpen && (
                <div className="ai-window">
                    <div className="ai-header">
                        <div className="ai-title">
                            <span className="ai-status-dot"></span>
                            Sai's Assistant
                        </div>
                        <button className="ai-close" onClick={() => setIsOpen(false)}>&times;</button>
                    </div>

                    <div className="ai-messages">
                        {messages.map((m, i) => (
                            <div key={i} className={`ai-message ${m.role === 'user' ? 'user' : 'bot'}`}>
                                {m.content}
                            </div>
                        ))}
                        {loading && <div className="ai-typing">Thinking...</div>}
                        <div ref={bottomRef} />
                    </div>

                    <form className="ai-input-area" onSubmit={sendMessage}>
                        <input
                            type="text"
                            className="ai-input"
                            placeholder="Ask about my projects..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button type="submit" className="ai-send">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                            </svg>
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AIAssistant;
