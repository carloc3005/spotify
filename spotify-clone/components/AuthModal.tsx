"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { FaGoogle, FaDiscord, FaEye, FaEyeSlash } from "react-icons/fa";
import { useEffect } from "react";

import Modal from "./Modal";
import useAuthModal from "@/hooks/useAuthModal";
import Input from "./Input";
import Button from "./Button";

const AuthModal = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const { onClose, isOpen, isSignUpMode } = useAuthModal();
    const [isLoading, setIsLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
        mode: "onChange"
    });

    useEffect(() => {
        if (session) {
            router.refresh();
            onClose();
        }
    }, [session, router, onClose]);

    useEffect(() => {
        if (isOpen) {
            setIsSignUp(isSignUpMode);
        }
    }, [isOpen, isSignUpMode]);

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
                    try {
                        const error = await response.json();
                        toast.error(error.message || 'Something went wrong');
                    } catch (parseError) {
                        // If response is not JSON, use status text
                        toast.error(`Error: ${response.status} ${response.statusText}`);
                    }
                }
            } else {
                // Handle sign in with credentials
                const result = await signIn('credentials', {
                    email: data.email,
                    password: data.password,
                    redirect: false,
                });

                if (result?.error) {
                    toast.error('Invalid email or password');
                } else if (result?.ok) {
                    toast.success('Signed in successfully!');
                    onClose();
                    router.refresh();
                }
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
                toast.error(`Sign in failed: ${result.error}`);
            } else if (result?.ok) {
                toast.success('Sign in successful!');
                // Close modal and refresh
                onClose();
                window.location.href = '/';
            }
        } catch (error) {
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
                        <div>
                            <Input
                                id="name"
                                type="text"
                                disabled={isLoading}
                                {...register("name", { 
                                    required: isSignUp ? "Name is required" : false,
                                    minLength: {
                                        value: 1,
                                        message: "Name must be at least 1 character"
                                    },
                                    maxLength: {
                                        value: 50,
                                        message: "Name must be less than 50 characters"
                                    }
                                })}
                                placeholder="Your name"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name.message as string}</p>
                            )}
                        </div>
                    )}
                    
                    <div>
                        <Input
                            id="email"
                            type="email"
                            disabled={isLoading}
                            {...register("email", { 
                                required: "Email is required",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Please enter a valid email address"
                                }
                            })}
                            placeholder="Email address"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message as string}</p>
                        )}
                    </div>
                    
                    <div>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                disabled={isLoading}
                                {...register("password", { 
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters"
                                    }
                                })}
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
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password.message as string}</p>
                        )}
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
                </div>
            </div>
        </Modal>
    );
};

export default AuthModal;