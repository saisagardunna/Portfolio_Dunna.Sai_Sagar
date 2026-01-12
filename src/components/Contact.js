
import React, { useState } from 'react';
import '../styles/about-contact.css';

const Contact = () => {
    const [status, setStatus] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("Sending...");

        const formData = new FormData(e.target);
        formData.append("access_key", "57cdca70-c4ad-4136-973e-4bf275ddf55a");

        const res = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        }).then((res) => res.json());

        if (res.success) {
            setStatus("Message Sent Successfully!");
            e.target.reset();
        } else {
            setStatus("Error Sending Message. Please try again.");
        }
    };

    return (
        <div className="page-container contact-page">
            <h1 className="page-title">Get In Touch</h1>
            <div className="contact-wrapper">
                <div className="contact-info">
                    <h2>Let's build something amazing together.</h2>
                    <p>I'm available for freelance projects and full-time opportunities.</p>

                    <a href="tel:6301051163" className="contact-method-card">
                        <span className="icon">📞</span>
                        <div className="details">
                            <span className="label">Call Me Directly</span>
                            <span className="value">+91 63010 51163</span>
                        </div>
                    </a>

                    <div className="contact-method-card">
                        <span className="icon">📧</span>
                        <div className="details">
                            <span className="label">Email Me</span>
                            <span className="value">saisagardunna@gmail.com</span>
                        </div>
                    </div>
                </div>

                <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" name="name" required placeholder="Your Name" />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" required placeholder="your@email.com" />
                    </div>
                    <div className="form-group">
                        <label>Message</label>
                        <textarea name="message" required placeholder="How can I help you?" rows="5"></textarea>
                    </div>
                    <button type="submit" className="submit-btn">Send Message</button>
                    {status && <p className="form-status">{status}</p>}
                </form>
            </div>
        </div>
    );
};

export default Contact;
