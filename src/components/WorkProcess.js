import React from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaLightbulb, FaCode, FaRocket } from 'react-icons/fa';
import '../styles/work-process.css';

const steps = [
    {
        id: 1,
        title: "Discovery",
        icon: <FaSearch />,
        desc: "We discuss your vision, requirements, and business goals to define the project scope.",
        color: "#FF0055"
    },
    {
        id: 2,
        title: "Strategy & Design",
        icon: <FaLightbulb />,
        desc: "I architect the technical solution and design user-centric interfaces.",
        color: "#FF9900"
    },
    {
        id: 3,
        title: "Development",
        icon: <FaCode />,
        desc: "I build the application using scalable, clean code and modern technologies.",
        color: "#00CC44"
    },
    {
        id: 4,
        title: "Launch & Support",
        icon: <FaRocket />,
        desc: "We deploy to production, optimize for performance, and ensure smooth operation.",
        color: "#0099FF"
    }
];

const WorkProcess = () => {
    return (
        <div className="process-section">
            <h2 className="section-title">How I Work</h2>
            <div className="process-grid">
                {steps.map((step, index) => (
                    <motion.div
                        key={step.id}
                        className="process-card"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                        viewport={{ once: true }}
                    >
                        <div className="process-icon-wrapper" style={{ borderColor: step.color }}>
                            <div className="process-icon" style={{ backgroundColor: step.color }}>
                                {step.icon}
                            </div>
                            <span className="process-number" style={{ color: step.color }}>0{step.id}</span>
                        </div>
                        <h3 className="process-title">{step.title}</h3>
                        <p className="process-desc">{step.desc}</p>
                        {index < steps.length - 1 && <div className="process-connector" />}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default WorkProcess;
