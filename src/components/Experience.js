import React from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { FaGraduationCap, FaBriefcase, FaCode } from 'react-icons/fa';
import '../styles/experience.css';

const Experience = () => {
    return (
        <div className="experience-container">
            <h2 className="section-title">My Journey</h2>
            <VerticalTimeline>
                <VerticalTimelineElement
                    className="vertical-timeline-element--work"
                    contentStyle={{ background: 'rgba(255, 255, 255, 0.05)', color: '#fff', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}
                    contentArrowStyle={{ borderRight: '7px solid  rgba(255, 255, 255, 0.05)' }}
                    date="2022 - Present"
                    iconStyle={{ background: '#3178C6', color: '#fff' }}
                    icon={<FaGraduationCap />}
                >
                    <h3 className="vertical-timeline-element-title">B.Tech in Computer Science (AI & ML)</h3>
                    <h4 className="vertical-timeline-element-subtitle">Malla Reddy University</h4>
                    <p>
                        Current CGPA: 8.89. Specializing in Artificial Intelligence and Machine Learning.
                        Leading student developer community and organizing hackathons.
                    </p>
                </VerticalTimelineElement>

                <VerticalTimelineElement
                    className="vertical-timeline-element--work"
                    contentStyle={{ background: 'rgba(255, 255, 255, 0.05)', color: '#fff', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}
                    contentArrowStyle={{ borderRight: '7px solid  rgba(255, 255, 255, 0.05)' }}
                    date="2024"
                    iconStyle={{ background: '#e91e63', color: '#fff' }}
                    icon={<FaBriefcase />}
                >
                    <h3 className="vertical-timeline-element-title">Google AI/ML Virtual Intern</h3>
                    <h4 className="vertical-timeline-element-subtitle">Google (Virtual)</h4>
                    <p>
                        Gained practical experience in training and deploying machine learning models using TensorFlow.
                        Worked on real-world datasets and optimizing model performance.
                    </p>
                </VerticalTimelineElement>

                <VerticalTimelineElement
                    className="vertical-timeline-element--work"
                    contentStyle={{ background: 'rgba(255, 255, 255, 0.05)', color: '#fff', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}
                    contentArrowStyle={{ borderRight: '7px solid  rgba(255, 255, 255, 0.05)' }}
                    date="2025 - Present"
                    iconStyle={{ background: '#FF9900', color: '#fff' }}
                    icon={<FaCode />}
                >
                    <h3 className="vertical-timeline-element-title">Freelance Full-Stack Developer</h3>
                    <h4 className="vertical-timeline-element-subtitle">Remote</h4>
                    <p>
                        Developed "Moores", a revenue-generating business platform for local startups.
                        Built custom automation tools using n8n and Python for various clients.
                    </p>
                </VerticalTimelineElement>

                <VerticalTimelineElement
                    className="vertical-timeline-element--education"
                    contentStyle={{ background: 'rgba(255, 255, 255, 0.05)', color: '#fff', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}
                    contentArrowStyle={{ borderRight: '7px solid  rgba(255, 255, 255, 0.05)' }}
                    date="2020 - 2022"
                    iconStyle={{ background: '#2196f3', color: '#fff' }}
                    icon={<FaGraduationCap />}
                >
                    <h3 className="vertical-timeline-element-title">Intermediate Education</h3>
                    <h4 className="vertical-timeline-element-subtitle">Narayana Junior College</h4>
                    <p>
                        Completed with 83.2%. Focus on Mathematics, Physics, and Chemistry.
                    </p>
                </VerticalTimelineElement>
            </VerticalTimeline>
        </div>
    );
};

export default Experience;
