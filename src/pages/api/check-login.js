
import { withNextSession } from '@/lib/session'; // use your actual session middleware if different

export default withNextSession(async (req, res) => {
  if (req.method === 'GET') {
    const user = req.session.get('user');
    if (user) {
      res.status(200).json({ isLoggedIn: true, user });
    } else {
      res.status(401).json({ isLoggedIn: false });
    }
  } else {
    res.status(400).json({ error: 'Invalid request method' });
  }
});