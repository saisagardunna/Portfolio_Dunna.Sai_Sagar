import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import '../styles/navbar.css';

// Custom X Logo Component to ensure visibility
const XLogo = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
);

const Navbar = () => {
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [hoveredTab, setHoveredTab] = useState(location.pathname);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Reset hover state when location changes or mouse leaves the nav completely
    const handleMouseLeave = () => {
        setHoveredTab(location.pathname);
    };

    const links = [
        { name: 'Home', path: '/' },
        { name: 'Projects', path: '/projects' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
        { name: 'Community', path: '/chat' },
        { name: 'Certificates', path: '/gallery' },
        { name: 'Resume', path: '/resume' }
    ];

    const socials = [
        { Icon: FaGithub, url: "https://github.com/saisagardunna", color: "#2ea44f", name: "GitHub" },
        { Icon: FaLinkedin, url: "https://www.linkedin.com/in/sai-sagar-aa104624b/", color: "#0077b5", name: "LinkedIn" },
        { Icon: FaInstagram, url: "https://www.instagram.com/saisagar2689/", color: "#E1306C", name: "Instagram" },
        { Component: XLogo, url: "https://x.com/saga91151555", color: "#ffffff", name: "X (Twitter)" }
    ];

    return (
        <nav
            className={`navbar ${scrolled ? 'scrolled' : ''}`}
            onMouseLeave={handleMouseLeave}
        >
            <div className="navbar-logo">
                <Link to="/">
                    <motion.span
                        className="logo-text"
                        whileHover={{ scale: 1.05 }}
                    >
                        Sai Sagar Dunna
                    </motion.span>
                </Link>
            </div>

            <div className="navbar-links">
                {links.map((link) => {
                    const isActive = location.pathname === link.path;
                    const isHovered = hoveredTab === link.path;

                    return (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`nav-link-wrapper ${isActive ? 'active' : ''}`}
                            onMouseEnter={() => setHoveredTab(link.path)}
                        >
                            <span className="nav-link-text">
                                {link.name}
                            </span>

                            {/* The Sliding Magic Line: Moves with mouse */}
                            {isHovered && (
                                <motion.div
                                    layoutId="nav-line"
                                    className="nav-sliding-line"
                                    transition={{
                                        type: "spring",
                                        stiffness: 350,
                                        damping: 30
                                    }}
                                />
                            )}
                        </Link>
                    );
                })}
            </div>

            <div className="navbar-social">
                {socials.map((item, index) => {
                    const IconComponent = item.Icon || item.Component;
                    return (
                        <motion.a
                            key={index}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link"
                            title={item.name}
                            whileHover={{
                                y: -3,
                                color: item.color,
                                scale: 1.1
                            }}
                        >
                            <IconComponent size={20} />
                        </motion.a>
                    );
                })}
            </div>
        </nav>
    );
};

export default Navbar;
