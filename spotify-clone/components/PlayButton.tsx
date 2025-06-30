"use client";

import { FaPlay } from "react-icons/fa";
import { MdSubscriptions } from "react-icons/md";
import { useUser } from "@/hooks/useUser";
import useSubscribeModal from "@/hooks/useSubscribeModal";

interface PlayButtonProps {
    onClick?: () => void;
}

const PlayButton: React.FC<PlayButtonProps> = ({ onClick }) => {
    const { user } = useUser();
    const subscribeModal = useSubscribeModal();

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        
        if (!user) {
            return subscribeModal.onOpen();
        }
        
        if (onClick) {
            onClick();
        }
    };

    return (
        <button 
            onClick={handleClick}
            className="transition opacity-0 rounded-full flex items-center bg-green-500 p-4 drop-shadow-md translate-y-1/4 group-hover:opacity-100
            group-hover:translate-y-0 hover:scale-110"
        >
            {user ? (
                <FaPlay className="text-black"/>
            ) : (
                <MdSubscriptions className="text-black"/>
            )}
        </button>
    );
}

export default PlayButton;