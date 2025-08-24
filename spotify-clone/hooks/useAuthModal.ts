import {create} from "zustand";

interface AuthModalStore {
    isOpen: boolean;
    isSignUpMode: boolean;
    onOpen: () => void;
    onOpenSignUp: () => void;
    onClose: () => void;
}

const useAuthModal = create<AuthModalStore>((set) => ({
    isOpen: false,
    isSignUpMode: false,
    onOpen: () => set({isOpen: true, isSignUpMode: false}),
    onOpenSignUp: () => set({isOpen: true, isSignUpMode: true}),
    onClose: () => set({isOpen: false, isSignUpMode: false}),
}));

export default useAuthModal;