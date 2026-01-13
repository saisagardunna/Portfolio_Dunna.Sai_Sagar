import React from 'react';
import { FaGamepad, FaCamera, FaPlane, FaMusic, FaBook, FaCode } from 'react-icons/fa';
import '../styles/hobbies.css';

const hobbiesData = [
    {
        icon: <FaCode />,
        title: "Competitive Coding",
        desc: "Solving algorithmic challenges on LeetCode & CodeChef. 500+ problems solved.",
        color: "#33ff00"
    },
    {
        icon: <FaCamera />,
        title: "Photography",
        desc: "Capturing moments and landscapes. Exploring the world through a lens.",
        color: "#ff0066"
    },
    {
        icon: <FaGamepad />,
        title: "Gaming",
        desc: "Strategic gaming like Valorant & Chess. It sharpens decision making under pressure.",
        color: "#00ccff"
    },
    {
        icon: <FaMusic />,
        title: "Music Production",
        desc: "Creating lo-fi beats for coding sessions. Music is the rhythm of code.",
        color: "#ffcc00"
    },
    {
        icon: <FaPlane />,
        title: "Traveling",
        desc: "Exploring new cultures and places. Travel fuels creativity.",
        color: "#cc00ff"
    },
    {
        icon: <FaBook />,
        title: "Reading",
        desc: "Tech blogs, Sci-Fi novels, and System Design books. Constant learning.",
        color: "#ffffff"
    }
];

const Hobbies = () => {
    return (
        <div className="hobbies-container">
            <h2 className="section-title">Beyond the Code</h2>
            <div className="hobbies-grid">
                {hobbiesData.map((hobby, index) => (
                    <div
                        key={index}
                        className="hobby-card"
                        style={{ borderBottom: `3px solid ${hobby.color}` }}
                    >
                        <div className="hobby-icon" style={{ color: hobby.color }}>
                            {hobby.icon}
                        </div>
                        <h3>{hobby.title}</h3>
                        <p>{hobby.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Hobbies;
