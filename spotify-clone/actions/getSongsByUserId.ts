import { Song } from "@/types"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

const getSongsByUserId = async(): Promise<Song[]> => {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return [];
        }

        const songs = await prisma.song.findMany({
            where: {
                userId: session.user.id
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
        console.log('Error in getSongsByUserId:', error);
        return [];
    }
};

export default getSongsByUserId;