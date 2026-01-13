import React, { useEffect, useRef } from 'react';
import TagCloud from 'TagCloud';
import '../styles/tech-sphere.css';

const TechSphere = () => {
    const containerRef = useRef(null);
    const initializedRef = useRef(false);

    useEffect(() => {
        if (initializedRef.current) return;

        const container = '.tagcloud';
        const texts = [
            'React', 'JavaScript', 'TypeScript', 'Node.js',
            'Python', 'FastAPI', 'AWS', 'Docker',
            'Terraform', 'SQL', 'MongoDB', 'Git',
            'Three.js', 'Framer Motion', 'Tailwind', 'Next.js',
            'GraphQL', 'Redis', 'Linux', 'Vite'
        ];

        const options = {
            radius: 300,
            maxSpeed: 'normal',
            initSpeed: 'normal',
            direction: 135,
            keep: true,
            containerClass: 'tagcloud-item'
        };

        if (containerRef.current) {
            TagCloud(container, texts, options);
            initializedRef.current = true;
        }

        return () => {
            // Cleanup if necessary, though TagCloud doesn't have a direct destroy method easily accessible
            const cloud = document.querySelector('.tagcloud');
            if (cloud) cloud.innerHTML = '';
            initializedRef.current = false;
        };
    }, []);

    return (
        <div className="tech-sphere-section">
            <div className="tech-content">
                <h2 className="tech-title">Technologies</h2>
                <p className="tech-subtitle">
                    My arsenal of tools for building comprehensive digital solutions.
                </p>
            </div>
            <div className="tagcloud" ref={containerRef}></div>
        </div>
    );
};

export default TechSphere;
