import { getCookie, setCookie } from 'cookies-next';

const verifyAndRetrieveToken = async () => {

  const token = getCookie('access_token');

  if ( token ) {
    return token;
  }
  else {

    const refresh_token = getCookie('refresh_token');

    if ( ! refresh_token ) {
      return false;
    }

    const body = {
      refresh_token: refresh_token,
      mode: "json"
    };

    const response = await fetch('https://oo.directus.app/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(body),
    });

    const data = await response.json();

    const new_access_token = data.data?.access_token;
    const new_refresh_token = data.data?.refresh_token;

    if ( !new_access_token || !new_refresh_token ) {
      return false;
    }

    setCookie('access_token', new_access_token, { maxAge: 840, });

    setCookie('refresh_token', new_refresh_token, { maxAge: 21600, });
    
    return new_access_token;
  }

};

export default verifyAndRetrieveToken;