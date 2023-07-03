
import { useEffect, useState } from "react";
import axios from 'axios';

export default function useUser() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user`);
            setUser(res.data);
        }

        getUser()
    }, []);

    return {user}
}