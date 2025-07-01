"use client";

import { useState, useEffect } from "react";
import { BsPlayFill, BsPauseFill } from "react-icons/bs";

interface CircularSoundWaveProps {
    isPlaying?: boolean;
    onClick?: () => void;
    size?: number;
    className?: string;
}

const CircularSoundWave: React.FC<CircularSoundWaveProps> = ({
    isPlaying = false,
    onClick,
    size = 180,
    className = ""
}) => {
    const [waveHeights, setWaveHeights] = useState<number[]>([]);
    const [animationKey, setAnimationKey] = useState(0);

    // Generate circular wave heights
    const generateWaveHeights = () => {
        const numberOfBars = 32; // Number of bars around the circle
        const heights = [];
        
        for (let i = 0; i < numberOfBars; i++) {
            // Create a wave pattern with some randomness
            const angle = (i / numberOfBars) * Math.PI * 2;
            const baseHeight = Math.sin(angle * 2) * 8 + 12; // Base wave pattern
            const randomVariation = Math.random() * 6 - 3; // Add some randomness
            heights.push(Math.max(4, Math.min(20, baseHeight + randomVariation)));
        }
        
        return heights;
    };

    useEffect(() => {
        console.log('CircularSoundWave - isPlaying changed:', isPlaying);
        setWaveHeights(generateWaveHeights());
        setAnimationKey(prev => prev + 1); // Force re-render of animation
        
        if (isPlaying) {
            const interval = setInterval(() => {
                setWaveHeights(generateWaveHeights());
                setAnimationKey(prev => prev + 1);
            }, 100); // Update wave every 100ms for more dynamic effect
            
            return () => clearInterval(interval);
        }
    }, [isPlaying]);

    const radius = size / 2 - 15; // Radius for the bars
    const centerX = size / 2;
    const centerY = size / 2;

    return (
        <div
            className={`relative cursor-pointer transition-all duration-300 hover:scale-105 ${className}`}
            onClick={onClick}
            style={{ width: size, height: size }}
        >
            {/* Background with enhanced visual effects */}
            <div
                className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
                    isPlaying 
                        ? 'bg-gradient-to-br from-green-500/20 via-emerald-500/15 to-green-600/25 shadow-2xl shadow-green-500/20 border border-green-500/30' 
                        : 'bg-gradient-to-br from-gray-800/40 to-gray-900/60 hover:from-gray-700/50 hover:to-gray-800/70 border border-gray-600/30 hover:border-gray-500/50'
                }`}
            />
            
            {/* Inner glow effect */}
            <div
                className={`absolute inset-2 rounded-xl transition-all duration-500 ${
                    isPlaying 
                        ? 'bg-gradient-to-br from-green-400/10 to-transparent shadow-inner' 
                        : 'bg-gradient-to-br from-white/5 to-transparent'
                }`}
            />
            
            {/* Sound wave visualization */}
            <div className="absolute inset-0 flex items-center justify-center p-6">
                {isPlaying ? (
                    <div className="flex items-center justify-center gap-x-1 w-full h-full text-green-400">
                        {Array.from({ length: 50 }).map((_, i) => {
                            const height = Math.random() * 80 + 15;
                            const delay = i * 0.02;
                            return (
                                <span 
                                    key={`${i}-${animationKey}`}
                                    className="w-1 bg-current rounded-full shadow-md"
                                    style={{
                                        height: `${height}%`,
                                        animation: `wave 0.8s ease-in-out ${delay}s infinite alternate`,
                                        boxShadow: '0 0 8px currentColor',
                                        background: 'linear-gradient(to top, #10b981, #34d399, #6ee7b7)'
                                    }}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <svg
                        viewBox="0 0 400 60"
                        preserveAspectRatio="none"
                        className="w-full h-2/3 text-gray-500"
                    >
                        <defs>
                            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style={{stopColor: 'currentColor', stopOpacity: 0.3}} />
                                <stop offset="50%" style={{stopColor: 'currentColor', stopOpacity: 0.8}} />
                                <stop offset="100%" style={{stopColor: 'currentColor', stopOpacity: 0.3}} />
                            </linearGradient>
                        </defs>
                        <path 
                            d="M0 30 C 25 10, 45 50, 80 30 S 135 10, 160 30 S 200 50, 240 30 S 280 10, 320 30 S 360 50, 400 30"
                            stroke="url(#waveGradient)"
                            strokeWidth="2.5"
                            fill="none"
                            strokeLinecap="round"
                            className="drop-shadow-sm"
                        />
                    </svg>
                )}
            </div>
            
            {/* Center play/pause button with enhanced styling */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                    isPlaying 
                        ? 'bg-white text-black scale-110 shadow-lg shadow-green-500/30 border-2 border-green-400' 
                        : 'bg-white/90 text-black hover:bg-white hover:scale-110 shadow-md hover:shadow-lg'
                }`}>
                    {isPlaying ? (
                        <BsPauseFill size={20} />
                    ) : (
                        <BsPlayFill size={20} className="ml-0.5" />
                    )}
                </div>
            </div>
            
            {/* Pulse effect when playing */}
            {isPlaying && (
                <div className="absolute inset-0 rounded-2xl border-2 border-green-400/30 animate-pulse" />
            )}
        </div>
    );
};

export default CircularSoundWave;
