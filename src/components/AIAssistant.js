import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ai-assistant.css';
import { loadProjects } from './Projects';

const GROQ_API_KEY = process.env.VITE_GROQ_API_KEY || 'your-api-key-here';

const generateSystemPrompt = (projects = []) => {
    const projectList = projects.map((p, i) =>
        `${i + 1}. ${p.title} - ${p.link ? `Live: ${p.link}` : 'No live link'}
    - Tech: ${p.tech.join(', ')}
    - ${p.description[0]}`
    ).join('\n');

    return `
You are the AI Assistant for Sai Sagar Dunna. Your goal is to answer questions about his portfolio, skills, and projects accurately based on the data below.
Do not answer questions unrelated to Sai Sagar Dunna.

PROFESSIONAL SUMMARY:
Associate Software Engineer with hands-on experience building production-ready applications using Python (FastAPI, Flask) and React with TypeScript. Strong foundation in REST APIs, authentication, and scalable systems. Experienced in AI-driven products, workflow automation, and cloud infrastructure.

    EDUCATION:
- B.Tech in CSE(AI & ML) from Malla Reddy University(2022 - Present): CGPA 8.89 %.
- Intermediate from Narayana Junior College(2020 - 2022): 83.2 %.

TECHNICAL SKILLS:
- Languages: Python, TypeScript, JavaScript.
- Backend: FastAPI, Flask, REST APIs.
- Frontend: React, TypeScript, Hooks.
- AI / ML: NLP, Conversational AI, CNN.
- Cloud: AWS, Terraform, Docker.

    PROJECTS:
${projectList}

    CERTIFICATIONS:
- AWS Certified
- Google AI / ML Internship

LANGUAGES:
- English(Professional), Telugu(Native), Hindi(Fluent).

    Tone: Professional, helpful, enthusiastic.
If asked about contact, suggest checking the contact links on the site.
`;
};

