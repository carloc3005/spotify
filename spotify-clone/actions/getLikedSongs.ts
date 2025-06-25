import { Song } from "@/types"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { template } from "@supabase/auth-ui-shared";
import { cookies } from "next/headers"

const getLikedSongs = async(): Promise<Song[]> => {
    try {
        const cookieStore = cookies()
        const supabase = createServerComponentClient({
            cookies: () => cookieStore
        });

        const {
            data: {
                session
            }
        } = await supabase.auth.getSession();

        const {data, error } = await supabase 
        .from('liked_songs')
        .select('*, songs(*)')
        .eq('user_id', session?.user?.id)
        .order('created_at', {ascending: false});

        if (error) {
            console.log(error);
            return [];
        }

        if (!data) {
            return [];
        }

        return data.map((item) => ({
            ...item.songs
        }));
    } catch (error) {
        console.log('Error in getLikedSongs:', error);
        return [];
    }
};

export default getLikedSongs;