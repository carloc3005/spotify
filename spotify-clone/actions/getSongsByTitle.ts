import { Song } from "@/types"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import getSongs from "./getSongs";

const getSongsByTitle = async(title: string): Promise<Song[]> => {
    try {
        const cookieStore = cookies()
        const supabase = createServerComponentClient({
            cookies: () => cookieStore
        });
        
        if(!title) {
            const allSongs = await getSongs();
            return allSongs;
        }

        const {data, error } = await supabase 
        .from('songs')
        .select('*')
        .ilike('title', `%${title}%`)
        .order('created_at', {ascending: false});

        if(error) {
            console.log(error);
            return [];
        }

        return (data as any) || [];
    } catch (error) {
        console.log('Error in getSongsByTitle:', error);
        return [];
    }
};

export default getSongsByTitle;