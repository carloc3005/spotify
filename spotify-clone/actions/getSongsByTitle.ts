import { Song } from "@/types"
import { prisma } from "@/lib/prisma"
import getSongs from "./getSongs";

const getSongsByTitle = async(title: string): Promise<Song[]> => {
    try {
        if(!title) {
            const allSongs = await getSongs();
            return allSongs;
        }

        const songs = await prisma.song.findMany({
            where: {
                title: {
                    contains: title,
                    mode: 'insensitive'
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return songs.map(song => ({
            id: song.id,
            user_id: song.userId,
            author: song.author,
            title: song.title,
            song_path: song.songPath,
            image_path: song.imagePath,
            created_at: song.createdAt.toISOString(),
            updated_at: song.updatedAt.toISOString()
        }));
    } catch (error) {
        console.log('Error in getSongsByTitle:', error);
        return [];
    }
};

export default getSongsByTitle;