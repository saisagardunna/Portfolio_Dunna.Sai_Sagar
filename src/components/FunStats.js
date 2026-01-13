import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import '../styles/fun-stats.css';

const StatItem = ({ label, value, suffix = "" }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (isInView) {
            let start = 0;
            const end = parseInt(value);
            const duration = 2000;
            const increment = end / (duration / 16); // 60fps

            const timer = setInterval(() => {
                start += increment;
                if (start >= end) {
                    setCount(end);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(start));
                }
            }, 16);

            return () => clearInterval(timer);
        }
    }, [isInView, value]);

    return (
        <div className="fun-stat-item" ref={ref}>
            <div className="fun-stat-circle">
                <span className="fun-stat-number">
                    {count}{suffix}
                </span>
            </div>
            <span className="fun-stat-label">{label}</span>
        </div>
    );
};

const FunStats = () => {
    return (
        <div className="fun-stats-container">
            <h2 className="section-title">By The Numbers</h2>
            <div className="fun-stats-grid">
                <StatItem label="Lines of Code" value="50000" suffix="+" />
                <StatItem label="Coffees Consumed" value="450" suffix="" />
                <StatItem label="Bugs Squashed" value="120" suffix="+" />
                <StatItem label="Late Night Commits" value="85" suffix="" />
            </div>
        </div>
    );
};

export default FunStats;
