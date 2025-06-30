"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useUser } from "@/hooks/useUser";
import Button from "@/components/Button";
import useSubscribeModal from "@/hooks/useSubscribeModal";
import { postData } from "@/libs/helpers";

const AccountContent = () => {
    const router = useRouter();
    const subscribeModal = useSubscribeModal();
    const { isLoading, subscription, user } = useUser();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace('/');
        }
    }, [isLoading, user, router]);

    const redirectToCustomerPortal = async () => {
        setLoading(true);
        try {
            const { url, error } = await postData({
                url: '/api/create-portal-link'
            });
            window.location.assign(url);
        } catch (error) {
            if (error) {
                console.log((error as Error).message);
            }
            setLoading(false);
        }
    };

    return (
        <div className="mb-7 px-6">
            <div className="flex flex-col gap-y-4">
                <p className="text-green-500 text-lg font-semibold">Welcome to your account!</p>
                <p className="text-neutral-400">
                    You're logged in and can enjoy all the features of our music platform.
                </p>
            </div>
        </div>
    );
}

export default AccountContent;
