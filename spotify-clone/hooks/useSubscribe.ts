import useAuthModal from "./useAuthModal";
import useSubscribeModal from "./useSubscribeModal";
import { useUser } from "./useUser";

const useSubscribe = () => {
    const authModal = useAuthModal();
    const subscribeModal = useSubscribeModal();
    const { user } = useUser();

    const onSubscribe = () => {
        if (!user) {
            // If not logged in, show subscribe modal
            return subscribeModal.onOpen();
        }
        
        // If logged in, user doesn't need to subscribe
        // They already have access to all features
        return;
    };

    return onSubscribe;
};

export default useSubscribe;
