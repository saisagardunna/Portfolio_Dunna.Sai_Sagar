import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { supabase } from '../utils/supabaseClient';
import { ArrowUpRight, Zap } from 'lucide-react';
import '../styles/projects.css';

// EXPORT THIS FUNCTION SO AI ASSISTANT CAN USE IT
export const loadProjects = async () => {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('is_active', true)
            .order('id');

        if (error) throw error;
        return data && data.length > 0 ? data : getFallbackProjects();
    } catch (e) {
        console.error("Error loading projects", e);
        return getFallbackProjects();
    }
};

const getFallbackProjects = () => [
    {
        id: 1,
        title: "Startup Business Platform",
        category: "Web Development",
        tech: ["React", "TypeScript"],
        description: [
            "Production platform serving 10+ customers with 100+ orders delivered, generating consistent revenue.",
            "Engineered comprehensive business rules and order workflows reducing processing time by 40%.",
            "Architected scalable React codebase with TypeScript achieving 99% uptime across 500+ user sessions."
        ],
        link: "https://moores.vercel.app"
    },
    {
        id: 2,
        title: "AI Mock Interview Platform",
        category: "Artificial Intelligence",
        tech: ["FastAPI", "React", "TypeScript"],
        description: [
            "Full-stack AI interview platform supporting voice and text interactions with 10+ active users.",
            "Integrated conversational AI logic generating 50+ adaptive follow-up questions per interview session.",
            "Developed FastAPI backend handling 200+ API requests daily with 250ms average response time."
        ],
        link: "https://ai-mock-interview-iota-wine.vercel.app"
    },
    {
        id: 3,
        title: "AI Resume-Based Interview Bot",
        category: "Artificial Intelligence",
        tech: ["Python", "Streamlit", "NLP"],
        description: [
            "AI interview bot extracting 15+ key data points from resumes with 90% accuracy using NLP techniques.",
            "Generated 30+ role-relevant technical and behavioral questions through advanced prompt engineering."
        ],
        link: "https://interviewbot-e9fzdrte4s86agcbdfv2uz.streamlit.app"
    },
    {
        id: 4,
        title: "AI Travel Planning Application",
        category: "Artificial Intelligence",
        tech: ["React", "Location APIs"],
        description: [
            "Location-aware app generating personalized itineraries for 10+ users using proximity algorithms.",
            "Optimized visit routing reducing travel time by 30% through intelligent scheduling of 8+ daily attractions."
        ],
        link: "https://travel-eight-sooty.vercel.app"
    },
    {
        id: 5,
        title: "Skin Cancer Detection System",
        category: "Machine Learning",
        tech: ["Python", "CNN", "FastAPI"],
        description: [
            "Trained deep learning CNN model on 8000+ medical images achieving 92% classification accuracy.",
            "Designed preprocessing pipelines processing images in under 2 seconds for real-time diagnosis.",
            "Deployed FastAPI service with modular architecture handling 50+ daily inference requests."
        ],
        link: "https://github.com/saisagardunna/cancer-detection"
    },
    {
        id: 6,
        title: "Workflow Automation & Cloud Infrastructure",
        category: "DevOps",
        tech: ["n8n", "AWS", "Docker", "Terraform"],
        description: [
            "Automated workflows delivering 1000+ monthly messages across Twilio SMS, WhatsApp, and Telegram channels.",
            "Streamlined Excel data updates reducing manual processing time by 75% through webhook integration.",
            "Provisioned cloud infrastructure managing 5+ AWS EC2 instances and 10+ Docker containers using Terraform."
        ],
        link: "#"
    },
    {
        id: 7,
        title: "AI Recipe Generator",
        category: "Artificial Intelligence",
        tech: ["React", "AI"],
        description: [
            "AI-powered recipe application serving 10+ users with 1.5 second average response time.",
            "Delivered structured cooking instructions with 95% user satisfaction through prompt-driven logic."
        ],
        link: "https://recipe-generator2.vercel.app"
    },
    {
        id: 8,
        title: "Blog Platform",
        category: "Web Development",
        tech: ["React", "Node.js"],
        description: [
            "A clean, modern blogging platform where users can create, publish, and share posts.",
            "Features a minimal UI focused on reading experience and content discovery."
        ],
        link: "https://blog-project-client-five.vercel.app/"
    },
    {
        id: 9,
        title: "Shared Sound System",
        category: "Web Development",
        tech: ["React", "WebRTC", "Audio API"],
        description: [
            "Real-time music sharing app that lets friends listen to songs together simultaneously.",
            "Synchronized audio playback across multiple devices for a shared listening experience."
        ],
        link: "https://app-six-kappa-30.vercel.app/"
    },
    {
        id: 10,
        title: "ThreatNet – Cybersecurity Detector",
        category: "Cybersecurity",
        tech: ["React", "NLP", "AI"],
        description: [
            "AI-powered cybersecurity tool that analyzes messages and detects whether they are genuine or fake threats.",
            "Helps users identify phishing attempts, scam messages, and malicious content in real time."
        ],
        link: "https://threat-net-jo5s.vercel.app/"
    },
    {
        id: 11,
        title: "Fraud Detection Bot",
        category: "Machine Learning",
        tech: ["Python", "Hugging Face", "ML"],
        description: [
            "Machine learning bot that predicts whether a financial transaction is fraudulent or legitimate.",
            "Deployed on Hugging Face Spaces for easy access and real-time inference."
        ],
        link: "https://sagar142-fraud-detection-bot.hf.space/"
    },
    {
        id: 12,
        title: "KnowEmp – Daily Activity Tracker",
        category: "Web Development",
        tech: ["React", "Vercel", "Database"],
        description: [
            "Platform for storing and tracking employee and student daily activities and progress.",
            "Enables managers and educators to monitor what each person worked on each day.",
            "Built for easy daily data entry and retrieval of work and study logs."
        ],
        link: "https://know-emp1.vercel.app/"
    }
];

