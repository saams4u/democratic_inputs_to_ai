
import { getSession } from "next-auth/react";

export default async function userRoute(req, res) {

    const session = await getSession({ req });

    if (session) {
        return res.status(200).json(session.user);
    } else {
        return res.status(200).json(null);
    }
}