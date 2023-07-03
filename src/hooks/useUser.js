
import { useEffect, useState } from "react";

export default function useUser() {
    const [user, setUser] = useState(null);
    const baseUrl = "https://democratic-inputs-to-ai-3bv6-1kf531lwp-saams4u.vercel.app";

    useEffect(() => {
        const getUser = async () => {
            const res = await fetch(`${baseUrl}/api/user`);
            const data = await res.json();
            setUser(data);
        }

        getUser()
    }, []);

    return {user}
}