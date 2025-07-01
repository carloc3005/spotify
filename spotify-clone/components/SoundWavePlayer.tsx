"use client";

import { Song } from "@/types";
import MediaItem from "./MediaItem";
import LikeButton from "./LikeButton";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import Slider from "./Slider";
import usePlayer from "@/hooks/usePlayer";
import { useEffect, useState } from "react";
import useSound from "use-sound";

interface SoundWavePlayerProps {
    song: Song;
    songUrl: string;
}

const SoundWavePlayer: React.FC<SoundWavePlayerProps> = ({
    song,
    songUrl
}) => {
    const player = usePlayer();
    const [volume, setVolume] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);

    const onPlayNext = () => {
        if (player.ids.length === 0) {
            return;
        }

        const currentIndex = player.ids.findIndex((id) => id === player.activeId);
        const nextSong = player.ids[currentIndex + 1];

        if (!nextSong) {
            return player.setId(player.ids[0]);
        }

        player.setId(nextSong);
    }

    const onPlayPrevious = () => {
        if (player.ids.length === 0) {
            return;
        }

        const currentIndex = player.ids.findIndex((id) => id === player.activeId);
        const previousSong = player.ids[currentIndex - 1];

        if (!previousSong) {
            return player.setId(player.ids[player.ids.length - 1]);
        }

        player.setId(previousSong);
    }

    const Icon = isPlaying ? BsPauseFill : BsPlayFill;
    const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

    const [play, { pause, sound }] = useSound(
        songUrl, 
        {
            volume: volume,
            onplay: () => setIsPlaying(true),
            onend: () => {
                setIsPlaying(false);
                onPlayNext();
            },
            onpause: () => setIsPlaying(false),
            format: ['mp3']
        }
    );

    useEffect(() => {
        sound?.play();

        return () => {
            sound?.unload();
        }
    }, [sound]);

    useEffect(() => {
        sound?.volume(volume);
    }, [sound, volume]);

    useEffect(() => {
        setIsPlaying(false);
    }, [songUrl]);

    const handlePlay = () => {
        if (!isPlaying) {
            play();
        } else {
            pause();
        }
    };

    const toggleMute = () => {
        if (volume === 0) {
            setVolume(1);
        } else {
            setVolume(0);
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Top section with song info and controls */}
            <div className="flex items-center justify-between px-4 py-2">
                {/* Song info */}
                <div className="flex items-center gap-x-4 flex-1 min-w-0">
                    <MediaItem data={song} />
                    <LikeButton songId={song.id} />
                </div>

                {/* Center controls - Mobile Play Button */}
                <div className="flex md:hidden">
                    <div 
                        onClick={handlePlay} 
                        className={`h-10 w-10 flex items-center justify-center rounded-full bg-white p-1 cursor-pointer hover:scale-105 transition-all duration-200 ${
                            isPlaying ? 'animate-pulse shadow-lg shadow-green-500/50' : ''
                        }`}
                    >
                        <Icon size={24} className="text-black" />
                    </div>
                </div>

                {/* Volume control */}
                <div className="hidden md:flex items-center gap-x-2 w-[120px]">
                    <VolumeIcon 
                        onClick={toggleMute} 
                        className="cursor-pointer hover:text-white transition-colors" 
                        size={20} 
                    />
                    <Slider value={volume} onChange={(value) => setVolume(value)} />
                </div>
            </div>

            {/* Sound Wave Visualization */}
            <div className="flex-1 flex items-center justify-center px-4 pb-2">
                <div className={`relative w-full max-w-6xl h-16 flex items-center justify-center rounded-lg p-2 transition-all duration-300 ${
                    isPlaying ? 'bg-black/20 shadow-lg shadow-green-500/10' : 'bg-transparent'
                }`}>
                    {isPlaying ? (
                        <div className="flex items-center justify-center gap-x-1 w-full h-full text-green-400">
                            {Array.from({ length: 60 }).map((_, i) => (
                                <span 
                                    key={i}
                                    className="w-1 bg-current rounded-full"
                                    style={{
                                        height: `${Math.random() * 80 + 10}%`,
                                        animation: `wave 0.5s ease-in-out ${i * 0.02}s infinite alternate`
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <svg
                            viewBox="0 0 500 40"
                            preserveAspectRatio="none"
                            className="w-full h-full text-gray-600"
                        >
                            <path 
                                d="M0 20 C 40 5, 60 35, 100 20 S 140 5, 160 20 S 200 35, 240 20 S 280 5, 300 20 S 340 35, 380 20 S 420 5, 460 20 L500 20"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="none"
                                strokeLinecap="round"
                            />
                        </svg>
                    )}
                </div>
            </div>

            {/* Hidden desktop controls for previous/next */}
            <div className="hidden">
                <button onClick={onPlayPrevious} aria-label="Previous song" />
                <button onClick={onPlayNext} aria-label="Next song" />
            </div>
        </div>
    );
};

export default SoundWavePlayer;
