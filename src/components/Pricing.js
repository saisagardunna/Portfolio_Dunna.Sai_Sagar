import React from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaTimes } from 'react-icons/fa';
import '../styles/pricing.css';

const plans = [
    {
        name: "Starter",
        price: "$499",
        desc: "Perfect for personal websites and simple landing pages.",
        features: [
            "Responsive Web Design",
            "1-3 Pages",
            "Contact Form Integration",
            "Basic SEO Optimization",
            "1 Month Support"
        ],
        notIncluded: [
            "CMS / Admin Dashboard",
            "E-commerce Functionality",
            "AI Integration"
        ],
        color: "#4ade80",
        delay: 0
    },
    {
        name: "Professional",
        price: "$1,499",
        desc: "Ideal for small businesses needing a dynamic web presence.",
        features: [
            "Up to 10 Pages",
            "CMS Integration (Strapi/Sanity)",
            "Authentication (Auth0/Firebase)",
            "Advanced SEO & Analytics",
            "3 Months Support",
            "Blog Functionality"
        ],
        notIncluded: [
            "Custom AI Solutions"
        ],
        recommended: true,
        color: "#a855f7",
        delay: 0.1
    },
    {
        name: "Enterprise",
        price: "Custom",
        desc: "Full-scale applications with AI and complex backend logic.",
        features: [
            "Unlimited Pages",
            "Custom Backend (Node/Python)",
            "AI & ML Model Integration",
            "Cloud Infrastructure (AWS)",
            "Payment Gateway (Stripe)",
            "Priority Support 24/7"
        ],
        notIncluded: [],
        color: "#6366f1",
        delay: 0.2
    }
];

const Pricing = () => {
    return (
        <div className="pricing-section">
            <h2 className="section-title">Investment Plans</h2>
            <div className="pricing-grid">
                {plans.map((plan, index) => (
                    <motion.div
                        key={index}
                        className={`pricing-card ${plan.recommended ? 'recommended' : ''}`}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: plan.delay }}
                        viewport={{ once: true }}
                    >
                        {plan.recommended && <div className="popular-badge">Most Popular</div>}
                        <h3 className="plan-name" style={{ color: plan.color }}>{plan.name}</h3>
                        <div className="plan-price">{plan.price}</div>
                        <p className="plan-desc">{plan.desc}</p>

                        <div className="plan-divider" />

                        <ul className="plan-features">
                            {plan.features.map((feature, i) => (
                                <li key={i}>
                                    <FaCheck className="feature-icon check" /> {feature}
                                </li>
                            ))}
                            {plan.notIncluded.map((feature, i) => (
                                <li key={i} className="not-included">
                                    <FaTimes className="feature-icon times" /> {feature}
                                </li>
                            ))}
                        </ul>

                        <button className="plan-btn" style={{ borderColor: plan.color, color: plan.recommended ? '#fff' : plan.color, background: plan.recommended ? `linear-gradient(135deg, ${plan.color} 0%, #6366f1 100%)` : 'transparent' }}>
                            Choose {plan.name}
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Pricing;
