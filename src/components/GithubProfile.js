import React from 'react';
import GitHubCalendar from 'react-github-calendar';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import '../styles/github-stats.css';

const GithubProfile = () => {
    // Using a hardcoded year for visual consistency or dynamic usually takes username
    // Since we might not have real data fetched instantly without auth sometimes, a consistent username is key.
    // 'saisagardunna' is the username from the inputs.

    return (
        <div className="github-section">
            <h2 className="section-title">Open Source Contributions</h2>
            <div className="github-calendar-wrapper">
                <GitHubCalendar
                    username="saisagardunna"
                    colorScheme="dark"
                    year={new Date().getFullYear() - 1} // Show last year for full graph usually, or current
                    theme={{
                        dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
                    }}
                    labels={{
                        totalCount: '{{count}} contributions in the last year',
                    }}
                    renderBlock={(block, activity) => (
                        <div
                            data-tooltip-id="github-tooltip"
                            data-tooltip-content={`${activity.date}: ${activity.count} activities`}
                        >
                            {block}
                        </div>
                    )}
                />
                <ReactTooltip id="github-tooltip" />
            </div>
            <div className="github-stats-cards">
                <div className="gh-card">
                    <span className="gh-num">350+</span>
                    <span className="gh-label">Commits</span>
                </div>
                <div className="gh-card">
                    <span className="gh-num">50+</span>
                    <span className="gh-label">Pull Requests</span>
                </div>
                <div className="gh-card">
                    <span className="gh-num">20+</span>
                    <span className="gh-label">Repositories</span>
                </div>
            </div>
        </div>
    );
};

export default GithubProfile;
