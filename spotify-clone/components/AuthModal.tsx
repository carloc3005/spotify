"use client";

import Modal from "./Modal";
import { useRouter } from "next/navigation";
import useAuthModal from "@/hooks/useAuthModal";
import { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import Button from "./Button";

const AuthModal = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const {onClose, isOpen} = useAuthModal();

    useEffect(() => {
        if (session) {
            router.refresh();
            onClose();
        }
    }, [session, router, onClose]);

    const onChange = (open: boolean) => {
        if(!open) {
            onClose();
        }
    }

    const handleSignIn = (provider: string) => {
        signIn(provider, { callbackUrl: '/' });
    };

    return (
        <Modal title="Welcome back" description="Login to your account" isOpen={isOpen} onChange={onChange}>
            <div className="flex flex-col gap-4">
                <Button 
                    onClick={() => handleSignIn('google')}
                    className="w-full bg-red-500 hover:bg-red-600"
                >
                    Sign in with Google
                </Button>
                <Button 
                    onClick={() => handleSignIn('discord')}
                    className="w-full bg-indigo-500 hover:bg-indigo-600"
                >
                    Sign in with Discord
                </Button>
                <Button 
                    onClick={() => handleSignIn('spotify')}
                    className="w-full bg-green-500 hover:bg-green-600"
                >
                    Sign in with Spotify
                </Button>
            </div>
        </Modal>
    );
}

export default AuthModal;