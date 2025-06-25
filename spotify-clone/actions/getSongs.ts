import { Song } from "@/types"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

const getSongs = async(): Promise<Song[]> => {
    try {
        const cookieStore = cookies()
        const supabase = createServerComponentClient({
            cookies: () => cookieStore
        });

        const {data, error } = await supabase 
        .from('songs')
        .select('*')
        .order('created_at', {ascending: false});

        if(error) {
            console.log(error);
            return [];
        }

        return (data as any) || [];
    } catch (error) {
        console.log('Error in getSongs:', error);
        return [];
    }
};

export default getSongs;