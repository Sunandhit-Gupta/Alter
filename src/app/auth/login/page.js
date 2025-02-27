"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { FiMail, FiLock, FiEye, FiEyeOff, FiLogIn } from "react-icons/fi";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Login successful!");
                router.push("/");
            }
        } catch (error) {
            toast.error("An unexpected error occurred. Please try again.");
            console.error("Login error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                <div>
                    <h1 className="text-center text-3xl font-extrabold text-gray-800">
                        Welcome Back!
                    </h1>
                    <p className="mt-2 text-center text-sm text-gray-800">
                        Sign in to continue
                    </p>
                </div>
                
                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                    <div className="space-y-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiMail className="h-5 w-5 text-black" />
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-3 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition text-gray-800 placeholder-gray-500"
                                placeholder="Email address"
                            />
                        </div>
                        
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiLock className="h-5 w-5 text-black" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-3 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition text-gray-800 placeholder-gray-500"
                                placeholder="Password"
                            />
                            <div 
                                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? (
                                    <FiEyeOff className="h-5 w-5 text-black hover:text-gray-700" />
                                ) : (
                                    <FiEye className="h-5 w-5 text-black hover:text-gray-700" />
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-4 text-white text-sm font-semibold rounded-md bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-all duration-300 shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? "Signing in..." : (
                                <>
                                    <FiLogIn className="mr-2 h-5 w-5 text-white" />
                                    Sign in
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <p className="mt-6 text-center text-sm text-gray-800">
                    Don't have an account?{" "}
                    <Link href="/auth/register" className="text-blue-500 hover:text-blue-700 font-medium">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
}