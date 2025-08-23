import { Song } from "@/types"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

const getLikedSongs = async(): Promise<Song[]> => {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return [];
        }

        const likedSongs = await prisma.likedSong.findMany({
            where: {
                userId: session.user.id
            },
            include: {
                song: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return likedSongs.map(item => ({
            id: item.song.id,
            user_id: item.song.userId,
            author: item.song.author,
            title: item.song.title,
            song_path: item.song.songPath,
            image_path: item.song.imagePath,
            created_at: item.song.createdAt.toISOString(),
            updated_at: item.song.updatedAt.toISOString()
        }));
    } catch (error) {
        console.log('Error in getLikedSongs:', error);
        return [];
    }
};

export default getLikedSongs;