const AIAssistant = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hi! I'm Sai's AI Assistant. You can say 'Hello Sagar' to activate voice control!" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [projects, setProjects] = useState([]);
    const [systemPrompt, setSystemPrompt] = useState('');
    const isListeningRef = useRef(false); // Ref to track state in listeners
    const bottomRef = useRef(null);
    const recognitionRef = useRef(null);
    const synthRef = useRef(window.speechSynthesis);

    // Load projects from database
    useEffect(() => {
        const fetchProjects = async () => {
            const data = await loadProjects();
            setProjects(data);
            setSystemPrompt(generateSystemPrompt(data));
        };
        fetchProjects();
    }, []);

    // Sync Ref with State
    useEffect(() => {
        isListeningRef.current = isListening;
    }, [isListening]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    useEffect(() => {
        // Initialize Speech Recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const results = event.results;
                const transcript = results[results.length - 1][0].transcript.trim().toLowerCase();
                console.log('Voice Input:', transcript);

                // Check for wake word
                const isWakeWord = transcript.includes('hello sagar');
                const isStopCommand = transcript.includes('stop') && (
                    transcript.includes('voice') ||
                    transcript.includes('listening') ||
                    transcript === 'stop'
                );

                if (isWakeWord) {
                    if (!isListeningRef.current) {
                        setIsListening(true);
                        isListeningRef.current = true;
                        // setIsOpen(true); // Don't open chat UI automatically
                        speak("Hello! I am listening.");
                    }

                    // If the user said "Hello Sagar open projects", process the rest
                    const commandPart = transcript.replace('hello sagar', '').trim();
                    if (commandPart) {
                        handleVoiceCommand(commandPart);
                    }
                } else if (isStopCommand) {
                    if (isListeningRef.current) {
                        setIsListening(false);
                        isListeningRef.current = false;
                        speak("Voice control de-activated.");
                    }
                } else if (isListeningRef.current) {
                    handleVoiceCommand(transcript);
                }
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                if (event.error === 'not-allowed') {
                    setMessages(prev => [...prev, { role: 'assistant', content: "Microphone access denied. Please enable permissions." }]);
                }
            };

            recognitionRef.current.onend = () => {
                // Keep listening effectively
                if (recognitionRef.current) {
                    try {
                        recognitionRef.current.start();
                    } catch (e) {
                        // ignore if already started
                    }
                }
            };

            // Try to start listening logic immediately (might need user interaction first in strict browsers)
            try {
                recognitionRef.current.start();
            } catch (e) {
                console.log("Auto-start voice blocked, waiting for interaction");
            }
        }

        return () => {
            if (recognitionRef.current) recognitionRef.current.stop();
        };
    }, []);

    const speak = (text) => {
        if (!synthRef.current) return;
        // Cancel previous speech
        synthRef.current.cancel();

        // Strip code blocks or markdown for cleaner speech (simple regex)
        const cleanText = text.replace(/[*#]/g, '');

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1;
        synthRef.current.speak(utterance);
    };

    const handleVoiceCommand = (command) => {
        if (!command) return;

        // Clean command for better matching (remove special chars, lower case)
        const cleanCommand = command.toLowerCase().replace(/[^a-z0-9\s]/g, '');
        console.log("Voice Command Raw:", command);
        console.log("Voice Command Clean:", cleanCommand);

        // 1. Navigation Commands (Explicit Page Navigation)
        // Use cleanCommand for consistency
        if (cleanCommand.includes('project') && !cleanCommand.includes('about') && !cleanCommand.includes('open')) {
            if (cleanCommand === 'projects' || cleanCommand === 'my projects') {
                navigate('/projects');
                speak("Opening Projects page");
                return;
            }
        }

        // Direct Page Navigation
        if (cleanCommand.includes('home page') || cleanCommand === 'home' || cleanCommand === 'go home') {
            navigate('/');
            speak("Going to Home page");
            return;
        }
        if (cleanCommand.includes('chat') && cleanCommand.length < 20) {
            navigate('/chat');
            speak("Opening Chat");
            return;
        }
        if (cleanCommand.includes('contact') && cleanCommand.length < 20) {
            navigate('/contact');
            speak("Opening Contact page");
            return;
        }
        if (cleanCommand.includes('about') && !cleanCommand.includes('tell') && cleanCommand.length < 20) {
            navigate('/about');
            speak("Opening About page");
            return;
        }
        if ((cleanCommand.includes('resume') || cleanCommand.includes('cv')) && !cleanCommand.includes('bot') && !cleanCommand.includes('project') && !cleanCommand.includes('interview')) {
            navigate('/resume');
            speak("Opening Resume");
            return;
        }
        if (cleanCommand.includes('certificate') || cleanCommand.includes('certification') || cleanCommand.includes('gallery')) {
            navigate('/gallery');
            speak("Opening Certificates Gallery");
            return;
        }

        // 2. Project Opening Commands (Specific Projects)
        // Check for specific project keywords dynamically
        for (const project of projects) {
            const titleLower = project.title.toLowerCase();
            const simplifiedTitle = titleLower.replace(/[^a-z0-9\s]/g, '');

            // Check title match (full title or simplified)
            const titleMatch = cleanCommand.includes(simplifiedTitle) || cleanCommand.includes(titleLower);

            // Check keywords match
            let keywordMatch = false;
            if (project.keywords && Array.isArray(project.keywords)) {
                for (const keyword of project.keywords) {
                    // Normalize keyword for comparison
                    const cleanKeyword = keyword.toLowerCase().replace(/[^a-z0-9\s]/g, '');
                    if (cleanCommand.includes(cleanKeyword)) {
                        keywordMatch = true;
                        break;
                    }
                }
            }

            if (titleMatch || keywordMatch) {
                if (project.link) {
                    speak(`Opening ${project.title}`);
                    const newWindow = window.open(project.link, '_blank');
                    if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
                        console.warn("Popup blocked for project", project.title);
                        speak("Popup was blocked. Please allow popups for this site.");
                    }
                } else {
                    speak(`${project.title} matches your request, but it does not have a live demo linked.`);
                }
                return;
            }
        }

        // 4. Scroll Control
        if (command.includes('scroll down')) {
            window.scrollBy({ top: window.innerHeight / 2, behavior: 'smooth' });
            return;
        }
        if (command.includes('scroll up')) {
            window.scrollBy({ top: -window.innerHeight / 2, behavior: 'smooth' });
            return;
        }
        if (command.includes('top') || command.includes('start')) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        if (command.includes('bottom') || command.includes('end')) {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            return;
        }

        // 5. Contact / Email Action
        if (command.includes('email') || command.includes('send mail')) {
            window.location.href = "mailto:saisagardunna@gmail.com";
            speak("Opening your email client");
            return;
        }

        // General "Projects" page fallback if they said "open projects"
        if (command.includes('projects')) {
            navigate('/projects');
            speak("Opening Projects page");
            return;
        }

        // 3. Fallback: Treat as a Question for the AI
        // If it's not a navigation command, send it to the AI.

        // Open chat window for AI responses so user can see text/images
        setIsOpen(true);

        const userMsg = { role: 'user', content: command };
        setMessages(prev => [...prev, userMsg]);

        // Trigger AI fetch
        fetchAIResponse(command);
    };

    const fetchAIResponse = async (query) => {
        setLoading(true);
        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY} `,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: query }
                    ],
                    temperature: 0.7,
                    max_tokens: 300
                })
            });

            const data = await response.json();

            if (data.choices && data.choices[0]) {
                const content = data.choices[0].message.content;
                const botMsg = { role: 'assistant', content: content };
                setMessages(prev => [...prev, botMsg]);
                speak(content);
            }
        } catch (error) {
            console.error('AI Error:', error);
            const errorMsg = "Sorry, I couldn't reach the server.";
            setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
            speak(errorMsg);
        } finally {
            setLoading(false);
        }
    };

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
                        { role: 'system', content: systemPrompt },
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
                // For text interactions, maybe don't speak automatically unless requested?
                // But user wants voice control... let's only speak if voice was valid recently?
                // For now, let's keep text chat silent unless 'speak' explicitly called by voice handler.
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

    const toggleVoice = () => {
        if (isListening) {
            setIsListening(false);
            isListeningRef.current = false;
            speak("Voice control de-activated.");
            // We don't necessarily need to stop the engine, just the state.
            // But if we want to restart the session to clear buffers:
            // if (recognitionRef.current) recognitionRef.current.stop();
        } else {
            setIsListening(true);
            isListeningRef.current = true;
            speak("Voice control activated. Say Stop to cancel.");
            try {
                if (recognitionRef.current) recognitionRef.current.start();
            } catch (e) {
                // Already started/running
                console.log("Recognition already active");
            }
        }
    };

    return (
        <div className="ai-widget">
            {!isOpen && (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className={`ai-fab ${isListening ? 'listening' : ''}`} onClick={() => setIsOpen(true)}>
                        {isListening ? (
                            <span className="pulse-ring"></span>
                        ) : null}
                        <svg className="ai-icon" viewBox="0 0 24 24">
                            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                        </svg>
                    </button>
                </div>
            )}

            {isOpen && (
                <div className="ai-window">
                    <div className="ai-header">
                        <div className="ai-title">
                            <span className={`ai-status-dot ${isListening ? 'active-voice' : ''}`}></span>
                            Sai's Assistant
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="ai-mic" onClick={toggleVoice} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                                {isListening ? '🎙️ On' : '🎙️ Off'}
                            </button>
                            <button className="ai-close" onClick={() => setIsOpen(false)}>&times;</button>
                        </div>
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
