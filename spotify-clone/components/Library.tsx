"use client";

import useAuthModal from "@/hooks/useAuthModal";
import useUploadModal from "@/hooks/useUploadModal";
import { useUser } from "@/hooks/useUser";
import { Song } from "@/types";
import { AiOutlinePlus } from "react-icons/ai";
import { TbPlaylist } from "react-icons/tb";
import MediaItem from "./MediaItem";
import useOnPlay from "@/hooks/useOnPlay";

interface LibraryProps {
    songs: Song[];
}

const Library: React.FC<LibraryProps> = ({ songs }) => {
    const authModal = useAuthModal();
    const { user } = useUser();
    const uploadModal = useUploadModal();

    const onPlay = useOnPlay(songs);

    const onClick = () => {
        if(!user) {
            return authModal.onOpen();
        }

        return uploadModal.onOpen();
    };


    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between px-5 pt-4">
                <div className="inline-flex items-center gap-x-2">
                    <TbPlaylist className="text-neutral-400" size={25} />
                    <p className="text-neutral-400 font-medium text-md">
                        {user ? "Your Library" : "Music Library"}
                    </p>
                </div>
                <AiOutlinePlus onClick={onClick} size={20} className="text-neutral-400 cursor-pointer hover:text-white transition " title={user ? "Add music" : "Sign up to add music"} />
            </div>
            <div className="flex flex-col gap-y-2 mt-4 px-3">
                {songs.length === 0 ? (
                    <div className="text-neutral-400 text-sm px-2 py-4">
                        {user ? "No songs in your library yet. Upload some music!" : "Welcome! Browse our collection of songs below."}
                    </div>
                ) : (
                    songs.map((song) => (
                        <MediaItem onClick={(id: string ) => onPlay(id)} key={song.id} data={song} />
                    ))
                )}
            </div>
        </div>
    );
}

export default Library;