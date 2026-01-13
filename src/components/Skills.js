import React from 'react';
import { FaPython, FaReact, FaAws, FaDocker, FaGitAlt, FaLinux, FaJs, FaDatabase } from 'react-icons/fa';
import { SiTypescript, SiFastapi, SiFlask, SiTerraform, SiPostman, SiN8N, SiPytorch, SiPostgresql } from 'react-icons/si';
import '../styles/skills.css';

const skillsData = [
    { name: 'Python', icon: <FaPython color="#3776AB" /> },
    { name: 'React', icon: <FaReact color="#61DAFB" /> },
    { name: 'TypeScript', icon: <SiTypescript color="#3178C6" /> },
    { name: 'FastAPI', icon: <SiFastapi color="#009688" /> },
    { name: 'AWS', icon: <FaAws color="#FF9900" /> },
    { name: 'Docker', icon: <FaDocker color="#2496ED" /> },
    { name: 'Terraform', icon: <SiTerraform color="#7B42BC" /> },
    { name: 'PostgreSQL', icon: <SiPostgresql color="#4169E1" /> },
    { name: 'AI/ML', icon: <SiPytorch color="#EE4C2C" /> },
    { name: 'n8n', icon: <SiN8N color="#FF6E6E" /> },
];

const Skills = () => {
    return (
        <div className="skills-container">
            <h2 className="section-title">Technical Expertise</h2>
            <div className="skills-grid-icons">
                {skillsData.map((skill, index) => (
                    <div key={index} className="skill-item">
                        <div className="skill-icon">{skill.icon}</div>
                        <span className="skill-name">{skill.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Skills;
