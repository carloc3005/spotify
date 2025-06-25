import { Song } from "@/types"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

const getSongsByUserId = async(): Promise<Song[]> => {
    try {
        const cookieStore = cookies()
        const supabase = createServerComponentClient({
            cookies: () => cookieStore
        });

        const { data: sessionData, 
            error: sessionError } 
            = await supabase.auth.getSession();

        if (sessionError) {
            console.log(sessionError.message)
            return [];
        }    

        if (!sessionData.session?.user?.id) {
            return [];
        }

        const { data, error } = await supabase
            .from('songs')
            .select('*')
            .eq('user_id', sessionData.session.user.id)
            .order('created_at', { ascending: false});

        if (error) {
            console.log(error.message);
            return [];
        }

        return (data as any) || [];
    } catch (error) {
        console.log('Error in getSongsByUserId:', error);
        return [];
    }
};

export default getSongsByUserId;