"use client";

import { useState } from "react";

interface SoundWaveIconProps {
    onClick: () => void;
    isPlaying?: boolean;
    className?: string;
}

const SoundWaveIcon: React.FC<SoundWaveIconProps> = ({
    onClick,
    isPlaying = false,
    className = ""
}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`p-2 rounded-full transition-all duration-200 ${
                isPlaying 
                    ? 'text-green-400 bg-green-400/10 hover:bg-green-400/20' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
            } ${className}`}
            title="Open Sound Wave Visualizer"
        >
            <div className="relative w-5 h-5 flex items-center justify-center">
                {isPlaying ? (
                    // Animated sound wave when playing
                    <div className="flex items-center justify-between w-full h-full">
                        <span className="w-0.5 h-1/4 bg-current rounded-full animate-[wave_0.5s_ease-in-out_-0.4s_infinite_alternate]"></span>
                        <span className="w-0.5 h-full bg-current rounded-full animate-[wave_0.5s_ease-in-out_-0.2s_infinite_alternate]"></span>
                        <span className="w-0.5 h-1/2 bg-current rounded-full animate-[wave_0.5s_ease-in-out_0s_infinite_alternate]"></span>
                        <span className="w-0.5 h-3/4 bg-current rounded-full animate-[wave_0.5s_ease-in-out_-0.2s_infinite_alternate]"></span>
                        <span className="w-0.5 h-1/2 bg-current rounded-full animate-[wave_0.5s_ease-in-out_-0.4s_infinite_alternate]"></span>
                    </div>
                ) : (
                    // Static sound wave icon when not playing
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        className={`transition-all duration-200 ${
                            isHovered ? 'scale-110' : ''
                        }`}
                    >
                        <path
                            d="M2 12 L4 8 L6 16 L8 6 L10 18 L12 4 L14 20 L16 10 L18 14 L20 8 L22 12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                        />
                    </svg>
                )}
            </div>
        </button>
    );
};

export default SoundWaveIcon;
