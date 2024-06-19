// directusClient.js
import { createDirectus, authentication, rest, readItems, readUser, readMe, refresh } from '@directus/sdk';

const directus = createDirectus('https://oo.directus.app').with(authentication()).with(rest({ credentials: 'include' }));

const login = async (email, password) => {
  try {
    const response = await directus.login(email, password, { mode: "json" });
    return response;
  } catch (error) {
    if (error.code === '2FA_REQUIRED') {
      return { requires2FA: true };
    }
    throw error;
  }
};

export { directus, readItems, login, readUser, readMe, refresh };
/*
const login = async (email, password) => {
  try {
    const response = await directus.login(email, password);;
    return response;
  } catch (error) {
    if (error.code === '2FA_REQUIRED') {
      return { requires2FA: true };
    }
    throw error;
  }
};

const verify2FA = async (token) => {
  try {
    const response = await directus.auth.login({ otp: token });
    return response;
  } catch (error) {
    throw new Error('2FA verification failed');
  }
};
*/
