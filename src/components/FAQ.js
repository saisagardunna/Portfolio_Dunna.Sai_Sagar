import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaMinus } from 'react-icons/fa';
import '../styles/faq.css';

const faqData = [
    {
        question: "Do you take on freelance projects?",
        answer: "Yes, I am currently open to freelance opportunities. whether it's building a full-stack application from scratch, automating workflows, or consulting on AI/ML integration.",
    },
    {
        question: "What is your preferred tech stack?",
        answer: "I specialize in the MERN stack (MongoDB, Express, React, Node.js) + TypeScript for web dev, and Python (FastAPI, Flask) for backend & AI development. I also use AWS and Docker for deployment.",
    },
    {
        question: "Can you help with AI integration?",
        answer: "Absolutely. I have experience integrating OpenAI's GPT models, building custom chatbots, and developing computer vision solutions to add intelligence to existing applications.",
    },
    {
        question: "How do you handle project delivery and communication?",
        answer: "I follow an agile approach. We start with a discovery phase, follow up with regular updates/demos every sprint, and ensure continuous feedback. I use tools like Jira, Trello, or Slack for transparent communication.",
    }
];

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleIndex = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="faq-section">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <div className="faq-container">
                {faqData.map((item, index) => (
                    <motion.div
                        key={index}
                        className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                        onClick={() => toggleIndex(index)}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        viewport={{ once: true }}
                    >
                        <div className="faq-question">
                            <h3>{item.question}</h3>
                            <span className="faq-icon">
                                {activeIndex === index ? <FaMinus /> : <FaPlus />}
                            </span>
                        </div>
                        <AnimatePresence>
                            {activeIndex === index && (
                                <motion.div
                                    className="faq-answer"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <p>{item.answer}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default FAQ;
