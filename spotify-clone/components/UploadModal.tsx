"use client";

import useUploadModal from "@/hooks/useUploadModal";
import Modal from "./Modal";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import toast from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import uniqid from "uniqid";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";

const UploadModal = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useUser();
    const supabaseClient = useSupabaseClient();
    const uploadModal = useUploadModal();
    const router = useRouter();
    const { register, handleSubmit, reset } = useForm<FieldValues>({
        defaultValues: {
            author: '',
            title: '',
            song: null,
            image: null,
        }
    })


    const onChange = (open: boolean) => {
        if (!open) {
            // Reset the form
            reset();
            uploadModal.onClose();
        }
    }

    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        try {
            setIsLoading(true);            
            const imageFile = values.image?.[0];
            const songFile = values.song?.[0];

            if (!songFile || !user) {
                toast.error('Missing fields');
                return;
            }

            const uniqueID = uniqid();
            // Upload song

            const {
                data: songData,
                error: songError,
            } = await supabaseClient
                .storage
                .from('songs')
                .upload(`song-${values.title}-${uniqueID}`, songFile, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (songError) {
                setIsLoading(false);
                return toast.error('Failed song upload.');
            }

            // Upload Image

            const {
                data: imageData,
                error: imageError,
            } = await supabaseClient
                .storage
                .from('images')
                .upload(`song-${values.title}-${uniqueID}`, imageFile, {
                    cacheControl: '3600',
                    upsert: false
                });


            if (imageError) {
                setIsLoading(false);
                return toast.error('Failed image upload');
            }
            
            const {
                error: supabaseError
            } = await supabaseClient
            .from('songs')
            .insert({
                user_id: user.id,
                title: values.title,
                author: values.author,
                image_path: imageData.path,
                song_path: songData.path
            });

            if(supabaseError) {
                setIsLoading(false);
                return toast.error(supabaseError.message)
            }

            router.refresh();

            setIsLoading(false);

            toast.success('Song created');

            reset();

            uploadModal.onClose();

        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <Modal title="Add a song" description="Upload an mp3 file" isOpen={uploadModal.isOpen} onChange={onChange}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-6 p-2">
                <div className="space-y-1">
                    <label htmlFor="title" className="text-sm font-medium text-white">
                        Song Title
                    </label>
                    <Input
                        id="title"
                        disabled={isLoading}
                        {...register('title', { required: true })}
                        placeholder="Enter song title"
                    />
                </div>

                <div className="space-y-1">
                    <label htmlFor="author" className="text-sm font-medium text-white">
                        Artist
                    </label>
                    <Input
                        id="author"
                        disabled={isLoading}
                        {...register('author', { required: true })}
                        placeholder="Enter artist name"
                    />
                </div>

                <div className="space-y-1">
                    <label htmlFor="song" className="text-sm font-medium text-white">
                        Song File
                    </label>
                    <div className="text-xs text-neutral-400 mb-2">
                        Select an MP3 file to upload
                    </div>
                    <Input
                        id="song"
                        type="file"
                        disabled={isLoading}
                        accept=".mp3"
                        {...register('song', { required: true })}
                    />
                </div>

                <div className="space-y-1">
                    <label htmlFor="image" className="text-sm font-medium text-white">
                        Cover Image (Optional)
                    </label>
                    <div className="text-xs text-neutral-400 mb-2">
                        Upload a cover image for your song
                    </div>
                    <Input
                        id="image"
                        type="file"
                        disabled={isLoading}
                        accept="image/*"
                        {...register('image')}
                    />
                </div>                
                <div className="flex justify-end gap-x-4 pt-6">
                    <button
                        type="button"
                        onClick={() => onChange(false)}
                        className="px-8 py-3 text-base font-medium text-neutral-400 hover:text-white transition-colors"
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-neutral-600 disabled:cursor-not-allowed text-white text-base font-medium rounded-lg transition-colors"
                    >
                        {isLoading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

export default UploadModal;