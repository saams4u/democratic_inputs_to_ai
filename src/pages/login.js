
import Link from 'next/link';

import { useState } from "react";
import { useRouter } from "next/router";

import { withIronSession, applySession } from 'next-iron-session';

function Login({ user }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorEmpty, setErrorEmpty] = useState("");
  const [errorLogin, setErrorLogin] = useState("");

  const router = useRouter();
  const { error } = router.query;

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

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

    const loggedInUser = { username }; // Just for example. Your actual user object might be different.

    await applySession(req, res, {
      cookieName: "user-session",
      password: process.env.SECRET_COOKIE_PASSWORD,
      cookieOptions: {
        secure: process.env.NODE_ENV === "production",
      },
    });
    req.session.set('user', loggedInUser);
    await req.session.save();
    router.push("/");
  };

  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-r from-green-400 via-blue-500 to-purple-500">
      <div className="w-full max-w-md p-8 m-4 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h1>
        {(errorEmpty || errorLogin) && (
          <div className="mb-4 text-center bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
            <p className="font-bold">Error</p>
            <p>{errorEmpty || errorLogin}</p>
          </div>
        )}
        <form onSubmit={handleLogin}>
          <label className="block mb-4">
            <span className="text-sm font-semibold text-gray-600">Username</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 mt-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </label>
          <label className="block mb-6">
            <span className="text-sm font-semibold text-gray-600">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </label>
          <button type="submit" className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
            Login
          </button>
        </form>
        <Link legacyBehavior href="/register">
          <a className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700 text-center block">
            Don&apos;t have an account? Register
          </a>
        </Link>
      </div>
    </div>
  );
}

export const getServerSideProps = withIronSession(async ({ req, res }) => {
  await applySession(req, res, {
    password: process.env.SECRET_COOKIE_PASSWORD,
    cookieName: "user-session",
    cookieOptions: {
      secure: process.env.NODE_ENV ? process.env.NODE_ENV === "production" : false,
      ttl: 60 * 60 * 24 // 24 hours
    },
  });

  const user = req.session.get("user");

  return {
    props: { user },
  };
});

export default Login;