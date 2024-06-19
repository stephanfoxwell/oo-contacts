// utils/auth.js
import cookie from 'cookie';

/**
 * Stores a JWT in an HttpOnly cookie
 * @param {object} res - The Next.js response object
 * @param {string} token - The JWT token
 */
export const setTokenCookie = (res, token) => {
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
    sameSite: 'strict',
  };

  res.setHeader('Set-Cookie', cookie.serialize('auth', token, options));
};
