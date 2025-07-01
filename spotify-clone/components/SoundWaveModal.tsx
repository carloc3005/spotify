"use client";

import { useState } from "react";
import { IoClose } from "react-icons/io5";
import CircularSoundWave from "./LineSoundWave";

interface SoundWaveModalProps {
    isOpen: boolean;
    onClose: () => void;
    isPlaying: boolean;
    onTogglePlay: () => void;
    songTitle?: string;
    artist?: string;
}

const SoundWaveModal: React.FC<SoundWaveModalProps> = ({
    isOpen,
    onClose,
    isPlaying,
    onTogglePlay,
    songTitle = "Current Song",
    artist = "Artist"
}) => {
    console.log('SoundWaveModal - isPlaying:', isPlaying, 'isOpen:', isOpen);
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl p-12 max-w-2xl w-full mx-4 relative border border-gray-600/50 shadow-2xl">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors p-3 rounded-full hover:bg-gray-700/50"
                >
                    <IoClose size={28} />
                </button>

                {/* Title */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                        Sound Wave
                    </h2>
                    <div className="text-lg text-gray-300">
                        <p className="font-semibold text-white mb-1">{songTitle}</p>
                        <p className="text-gray-400">{artist}</p>
                    </div>
                </div>

                {/* Extra Large Circular Sound Wave */}
                <div className="flex justify-center mb-12">
                    <CircularSoundWave
                        isPlaying={isPlaying}
                        onClick={onTogglePlay}
                        size={280}
                        className="hover:scale-105 transition-transform duration-300"
                    />
                </div>

                {/* Status text */}
                <div className="text-center">
                    <p className="text-gray-300 text-lg font-medium mb-2">
                        {isPlaying ? "🎵 Playing" : "⏸️ Paused"}
                    </p>
                    <p className="text-gray-500 text-sm">
                        Click the sound wave to {isPlaying ? "pause" : "play"}
                    </p>
                </div>

                {/* Enhanced decorative elements */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-t-3xl"></div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 rounded-b-3xl opacity-50"></div>
            </div>
        </div>
    );
};

export default SoundWaveModal;
