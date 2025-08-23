import { Song } from "@/types";

const useLoadSongUrl = (song: Song | undefined) => {
    if (!song) {
        return '';
    }

    // If using a CDN or static hosting, return the direct URL
    // If using UploadThing or another service, you might need to transform the path
    // For now, assuming the song_path contains the full URL or relative path
    return song.song_path;    
}

export default useLoadSongUrl;