// Hyper-Variants
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3
        }
    }
};

const cardVariants = {
    hidden: {
        opacity: 0,
        y: 100,
        scale: 0.8,
        rotateZ: 5
    },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateZ: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 10,
            mass: 0.8
        }
    },
    exit: {
        opacity: 0,
        scale: 0.5,
        transition: { duration: 0.3 }
    }
};

// Advanced 3D Tilt with Magnetic Effect
const MagneticTiltCard = ({ children, className }) => {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const centerX = width / 2;
        const centerY = height / 2;

        // Calculate distance from center normalized (-1 to 1)
        const mouseX = (e.clientX - left - centerX) / centerX;
        const mouseY = (e.clientY - top - centerY) / centerY;

        x.set(mouseX);
        y.set(mouseY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const rotateX = useMotionTemplate`${mouseYSpring * -12}deg`;
    const rotateY = useMotionTemplate`${mouseXSpring * 12}deg`;

    return (
        <motion.div
            ref={ref}
            className={className}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
        >
            {children}
        </motion.div>
    );
};

const Projects = () => {
    const [filter, setFilter] = useState("All");
    const [projects, setProjects] = useState([]);
    const [visibleProjects, setVisibleProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProjects().then(data => {
            setProjects(data);
            setVisibleProjects(data);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (filter === "All") {
            setVisibleProjects(projects);
        } else {
            setVisibleProjects(projects.filter(p => p.category === filter));
        }
    }, [filter, projects]);

    const categories = ["All", ...Array.from(new Set(projects.map(p => p.category)))];

    if (loading) return (
        <div className="loader-full">
            <motion.div
                animate={{
                    scale: [1, 1.5, 1],
                    rotate: [0, 180, 0],
                    boxShadow: ["0px 0px 0px #48b1bf", "0px 0px 20px #06b6d4", "0px 0px 0px #48b1bf"]
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                style={{ width: 60, height: 60, borderRadius: 15, background: "linear-gradient(45deg, #48b1bf, #06b6d4)" }}
            />
        </div>
    );

    return (
        <div className="projects-wrapper">
            <header className="projects-header">
                <motion.h1
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                    Selected Works
                </motion.h1>
                <div className="filter-bar">
                    {categories.map((cat, index) => (
                        <motion.button
                            key={index}
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{
                                delay: index * 0.05 + 0.3,
                                type: "spring"
                            }}
                            className={`filter-btn ${filter === cat ? 'active' : ''}`}
                            onClick={() => setFilter(cat)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            {cat}
                        </motion.button>
                    ))}
                </div>
            </header>

            <motion.div
                className="projects-grid"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                layout
            >
                <AnimatePresence mode='popLayout'>
                    {visibleProjects.map((project) => (
                        <motion.div
                            key={project.id}
                            variants={cardVariants}
                            layout
                            style={{ perspective: 1500 }}
                        >
                            <MagneticTiltCard className="project-card">
                                <div className="card-visual">
                                    <div className="visual-gradient-bg"></div>
                                    <motion.span
                                        className="card-acronym"
                                        animate={{
                                            rotate: [0, 5, -5, 0],
                                            scale: [1, 1.05, 1]
                                        }}
                                        transition={{
                                            duration: 6,
                                            repeat: Infinity,
                                            repeatType: "mirror"
                                        }}
                                    >
                                        {(project.title || "PR").substring(0, 2).toUpperCase()}
                                    </motion.span>
                                </div>
                                <div className="card-content">
                                    <div className="card-category">
                                        <span className="category-dot"></span>
                                        {project.category}
                                    </div>
                                    <h3 className="card-title">{project.title}</h3>
                                    <div className="card-tech">
                                        {project.tech && project.tech.map((t, i) => (
                                            <motion.span
                                                key={i}
                                                className="tech-tag"
                                                initial={{ opacity: 0, scale: 0 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.5 + (i * 0.1) }}
                                                whileHover={{
                                                    scale: 1.2,
                                                    rotate: Math.random() * 10 - 5
                                                }}
                                            >
                                                {t}
                                            </motion.span>
                                        ))}
                                    </div>
                                    <p className="card-desc">
                                        {Array.isArray(project.description) ? project.description[0] : project.description}
                                    </p>
                                    <motion.a
                                        href={project.link}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="live-demo-btn"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <span className="btn-text">Live Demo</span>
                                        <div className="btn-arrow-box">
                                            <ArrowUpRight size={22} strokeWidth={3} />
                                        </div>
                                        {/* Floating particles suggestion */}
                                        <motion.div
                                            style={{
                                                position: 'absolute',
                                                top: -10,
                                                right: -10,
                                                opacity: 0
                                            }}
                                            whileHover={{ opacity: 1, scale: 1.5 }}
                                        >
                                            <Zap size={16} fill="#fff" color="#fff" />
                                        </motion.div>
                                    </motion.a>
                                </div>
                            </MagneticTiltCard>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default Projects;
