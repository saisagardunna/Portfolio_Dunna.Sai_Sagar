import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaEnvelope } from 'react-icons/fa';
import '../styles/newsletter.css';

const Newsletter = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle"); // idle, sending, success, error

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus("sending");
        // Simulate API call
        setTimeout(() => {
            setStatus("success");
            setEmail("");
        }, 1500);
    };

    return (
        <div className="newsletter-section">
            <div className="newsletter-overlay" />
            <motion.div
                className="newsletter-content"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
            >
                <div className="newsletter-icon">
                    <FaEnvelope />
                </div>
                <h2>Stay Updated</h2>
                <p>Subscribe to my newsletter for the latest updates on AI, Tech, and my journey.</p>

                <form className="newsletter-form" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={status === "success"}
                    />
                    <button type="submit" disabled={status === "sending" || status === "success"}>
                        {status === "sending" ? "..." : status === "success" ? "Subscribed!" : <FaPaperPlane />}
                    </button>
                </form>
                {status === "success" && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="newsletter-success"
                    >
                        Thanks for subscribing! Welcome aboard. 🚀
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default Newsletter;
