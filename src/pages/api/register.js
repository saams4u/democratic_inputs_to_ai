
import { registerUser, loginUser } from '@/services/userService';
import { withNextSession } from '@/lib/session';

export default withNextSession(async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await registerUser(req.body);
      const { username, password } = req.body;

      const loggedUser = await loginUser({ username, password });
      if (!loggedUser) {
        res.status(401).json({ error: 'Login failed' });
        return;
      }

      req.session.set('user', loggedUser);
      await req.session.save();

      res.status(200).json(loggedUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(400).json({ error: 'Invalid request method' });
  }
});
