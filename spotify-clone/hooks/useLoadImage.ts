import { Song } from "@/types";

const useLoadImage = (song: Song) => {
    if(!song) {
        return null;
    }    
    
    // Return the image path directly
    // If using a CDN or static hosting, return the direct URL
    // If using UploadThing or another service, you might need to transform the path
    return song.image_path;
};

export default useLoadImage;