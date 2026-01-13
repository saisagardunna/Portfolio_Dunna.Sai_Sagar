import React from 'react';
import { Tilt } from 'react-tilt';
import { motion } from 'framer-motion';
import { FaBrain, FaServer, FaRocket, FaMobileAlt } from 'react-icons/fa';
import '../styles/services.css';

const services = [
    {
        title: "AI & Machine Learning",
        icon: <FaBrain />,
        desc: "Custom LLMs, Computer Vision models, and predictive analytics that drive business intelligence.",
        gradient: "linear-gradient(135deg, #ff00cc 0%, #3333ff 100%)"
    },
    {
        title: "Enterprise Web Apps",
        icon: <FaServer />,
        desc: "Scalable, secure, and high-performance web applications built with React, Next.js, and Node.js.",
        gradient: "linear-gradient(135deg, #FF512F 0%, #DD2476 100%)"
    },
    {
        title: "Cloud Architecture",
        icon: <FaRocket />,
        desc: "Robust cloud infrastructure setup and management (AWS, Azure) with Docker and Kubernetes.",
        gradient: "linear-gradient(135deg, #1fa2ff 0%, #12d8fa 100%)"
    },
    {
        title: "Mobile Solutions",
        icon: <FaMobileAlt />,
        desc: "Cross-platform mobile applications that provide seamless user experiences on iOS and Android.",
        gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
    }
];

const Services = () => {
    return (
        <div className="services-section">
            <h2 className="section-title">Our Expertise</h2>
            <div className="services-grid">
                {services.map((service, index) => (
                    <Tilt key={index} options={{ max: 25, scale: 1.05 }}>
                        <motion.div
                            className="service-card"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div className="service-icon-wrapper" style={{ background: service.gradient }}>
                                {service.icon}
                            </div>
                            <h3>{service.title}</h3>
                            <p>{service.desc}</p>
                            <div className="service-shine" />
                        </motion.div>
                    </Tilt>
                ))}
            </div>
        </div>
    );
};

export default Services;
