
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

import Link from 'next/link';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorEmpty, setErrorEmpty] = useState("");
  const [errorLogin, setErrorLogin] = useState("");

  const { data: session, status: sessionStatus } = useSession();

  const router = useRouter();
  const { error } = router.query;

  // Redirect if the user is already logged in
  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  // Map error code to error message
  useEffect(() => {
    if (error === 'CredentialsSignin')
      setErrorLogin('Failed to sign in. Please check your credentials and try again.');
  }, [error]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setErrorEmpty("All fields are required.");
      return;
    }

    signIn('credentials', {
      username,
      password,
      callbackUrl: `${window.location.origin}/`, // callback URL upon successful sign in
    }).catch(console.error);
  };

  return (
    <div className="h-5/6 flex items-center justify-center bg-gradient-to-r from-green-400 via-blue-500 to-purple-500">
      <div className="w-full max-w-sm p-6 m-4 bg-gray-100 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-700 mb-4">Login</h1>
        {errorEmpty && <p className="text-red-500 text-center">{errorEmpty}</p>}
        {errorLogin && <p className="text-red-500 text-center">{errorLogin}</p>}
          <form onSubmit={handleLogin}>
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
            <button type="submit" className="w-full px-3 py-2 mt-4 text-sm font-bold text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline">
              Login
            </button>
          </form>
          <Link legacyBehavior href="/register">
            <a className="mt-4 text-sm text-blue-500 hover:text-blue-600 text-center block">
              Don't have an account? Register
            </a>
          </Link>
        </div>
    </div>
  );
}