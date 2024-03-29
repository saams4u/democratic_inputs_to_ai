
import Link from 'next/link';

import { useState } from "react";
import { useRouter } from "next/router";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!username || !password || !confirmPassword || !email) {
        setErrorMessage("All fields are required.");
        return;
    }
    if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match.");
        return;
    }

    try {
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, username }),
          });

        if (!res.ok) {
            throw new Error(await res.text());
        }

        const user = await res.json();
        if (user?.error) {
            setErrorMessage(user.error);
        } else {
            router.push('/');
        }
    } catch (error) {
        setErrorMessage(error.message);
    }
  };

  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-r from-green-400 via-blue-500 to-purple-500">
      <div className="w-full max-w-md p-8 m-4 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Register</h1>
        {errorMessage && (
          <div className="mb-4 text-center bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
            <p className="font-bold">Error</p>
            <p>{errorMessage}</p>
          </div>
        )}
        <form onSubmit={handleRegister}>
          <label className="block mb-4">
            <span className="text-sm font-semibold text-gray-600">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </label>
          <label className="block mb-4">
            <span className="text-sm font-semibold text-gray-600">Username</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 mt-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </label>
          <label className="block mb-4">
            <span className="text-sm font-semibold text-gray-600">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </label>
          <label className="block mb-6">
            <span className="text-sm font-semibold text-gray-600">Confirm Password</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </label>
          <button type="submit" className="w-full px-4 py-2 mt-2 text-sm font-bold text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-200">
            Register
          </button>
        </form>
        <Link legacyBehavior href="/login">
            <a className="mt-4 text-sm font-semibold text-blue-500 hover:text-blue-600 text-center block">
                Already have an account? Login
            </a>
        </Link>
      </div>
    </div>
  );
}