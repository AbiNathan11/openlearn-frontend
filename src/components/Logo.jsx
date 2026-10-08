import React from 'react';

const Logo = ({ className = "w-8 h-8" }) => {
    return (
        <svg
            viewBox="0 0 100 100"
            className={className}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Main Circle - O */}
            <path
                d="M50 10C27.9 10 10 27.9 10 50s17.9 40 40 40 40-17.9 40-40S72.1 10 50 10zm0 70c-16.6 0-30-13.4-30-30s13.4-30 30-30 30 13.4 30 30-13.4 30-30 30z"
                fill="currentColor"
            />
            {/* L shape / Open Book page */}
            <path
                d="M45 35v30h25"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Accent Dot - Learning Spark */}
            <circle cx="75" cy="25" r="8" fill="#F59E0B" /> {/* Amber-500 for spark */}
        </svg>
    );
};

export default Logo;
