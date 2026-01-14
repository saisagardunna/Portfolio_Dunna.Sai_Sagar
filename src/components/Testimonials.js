import React, { useRef } from 'react';
import { FaQuoteLeft, FaLinkedin, FaStar } from 'react-icons/fa';
import '../styles/testimonials.css';

const testimonialsData = [
    {
        name: "Dr.VSK ",
        role: "Dean, Malla Reddy University",
        text: "Sai Sagar is an exceptional student who consistently goes above and beyond in his understanding of AI and Machine Learning. His ability to apply theoretical concepts to build practical applications like the Skin Cancer Detection System is impressive.",
        stars: 5,
        color: "#4a90e2"
    },
    {
        name: "Moores Platform Client",
        role: "Local Business Owner",
        text: "The business platform Sai built for us completely transformed how we handle our orders. The automation features saved us hours of manual work every week. Highly professional and reliable delivery.",
        stars: 5,
        color: "#e91e63"
    },
    {
        name: "Hackathon Mentor",
        role: "Senior Software Engineer",
        text: "I mentored Sai during a hackathon, and his problem-solving skills stood out immediately. He doesn't just write code; he thinks about the system architecture and the end-user experience. A promising engineer.",
        stars: 5,
        color: "#ff9800"
    },
    {
        name: "Collaborator",
        role: "Frontend Developer",
        text: "Working with Sai on the AI Interview Bot was a great experience. His backend FastAPI implementation was clean, fast, and documented perfectly. He communicates well and delivers on time.",
        stars: 5,
        color: "#9c27b0"
    }
];

const Testimonials = () => {
    const scrollRef = useRef(null);

    return (
        <div className="testimonials-section">
            <h2 className="section-title">What People Say</h2>
            <div className="testimonials-container" ref={scrollRef}>
                {testimonialsData.map((item, index) => (
                    <div key={index} className="testimonial-card" style={{ borderTop: `4px solid ${item.color}` }}>
                        <div className="quote-icon" style={{ color: item.color }}>
                            <FaQuoteLeft />
                        </div>
                        <p className="testimonial-text">"{item.text}"</p>
                        <div className="testimonial-stars">
                            {[...Array(item.stars)].map((_, i) => (
                                <FaStar key={i} color="#FFD700" size={14} />
                            ))}
                        </div>
                        <div className="testimonial-author">
                            <div className="author-avatar" style={{ background: item.color }}>
                                {item.name.charAt(0)}
                            </div>
                            <div className="author-info">
                                <h4>{item.name}</h4>
                                <span>{item.role}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="testimonial-blur-left"></div>
            <div className="testimonial-blur-right"></div>
        </div>
    );
};

export default Testimonials;
