
import { getSession } from "next-auth/react";

export default async function userRoute(req, res) {
    try {
        const session = await getSession({ req });

        if (session) {
            return res.status(200).json(session.user);
        } else {
            return res.status(401).json({ error: "Not authorized" });
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "An error occurred while retrieving the session." });
    }
}
