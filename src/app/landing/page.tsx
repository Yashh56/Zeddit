"use client";

import Link from "next/link";

const LandingPage = () => {
    return (
        <div className="h-screen flex flex-col items-center justify-center">

            <div className="flex flex-col items-center mb-12">
                <header className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold">Welcome to Zeddit</h1>
                    <p className="mt-2 text-lg md:text-xl">
                        Connect, share, and discuss with communities around the world!
                    </p>
                </header>

                <Link href="/sign-in">
                    <button className="px-6 py-3 bg-white text-blue-600 rounded-full font-semibold shadow-md hover:bg-gray-200 transition duration-300">
                        Log In
                    </button>
                </Link>
                <Link href="/sign-up" className="mt-4">
                    <button className="px-6 py-3 border border-white rounded-full font-semibold hover:bg-white hover:text-blue-600 transition duration-300">
                        Sign Up
                    </button>
                </Link>
            </div>

            <footer className="text-end items-end justify-end">
                <p>Join us and start your journey today!</p>
                <p className="text-sm">&copy; {new Date().getFullYear()} Zeddit. All rights reserved.</p>
            </footer>
        </div>

    );
};

export default LandingPage;
