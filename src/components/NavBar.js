
import Link from "next/link";

import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function NavBar() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const handleLogoutClick = async (event) => {
        event.preventDefault();
        await signOut({ callbackUrl: '/login' }); // Use the signOut method from NextAuth client
    };

    return (
        <header className="p-4 bg-indigo-600 shadow-md flex justify-between items-center px-8 lg:px-16 fixed top-0 w-full z-50">
            <Link href="/">
                <div className="font-bold text-white hover:text-indigo-200 transition-colors cursor-pointer">
                    Dashboard
                </div>
            </Link>
            <div>
                {!session && (
                    <>
                        <button
                            onClick={() => router.push("/login")}
                            className="mr-8 font-semibold text-white bg-transparent border border-white rounded px-4 py-2 hover:bg-white hover:text-indigo-600 transition-colors cursor-pointer"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => router.push("/register")}
                            className="px-4 py-2 font-semibold text-white bg-indigo-400 rounded hover:bg-indigo-200 transition-colors cursor-pointer"
                        >
                            Register
                        </button>
                    </>
                )}
                {session && (
                    <button onClick={handleLogoutClick} className="px-4 py-2 font-semibold text-white bg-red-400 rounded hover:bg-red-300 transition-colors cursor-pointer">
                        Logout
                    </button>
                )}
            </div>
        </header>
    );
}