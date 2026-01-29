
import React, { useEffect, useRef, useState } from 'react';
import '../styles/projects.css';
import { supabase } from '../utils/supabaseClient';

// Load projects from Supabase instead of JSON
export const loadProjects = async () => {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('is_active', true)
            .order('id');

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error loading projects:', error);
        return [];
    }
};

const Projects = () => {
    const cardsRef = useRef([]);
    const [filter, setFilter] = useState("All");
    const [projects, setProjects] = useState([]);
    const [visibleProjects, setVisibleProjects] = useState([]);
    const [animating, setAnimating] = useState(false);
    const [loading, setLoading] = useState(true);

    // Load projects from database
    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            const data = await loadProjects();
            setProjects(data);
            setVisibleProjects(data);
            setLoading(false);
        };

        fetchProjects();

        // Set up real-time subscription for project updates
        const subscription = supabase
            .channel('projects_changes')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'projects' },
                (payload) => {
                    console.log('Project updated!', payload);
                    fetchProjects(); // Reload projects when database changes
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // Calculate categories from loaded projects
    const categories = ["All", ...Array.from(new Set(projects.map(p => p.category)))];

    useEffect(() => {
        setAnimating(true);
        setTimeout(() => {
            if (filter === "All") {
                setVisibleProjects(projects);
            } else {
                setVisibleProjects(projects.filter(p => p.category === filter));
            }
            setAnimating(false);
        }, 300);
    }, [filter, projects]);

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
    }, [visibleProjects]);

    if (loading) {
        return (
            <div className="projects-container">
                <h1 className="projects-title">Loading Projects...</h1>
            </div>
        );
    }

    return (
        <div className="projects-container">
            <h1 className="projects-title">Portfolio & Projects</h1>
            <p className="projects-subtitle">
                A collection of full-stack applications, AI solutions, and cloud infrastructure projects
                demonstrating scalable engineering and innovative problem-solving.
            </p>

            {/* Filter Buttons */}
            <div className="filter-container">
                {categories.map((cat, index) => (
                    <button
                        key={index}
                        className={`filter-btn ${filter === cat ? 'active' : ''}`}
                        onClick={() => setFilter(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className={`projects-grid ${animating ? 'fade-out' : 'fade-in'}`}>
                {visibleProjects.map((project, index) => (
                    <div
                        key={project.id || project.title}
                        className="project-card"
                        ref={el => cardsRef.current[index] = el}
                    >
                        <div className="project-header">
                            <div className="project-top">
                                <h2 className="project-title">{project.title}</h2>
                                <span className="category-badge">{project.category}</span>
                            </div>
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
                                    {project.link_text || "Live Demo"} <span>↗</span>
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
