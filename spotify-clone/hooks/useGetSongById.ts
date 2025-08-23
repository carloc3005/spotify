import { Song } from "@/types";
import { useEffect, useMemo, useState } from "react"
import toast from "react-hot-toast";

const useGetSongById = (id?: string) => {
    const [isLoading, setIsLoading] = useState(false);
    const [song, setSong] = useState<Song | undefined>();

    useEffect(() => {
        if (!id) {
            return;
        }

        setIsLoading(true);
        const fetchSong = async () => {
            try {
                const response = await fetch(`/api/songs/${id}`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch song');
                }
                
                const data = await response.json();
                setSong(data as Song);
            } catch (error) {
                toast.error('Failed to load song');
                console.error('Error fetching song:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSong();
    }, [id]);

    return useMemo(() => ({
        isLoading,
        song
    }), [isLoading, song]);
};

export default useGetSongById;
