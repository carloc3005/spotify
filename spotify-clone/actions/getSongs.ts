import { Song } from "@/types"
import { prisma } from "@/lib/prisma"

const getSongs = async(): Promise<Song[]> => {
    try {
        const songs = await prisma.song.findMany({
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
        console.log('Error in getSongs:', error);
        return [];
    }
};

export default getSongs;