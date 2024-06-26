// pages/api/auth/me.js
import nextConnect from 'next-connect';
import { getCookie } from 'cookies-next';
import all from '../../../middlewares/all';

const handler = nextConnect();

handler.use(all);

handler.get(async (req, res) => {

  //try {
    // Access the cookie from the request
    const token = getCookie('access_token', { req, res });

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    

    const response = await fetch('https://oo.directus.app/users/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const data = await response.json();

    //console.log("auth/me", data);

    res.status(200).json(data.data);
  /*} catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }*/


});

export default handler;
