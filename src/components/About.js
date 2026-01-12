
import React, { useState } from 'react';
import '../styles/about-contact.css';

const About = () => {
    return (
        <div className="page-container about-page">
            <h1 className="page-title">About Me</h1>
            <div className="about-content">
                <div className="about-text">
                    <p>
                        Hello! I'm <strong>Sai Sagar Dunna</strong>, an Associate Software Engineer passionate about building scalable, production-ready applications.
                        My journey in tech involves deep dives into <strong>Python (FastAPI, Flask)</strong> and modern <strong>React</strong> ecosystems.
                    </p>
                    <p>
                        I thrive on solving complex problems—whether it's engineering high-performance REST APIs, automating business workflows,
                        or integrating next-gen AI solutions like conversational bots and computer vision models.
                    </p>
                    <p>
                        With a strong foundation in Cloud Infrastructure (AWS, Docker, Terraform), I don't just write code; I deploy resilient systems that drive value.
                        I'm always looking for the next challenge to innovate and grow.
                    </p>
                </div>
                <div className="about-stats">
                    <div className="stat-card">
                        <h3>Fresher</h3>
                        <span>Years Experience</span>
                    </div>
                    <div className="stat-card">
                        <h3>10+</h3>
                        <span>Projects Live</span>
                    </div>
                    <div className="stat-card">
                        <h3>99%</h3>
                        <span>Uptime Delivered</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
