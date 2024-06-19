// pages/api/check-auth.js
import nextConnect from 'next-connect';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const handler = nextConnect();

handler.use(all);

handler.use((req, res, next) => {
  try {
    // Parse cookies from the request headers
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.auth;

    console.log(cookies);

    

    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    return res.status(401).json({ message: 'Invalid token' });
  }
});

handler.get((req, res) => {
  res.status(200).json({ user: req.user });
});

export default handler;
