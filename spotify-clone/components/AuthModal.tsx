"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { FaGoogle, FaDiscord, FaGithub, FaEye, FaEyeSlash } from "react-icons/fa";
import { useEffect } from "react";

import Modal from "./Modal";
import useAuthModal from "@/hooks/useAuthModal";
import Input from "./Input";
import Button from "./Button";

const AuthModal = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const { onClose, isOpen } = useAuthModal();
    const [isLoading, setIsLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    useEffect(() => {
        if (session) {
            router.refresh();
            onClose();
        }
    }, [session, router, onClose]);

    const onChange = (open: boolean) => {
        if (!open) {
            reset();
            setIsSignUp(false);
            onClose();
        }
    };

    const toggleMode = () => {
        setIsSignUp(!isSignUp);
        reset();
    };

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setIsLoading(true);
        
        try {
            if (isSignUp) {
                // Handle sign up
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: data.name,
                        email: data.email,
                        password: data.password,
                    }),
                });

                if (response.ok) {
                    toast.success('Account created successfully!');
                    setIsSignUp(false);
                    reset();
                } else {
                    const error = await response.json();
                    toast.error(error.message || 'Something went wrong');
                }
            } else {
                // For now, just show success for sign in since we don't have password auth
                toast.success('Please use OAuth providers below for sign in');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOAuthSignIn = async (provider: string) => {
        try {
            setIsLoading(true);
            const result = await signIn(provider, { 
                callbackUrl: '/',
                redirect: false 
            });
            
            if (result?.error) {
                console.error('OAuth Error:', result.error);
                toast.error(`Sign in failed: ${result.error}`);
            } else {
                toast.success('Sign in successful!');
            }
        } catch (error) {
            console.error('OAuth Error:', error);
            toast.error('Sign in failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal 
            title={isSignUp ? "Create your account" : "Welcome back"} 
            description={isSignUp ? "Sign up to start listening" : "Login to your account"} 
            isOpen={isOpen} 
            onChange={onChange}
        >
            <div className="flex flex-col gap-4">
                {/* Email/Password Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    {isSignUp && (
                        <Input
                            id="name"
                            type="text"
                            disabled={isLoading}
                            {...register("name", { required: isSignUp })}
                            placeholder="Your name"
                        />
                    )}
                    
                    <Input
                        id="email"
                        type="email"
                        disabled={isLoading}
                        {...register("email", { required: true })}
                        placeholder="Email address"
                    />
                    
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            disabled={isLoading}
                            {...register("password", { required: true, minLength: 6 })}
                            placeholder="Password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    
                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? "Loading..." : (isSignUp ? "Sign Up" : "Sign In")}
                    </Button>
                </form>

                {/* Toggle between Sign In / Sign Up */}
                <div className="text-center">
                    <button
                        onClick={toggleMode}
                        className="text-sm text-gray-400 hover:text-white underline"
                    >
                        {isSignUp 
                            ? "Already have an account? Sign in" 
                            : "Don't have an account? Sign up"
                        }
                    </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-gray-600"></div>
                    <span className="text-sm text-gray-400">or</span>
                    <div className="flex-1 h-px bg-gray-600"></div>
                </div>

                {/* OAuth Providers */}
                <div className="flex flex-col gap-3">
                    <Button 
                        onClick={() => handleOAuthSignIn('google')}
                        className="w-full bg-red-500 hover:bg-red-600 flex items-center justify-center gap-3"
                    >
                        <FaGoogle size={20} />
                        Continue with Google
                    </Button>
                    
                    <Button 
                        onClick={() => handleOAuthSignIn('discord')}
                        className="w-full bg-indigo-500 hover:bg-indigo-600 flex items-center justify-center gap-3"
                    >
                        <FaDiscord size={20} />
                        Continue with Discord
                    </Button>
                    
                    <Button 
                        onClick={() => handleOAuthSignIn('github')}
                        className="w-full bg-gray-800 hover:bg-gray-900 flex items-center justify-center gap-3"
                    >
                        <FaGithub size={20} />
                        Continue with GitHub
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default AuthModal;