// pages/api/auth.js
import nextConnect from 'next-connect';
import all from '../../../middlewares/all';
import passport from '../../../middlewares/passport';
import { directus, login, readMe, refresh } from '../../../middlewares/directusClient';


const handler = nextConnect();

handler.use(all);

//handler.post(passport.authenticate('local'), (req, res) => {
handler.post(async (req, res) => {
  console.log(req.body)
  try {
    const response = await login(req.body.email, req.body.password, req.body.otp);
    if (response.requires2FA) {
      return done(null, false, { message: '2FA_REQUIRED' });
    }
    const userRequest = await directus.request(readMe());
    const user = {
      id: userRequest.id,
      first_name: userRequest.first_name,
      last_name: userRequest.last_name,
      email: userRequest.email,
      access_token: response.access_token,
      expires: response.expires,
      expires_at: response.expires_at,
      refresh_token: response.refresh_token,
    }
    
    const access_token = user.access_token;
    console.log("cookie set", access_token);
    const refresh_token = user.refresh_token;
    console.log("cookie set", refresh_token);


    res.setHeader('Set-Cookie', [
      `access_token=${access_token}; SameSite=Strict; Path=/; Max-Age=900`,
      `refresh_token=${refresh_token}; SameSite=Strict; Path=/; Max-Age=86400`
    ]);

    res.status(200).json({ message: 'Logged in successfully' });

    //console.log("cookie set", access_token);

    res.status(200).json( user );

  } catch (error) {
    console.log('Error during login:', error);
    done(error);
  }
  /*
  console.log("Passport authentication handler reached");
  if (req.authInfo && req.authInfo.message === '2FA_REQUIRED') {
    res.status(401).json({ message: '2FA_REQUIRED' });
  } else {
    //const { access_token } = req.user;

    //setTokenCookie(res, access_token);
    //setTokenCookie(res, req.user.refresh_token, 'refresh_token');

    const access_token = req.user.access_token;
    console.log("cookie set", access_token);
    const refresh_token = req.user.refresh_token;
    console.log("cookie set", refresh_token);


    res.setHeader('Set-Cookie', [
      `access_token=${access_token}; SameSite=Strict; Path=/; Max-Age=900`,
      `refresh_token=${refresh_token}; SameSite=Strict; Path=/; Max-Age=86400`
    ]);

    res.status(200).json({ message: 'Logged in successfully' });

    //console.log("cookie set", access_token);

    res.status(200).json( req.user );
  }
    */
});

handler.delete((req, res) => {
  req.logout((err) => {
    if (err) {
      res.status(500).json({ message: 'Logout failed' });
    } else {
      res.status(200).json({ message: 'Logged out' });
    }
  });
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
