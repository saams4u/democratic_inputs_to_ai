
import { loginUser } from '@/services/userService';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const user = await loginUser(req.body);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(400).json({ error: 'Invalid request method' });
  }
}
