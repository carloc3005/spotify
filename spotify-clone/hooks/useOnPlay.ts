import { Song } from "@/types";
import usePlayer from "./usePlayer";
import useAuthModal from "./useAuthModal";
import { useUser } from "./useUser";
import { toast } from "react-hot-toast";

const useOnPlay = (songs: Song[]) => {
    const player = usePlayer();
    const authModal = useAuthModal();
    const { user } = useUser();    
    
    const onPlay = (id: string ) => {
        if (!user) {
            // Show a toast message encouraging signup for full features
            toast.success("Sign up to enjoy unlimited music and create playlists!", {
                duration: 4000,
                position: 'bottom-center',
            });
            
            // Open auth modal in signup mode after a short delay
            setTimeout(() => {
                authModal.onOpenSignUp(); // Open in sign up mode
            }, 1000);
            
            // Still allow preview/play for demo purposes
            player.setId(id);
            player.setIds(songs.map((song) => song.id));
            return;
        }

        player.setId(id);
        player.setIds(songs.map((song) => song.id));
    };

    return onPlay;
};

export default useOnPlay;