"use client";

import useAuthModal from "@/hooks/useAuthModal";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import toast from "react-hot-toast";

interface LikeButtonProps {
    songId: string;
};

const LikeButton: React.FC<LikeButtonProps> = ({
    songId
}) => {
    const router = useRouter();
    const { data: session } = useSession();
    
    const authModal = useAuthModal();
    const user = session?.user;

    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        if(!user?.id) {
            return;
        }

        const fetchData = async () => {            
            try {
                const response = await fetch(`/api/liked-songs/check?songId=${songId}&userId=${user.id}`);
                const data = await response.json();
                setIsLiked(data.isLiked);
            } catch (error) {
                console.error('Error checking like status:', error);
            }
        }

        fetchData();
    }, [songId, user?.id]);

    const Icon = isLiked ? AiFillHeart : AiOutlineHeart;    
    const handleLike = async () => {
        if (!user) {
            return authModal.onOpen();
        }

        try {
            const response = await fetch('/api/liked-songs', {
                method: isLiked ? 'DELETE' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    songId,
                    userId: user.id
                }),
            });

            if (response.ok) {
                setIsLiked(!isLiked);
                toast.success(isLiked ? 'Removed from liked songs' : 'Liked');
                router.refresh();
            } else {
                const error = await response.json();
                toast.error(error.message || 'Something went wrong');
            }
        } catch (error) {
            toast.error('Something went wrong');
            console.error('Error toggling like:', error);
        }
    }

    return(
        <button onClick={handleLike} className="hover:opacity-75 transition ">
            <Icon color={isLiked ? '#22c55e' : 'white'} size={25}/>
        </button>
    );
}


export default LikeButton;