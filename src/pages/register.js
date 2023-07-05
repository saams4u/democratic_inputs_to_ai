
import Link from 'next/link';

import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { useUser } from "@/lib/hooks";
import { applySession } from "next-iron-session";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user?.error) {
      setErrorMessage(user.error);
    }
    if (user) {
      router.push('/');
    }
  }, [user, router]);

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

export const getServerSideProps = withIronSession(async ({ req, res }) => {
  await applySession(req, res, {
    cookieName: "user-session",
    password: process.env.SECRET_COOKIE_PASSWORD,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  });

  const user = req.session.get("user");

  if (user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    };
  }

  return {
    props: {},
  };
});