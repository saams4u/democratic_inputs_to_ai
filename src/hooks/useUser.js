
import { useEffect, useState } from "react";

export default function useUser() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch("/api/user");

        if (!res.ok) {
          throw new Error('Could not fetch user data');
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    getUser();
  }, []);

  return { user, error, loading };
}