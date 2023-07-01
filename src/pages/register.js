
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

import Link from 'next/link';

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  // Check for errors from session and redirect if user is authenticated
  useEffect(() => {
    if (session?.error) {
      setErrorMessage(session.error);
    }

    if (sessionStatus === 'authenticated') {
      router.push('/');
    }
  }, [session, sessionStatus, router]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Basic input validation
    if (!username || !password || !confirmPassword || !email) {
      setErrorMessage("All fields are required.");
      return;
    }
    if (password !== confirmPassword) { 
      setErrorMessage("Passwords do not match.");
      return;
    }

    signIn('credentials', {
      username,
      password,
      email,
      isRegistration: true,
      redirect: true,
      callbackUrl: `${window.location.origin}/`
    }).catch((error) => {
      setErrorMessage("Failed to register. Please check your information and try again.");
      console.error(error);
    });     
  }; 

  return (
    <div className="h-5/6 flex items-center justify-center bg-gradient-to-r from-green-400 via-blue-500 to-purple-500">
      <div className="w-full max-w-sm p-6 m-4 bg-gray-100 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-700 mb-4">Register</h1>
        {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
        <form onSubmit={handleRegister}>
          <label className="block mb-2">
            <span className="text-sm text-gray-700">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-sm text-gray-700 border rounded-md focus:outline-none focus:shadow-outline"
            />
          </label>
          <label className="block mb-2">
            <span className="text-sm text-gray-700">Username</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-sm text-gray-700 border rounded-md focus:outline-none focus:shadow-outline"
            />
          </label>
          <label className="block mb-2">
            <span className="text-sm text-gray-700">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-sm text-gray-700 border rounded-md focus:outline-none focus:shadow-outline"
            />
          </label>
          <label className="block mb-2">
            <span className="text-sm text-gray-700">Confirm Password</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-sm text-gray-700 border rounded-md focus:outline-none focus:shadow-outline"
            />
          </label>
          <button type="submit" className="w-full px-3 py-2 mt-4 text-sm font-bold text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline">
            Register
          </button>
        </form>
        <Link legacyBehavior href="/login">
            <a className="mt-4 text-sm text-blue-500 hover:text-blue-600 text-center block">
                Already have an account? Login
            </a>
        </Link>
      </div>
    </div>
  );
}