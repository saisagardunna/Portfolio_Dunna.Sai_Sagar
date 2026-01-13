import React, { useState, useEffect } from 'react';

const ScrollProgress = () => {
    const [scrollProgress, setScrollProgress] = useState(0);

    const handleScroll = () => {
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const result = (window.scrollY / totalHeight) * 100;
        setScrollProgress(isNaN(result) ? 0 : result); // Handle div by zero if page is empty
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: `${scrollProgress}%`,
            height: '4px',
            background: 'linear-gradient(90deg, #ff00cc, #3333ff)',
            zIndex: 9999,
            transition: 'width 0.1s ease-out',
            boxShadow: '0 0 10px rgba(51, 51, 255, 0.5)'
        }} />
    );
};

export default ScrollProgress;
