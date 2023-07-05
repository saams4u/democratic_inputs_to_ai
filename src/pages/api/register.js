
import { registerUser } from '@/services/userService';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'POST':
      try {
        const { email, password, username } = req.body;
        const user = await registerUser({ email, password, username });

        return res.status(200).json(user);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    default:
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}