"use client"

import { Subscription, UserDetails } from "@/types";
import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";

type UserContextType = {
    accessToken: string | null;
    user: any | null;
    userDetails: UserDetails | null;
    isLoading: boolean;
    subscription: Subscription | null;
}

export const UserContext = createContext<UserContextType | undefined>(
    undefined
)

export interface Props {
    [propName: string]: any;
};

export const MyUserContextProvider = (props: Props) => {
    const { data: session, status } = useSession();
    const isLoadingUser = status === "loading";
    
    const user = session?.user ?? null;
    const accessToken = null; // NextAuth doesn't expose raw access tokens directly
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [userDetails, setUserDetails] = useState<UserDetails | null >(null);
    const [subscription, setSubscription] = useState<Subscription | null>(null);

    const getUserDetails = async () => {
        const response = await fetch('/api/user/details');
        if (response.ok) {
            return await response.json();
        }
        throw new Error('Failed to fetch user details');
    };

    const getSubscription = async () => {
        const response = await fetch('/api/user/subscription');
        if (response.ok) {
            return await response.json();
        }
        throw new Error('Failed to fetch subscription');
    };

    useEffect(() => {
        if (user && !isLoadingData && !userDetails && !subscription) {
            setIsLoadingData(true);

            Promise.allSettled([getUserDetails(), getSubscription()]).then(
                (results) => {
                    const userDetailsPromise = results[0];
                    const subscriptionPromise = results[1];

                    if(userDetailsPromise.status === "fulfilled") {
                        setUserDetails(userDetailsPromise.value as UserDetails);
                    }

                    if(subscriptionPromise.status === "fulfilled") {
                        setSubscription(subscriptionPromise.value as Subscription);
                    }

                    setIsLoadingData(false);
                }
            )
        } else if (!user && !isLoadingUser && !isLoadingData) {
            setUserDetails(null);
            setSubscription(null);
        }
    }, [user, isLoadingUser]);

    const value = {
        accessToken,
        user,
        userDetails,
        isLoading: isLoadingUser || isLoadingData,
        subscription
    };

    return <UserContext.Provider value={value} {...props} />

};

export const useUser = () => {
    const context = useContext(UserContext);

    if(context === undefined) {
        throw new Error('useUser must be used within a MyUserContextProvider');
    }

    return context;
}