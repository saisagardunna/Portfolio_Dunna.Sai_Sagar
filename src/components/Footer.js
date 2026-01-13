import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaEnvelope } from 'react-icons/fa';
import '../styles/footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-socials">
                    <a href="https://github.com/saisagardunna" target="_blank" rel="noopener noreferrer" title="GitHub">
                        <FaGithub />
                    </a>
                    <a href="https://linkedin.com/in/sai-sagar" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                        <FaLinkedin />
                    </a>
                    <a href="mailto:saisagardunna04@gmail.com" title="Email">
                        <FaEnvelope />
                    </a>
                    <a href="https://x.com/saga91151555" target="_blank" rel="noopener noreferrer" title="Twitter">
                        <FaTwitter />
                    </a>
                    <a href="https://www.instagram.com/saisagar2689/" target="_blank" rel="noopener noreferrer" title="Instagram">
                        <FaInstagram />
                    </a>
                </div>
                <div className="footer-copyright">
                    <p>© {currentYear} Sai Sagar Dunna. All rights reserved.</p>
                    <p className="footer-tagline">Built with React, Three.js, and Passion.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
