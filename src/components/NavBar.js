import Link from "next/link";

import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function NavBar() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const handleLogoutClick = async (event) => {
        event.preventDefault();
        await signOut({ callbackUrl: '/login' }); 
    };

    return (
        <header className="p-6 bg-indigo-700 shadow-md flex justify-between items-center px-8 lg:px-16 fixed top-0 w-full z-50 transition-all duration-500">
            <Link legacyBehavior href="/">
                <a className="font-bold text-xl text-white hover:text-indigo-300 transition-all duration-300 cursor-pointer">
                    Dashboard
                </a>
            </Link>
            <div>
                {!session && (
                    <>
                        <button
                            onClick={() => router.push("/login")}
                            className="mr-8 font-semibold text-white bg-transparent border border-white rounded px-6 py-2 hover:bg-white hover:text-indigo-700 transition-all duration-300 cursor-pointer"
                            style={{ fontFamily: "Roboto", fontSize: 18 }} 
                        >
                            Login
                        </button>
                        <button
                            onClick={() => router.push("/register")}
                            className="px-6 py-2 font-semibold text-white bg-indigo-500 rounded hover:bg-indigo-400 transition-all duration-300 cursor-pointer"
                            style={{ fontFamily: "Roboto", fontSize: 18 }} 
                        >
                            Register
                        </button>
                    </>
                )}
                {session && (
                    <button 
                        onClick={handleLogoutClick} 
                        className="px-6 py-2 font-semibold text-white bg-red-500 rounded hover:bg-red-400 transition-all duration-300 cursor-pointer"
                        style={{ fontFamily: "Roboto", fontSize: 18 }}
                        >
                        Logout
                    </button>
                )}
            </div>
        </header>
    );
}
