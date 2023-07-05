
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from 'next/router';

export default function NavBar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkLoginStatus = async () => {
          const res = await fetch('/api/check-login', {
            method: 'GET',
            credentials: 'include',
          });
          if (res.ok) {
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
          }
        };      
        checkLoginStatus();
    }, []);      

    const handleLogoutClick = async (event) => {
        event.preventDefault();
        const res = await fetch('/api/logout', {
            method: 'POST',
            credentials: 'include'
        });
        if(res.ok){
           setIsLoggedIn(false);
           router.push('/login');
        }
    };    

    return (
        <header className="p-6 bg-indigo-700 shadow-md flex justify-between items-center px-8 lg:px-16 fixed top-0 w-full z-50 transition-all duration-500">
            <Link legacyBehavior href="/">
                <a className="font-bold text-xl text-white hover:text-indigo-300 transition-all duration-300 cursor-pointer">
                    Dashboard
                </a>
            </Link>
            <div>
                {!isLoggedIn && (
                    <>
                        <button
                            onClick={() => router.push("/login")}
                            className="mr-8 font-semibold text-white bg-transparent border border-white rounded-lg px-6 py-2 hover:bg-white hover:text-indigo-700 transition-all duration-300 cursor-pointer"
                            style={{ fontFamily: "Roboto", fontSize: 18 }} 
                        >
                            Login
                        </button>
                        <button
                            onClick={() => router.push("/register")}
                            className="px-6 py-2 font-semibold text-white bg-indigo-500 rounded-lg hover:bg-indigo-400 transition-all duration-300 cursor-pointer"
                            style={{ fontFamily: "Roboto", fontSize: 18 }} 
                        >
                            Register
                        </button>
                    </>
                )}
                {isLoggedIn && (
                    <button 
                        onClick={handleLogoutClick} 
                        className="px-6 py-2 font-semibold text-white bg-red-500 rounded-lg hover:bg-red-400 transition-all duration-300 cursor-pointer"
                        style={{ fontFamily: "Roboto", fontSize: 18 }}
                        >
                        Logout
                    </button>
                )}
            </div>
        </header>
    );
}