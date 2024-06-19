import nextConnect from 'next-connect';
import passport from 'passport';
import session from 'express-session';


const all = nextConnect();

all.use(session({
  secret: process.env.SESSION_SECRET || 'hardcoded-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}))//.use(passport.initialize()).use(passport.session());

export default all;

/*import nc from 'next-connect';
import passport from 'middlewares/passport';
import database from './database';
import session from './session';

const all = nc();

all.use(database).use(session).use(passport.initialize()).use(passport.session());

export default all;*/
