
import { useEffect, useState } from "react";

export default function useUser() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user`);
            const data = await res.json();
            setUser(data);
        }

        getUser()
    }, []);

    return {user}
}