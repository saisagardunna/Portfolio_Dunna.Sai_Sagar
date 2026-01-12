
import React, { useEffect, useRef } from 'react';
import '../styles/projects.css';

const projects = [
    {
        title: "Startup Business Platform – Revenue Generating",
        tech: ["React", "TypeScript"],
        link: "https://moores.vercel.app",
        description: [
            "Developed production platform serving 10+ customers with 100+ orders delivered, generating consistent revenue",
            "Engineered comprehensive business rules and order workflows reducing processing time by 40%",
            "Architected scalable React codebase with TypeScript achieving 99% uptime across 500+ user sessions"
        ]
    },
    {
        title: "AI Mock Interview Platform",
        tech: ["FastAPI", "React", "TypeScript"],
        link: "https://ai-mock-interview-iota-wine.vercel.app",
        description: [
            "Created full-stack AI interview platform supporting voice and text interactions with 10+ active users",
            "Integrated conversational AI logic generating 50+ adaptive follow-up questions per interview session",
            "Developed FastAPI backend handling 200+ API requests daily with 250ms average response time"
        ]
    },
    {
        title: "AI Resume-Based Interview Bot",
        tech: ["Python", "Streamlit", "NLP"],
        link: "https://interviewbot-e9fzdrte4s86agcbdfv2uz.streamlit.app",
        description: [
            "Designed AI interview bot extracting 15+ key data points from resumes with 90% accuracy using NLP techniques",
            "Generated 30+ role-relevant technical and behavioral questions through advanced prompt engineering"
        ]
    },
    {
        title: "AI Travel Planning Application",
        tech: ["React", "Location APIs"],
        link: "https://travel-eight-sooty.vercel.app",
        description: [
            "Engineered location-aware app generating personalized itineraries for 10+ users using proximity algorithms",
            "Optimized visit routing reducing travel time by 30% through intelligent scheduling of 8+ daily attractions"
        ]
    },
    {
        title: "Skin Cancer Detection System",
        tech: ["Python", "CNN", "FastAPI"],
        link: "https://github.com/saisagardunna/cancer_detection",
        linkText: "View Code",
        description: [
            "Trained deep learning CNN model on 8000+ medical images achieving 92% classification accuracy",
            "Designed preprocessing pipelines processing images in under 2 seconds for real-time diagnosis",
            "Deployed FastAPI service with modular architecture handling 50+ daily inference requests"
        ]
    },
    {
        title: "Workflow Automation & Cloud Infrastructure",
        tech: ["n8n", "AWS", "Docker", "Terraform"],
        description: [
            "Automated workflows delivering 1000+ monthly messages across Twilio SMS, WhatsApp, and Telegram channels",
            "Streamlined Excel data updates reducing manual processing time by 75% through webhook integration",
            "Provisioned cloud infrastructure managing 5+ AWS EC2 instances and 10+ Docker containers using Terraform"
        ]
    },
    {
        title: "AI Recipe Generator",
        tech: ["React", "AI"],
        link: "https://recipe-generator2.vercel.app",
        description: [
            "Launched AI-powered recipe application serving 10+ users with 1.5 second average response time",
            "Delivered structured cooking instructions with 95% user satisfaction through prompt-driven logic"
        ]
    }
];

// Extract unique skills
const allSkills = Array.from(new Set(projects.flatMap(p => p.tech)));

const Projects = () => {
    const cardsRef = useRef([]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            cardsRef.current.forEach(card => {
                if (card) {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    card.style.setProperty('--mouse-x', `${x}px`);
                    card.style.setProperty('--mouse-y', `${y}px`);
                }
            });
        };

        const container = document.querySelector('.projects-container');
        if (container) {
            container.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            if (container) container.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div className="projects-container">
            <h1 className="projects-title">Portfolio & Projects</h1>
            <p className="projects-subtitle">
                A collection of full-stack applications, AI solutions, and cloud infrastructure projects
                demonstrating scalable engineering and innovative problem-solving.
            </p>

            <div className="skills-section">
                <div className="skills-grid">
                    {allSkills.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                    ))}
                </div>
            </div>

            <div className="projects-grid">
                {projects.map((project, index) => (
                    <div
                        key={index}
                        className="project-card"
                        ref={el => cardsRef.current[index] = el}
                    >
                        <div className="project-header">
                            <h2 className="project-title">{project.title}</h2>
                            <div className="project-tech-stack">
                                {project.tech.map((t, i) => (
                                    <span key={i} className="tech-badge">{t}</span>
                                ))}
                            </div>
                        </div>
                        <ul className="project-description">
                            {project.description.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                        <div className="project-links">
                            {project.link && (
                                <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
                                    {project.linkText || "Live Demo"} <span>↗</span>
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>


        </div>
    );
};

export default Projects;
