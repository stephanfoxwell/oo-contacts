// pages/api/test.js
import nextConnect from 'next-connect';

const handler = nextConnect();

handler.get((req, res) => {
  res.json({ message: 'GET request successful' });
});

export default handler;
