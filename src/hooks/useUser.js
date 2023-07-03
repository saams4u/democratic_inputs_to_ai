
import { useEffect, useState } from "react";
import axios from 'axios';

export default function useUser() {
    const [user, setUser] = useState(null);
    const baseUrl = "https://democratic-inputs-to-ai-3bv6.vercel.app";

    useEffect(() => {
        const getUser = async () => {
            const res = await axios.get(`${baseUrl}/api/user`);
            setUser(res.data);
        }

        getUser()
    }, []);

    return {user}
}