
import React from 'react';
import '../styles/resume.css';

const ResumeViewer = () => {
    return (
        <div className="resume-page">
            <div className="resume-header">
                <h1>My Resume</h1>
                <a href="/resume.pdf" download="Sai_Sagar_Resume.pdf" className="download-btn">
                    Download Resume
                </a>
            </div>
            <div className="resume-container">
                <iframe
                    src="/resume.pdf"
                    title="Resume PDF"
                    className="resume-frame"
                />
            </div>
        </div>
    );
};

export default ResumeViewer;
