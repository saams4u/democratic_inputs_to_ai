
import { getSession } from "next-auth/react";

export default function withNextAuthSession(handler) {
    return async (req, res) => {
        const session = await getSession({ req });
        if (session) {
            return handler(req, res);
        } else {
            res.status(401).json({ error: "Not authorized" });
        }
    }
}
