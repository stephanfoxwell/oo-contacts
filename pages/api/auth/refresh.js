// pages/api/auth.js
import nextConnect from 'next-connect';
import all from '../../../middlewares/all';
import passport from '../../../middlewares/passport';
import { getCookie } from 'cookies-next';
import { refresh } from '@directus/sdk';


const handler = nextConnect();

handler.use(all);

handler.get(async (req, res) => {

  const refresh_token = getCookie('refresh_token', { req, res });

  console.log(refresh_token)

  if (!refresh_token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const body = {
    refresh_token: refresh_token,
    mode: "json"
  };
  console.log(JSON.stringify(body));

  const response = await fetch('https://oo.directus.app/auth/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(body),
  })

  console.log(response)

  const data = await response.json();

  
  const new_access_token = data.data?.access_token;
  const new_refresh_token = data.data?.refresh_token;

  console.log(new_access_token);
  console.log(new_refresh_token);

  
  res.setHeader('Set-Cookie', [
    `access_token=${new_access_token}; SameSite=Strict; Path=/; Max-Age=900`,
    `refresh_token=${new_refresh_token}; SameSite=Strict; Path=/; Max-Age=86400`
  ]);
  
  
  
  res.status(200).json(data);
  
});


export default handler;


/*import nc from 'next-connect';
import { all } from '@/middlewares/index';
import passport from 'middlewares/passport';
import { extractUser } from '@/lib/api-helpers';

const handler = nc();

handler.use(all);

handler.post(passport.authenticate('local'), (req, res) => {
  res.json({ user: extractUser(req.user) });
});

handler.delete((req, res) => {
  req.logOut();
  res.status(204).end();
});

export default handler;*/
