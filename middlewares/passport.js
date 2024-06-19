// passport.js
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { directus, login, readMe, refresh } from './directusClient';

passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const response = await login(email, password);
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
      done(null, user);
    } catch (error) {
      console.log('Error during login:', error);
      done(error);
    }
  }
));

passport.serializeUser((user, done) => {
  console.log('Serializing user:', user);
  done(null, user.access_token);
});

passport.deserializeUser(async (token, done) => {
  console.log('Deserializing user:', token)
  try {
   //const result = await directus.request(refresh('json', token));
    //console.log(result);
    const me = await directus.request(readMe());
    done(null, me);
  } catch (error) {
    console.log('Error during deserialization:', error);
    done(error);
  }
});

export default passport;


/*import passport from 'passport';
import bcrypt from 'bcryptjs';
import { Strategy as LocalStrategy } from 'passport-local';
import { findUserById, findUserByEmail } from '@/db/index';

passport.serializeUser((user, done) => {
  done(null, user._id);
});

// passport#160
passport.deserializeUser((req, id, done) => {
  findUserById(req.db, id).then((user) => done(null, user), (err) => done(err));
});

passport.use(
  new LocalStrategy(
    { usernameField: 'email', passReqToCallback: true },
    async (req, email, password, done) => {
      const user = await findUserByEmail(req.db, email);
      if (user && (await bcrypt.compare(password, user.password))) done(null, user);
      else done(null, false, { message: 'Email or password is incorrect' });
    },
  ),
);

export default passport;*/
