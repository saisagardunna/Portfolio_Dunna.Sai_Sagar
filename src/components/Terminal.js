import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTerminal, FaTimes } from 'react-icons/fa';
import '../styles/terminal.css';

const COMMANDS = {
    help: "Available commands: help, about, projects, contact, resume, clear, whoami, social, theme",
    whoami: "Sai Sagar Dunna - Associate Software Engineer | AI/ML Enthusiast | Full Stack Developer",
    about: "Navigating to /about...",
    projects: "Navigating to /projects...",
    contact: "Navigating to /contact...",
    resume: "Navigating to /resume...",
    clear: "Clearing terminal...",
    social: "GitHub: github.com/saisagardunna | LinkedIn: linkedin.com/in/sai-sagar",
    theme: "Switching theme... (Just kidding, I'm already in Dark Mode)",
    sudo: "Permission denied: You are not Sai Sagar."
};

const Terminal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [history, setHistory] = useState([
        "Welcome to Sai's Interactive Terminal v1.0.0",
        "Type 'help' to see available commands."
    ]);
    const inputRef = useRef(null);
    const bottomRef = useRef(null);
    const navigate = useNavigate();

    // Toggle terminal with Ctrl+K
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleCommand = (cmd) => {
        const cleanCmd = cmd.trim().toLowerCase();
        let response = COMMANDS[cleanCmd] || `Command not found: ${cleanCmd}. Type 'help' for list.`;

        if (cleanCmd === 'clear') {
            setHistory([]);
            return;
        }

        if (cleanCmd === 'about') navigate('/about');
        if (cleanCmd === 'projects') navigate('/projects');
        if (cleanCmd === 'contact') navigate('/contact');
        if (cleanCmd === 'resume') navigate('/resume');

        setHistory(prev => [...prev, `> ${cmd}`, response]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input) return;
        handleCommand(input);
        setInput("");
    };

    return (
        <>
            {/* The Terminal Window */}
            {isOpen && (
                <div className="terminal-wrapper">
                    <div className="terminal-header">
                        <div className="terminal-dots">
                            <span className="terminal-button close" onClick={() => setIsOpen(false)}></span>
                            <span className="terminal-button minimize"></span>
                            <span className="terminal-button maximize"></span>
                        </div>
                        <div className="terminal-title">saisagar@portfolio: ~</div>
                    </div>
                    <div className="terminal-body" onClick={() => inputRef.current?.focus()}>
                        {history.map((line, i) => (
                            <div key={i} className="terminal-output">{line}</div>
                        ))}
                        <form onSubmit={handleSubmit} className="command-line">
                            <span className="prompt">saisagar@portfolio:~$</span>
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="terminal-input"
                                autoComplete="off"
                                autoFocus
                            />
                        </form>
                        <div ref={bottomRef} />
                    </div>
                </div>
            )}

            {/* The Floating Toggle Button */}
            <div
                className={`terminal-toggle-hint ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                title={isOpen ? "Close Terminal" : "Open Terminal (Ctrl + K)"}
            >
                {isOpen ? <FaTimes size={24} /> : <FaTerminal size={24} />}
            </div>
        </>
    );
};

export default Terminal;
