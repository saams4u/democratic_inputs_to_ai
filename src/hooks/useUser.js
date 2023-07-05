
import { useSession } from "next-auth/react";

export default function useUser() {
    const { data: session, status } = useSession();
    const user = status === 'loading' ? null : session?.user;
    
    return { user, status };
}