// pages/login.js
import { useState, useEffect } from 'react';

import { useRouter } from 'next/router';

import { directus } from '../middlewares/directusClient';

export default function Login() {

  const router = useRouter();

  const [email, setEmail] = useState('stephan@theoutlawocean.com');
  const [password, setPassword] = useState('rrzDwYQNmp');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [userToken, setUserToken] = useState(null);

  const handleLogin = async () => {

    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, otp })
    });

    if (response.ok) {
      // Handle successful login
      console.log('Login successful');
      const result = await response.json();
      console.log(result)
      setIsAuthenticated(true);
      setUserToken(result.access_token);
      router.push('/contacts');
    } else {
      const errorData = await response.json();
      setError(errorData.message);
      setIsAuthenticated(false);
    }
  };

  const testIsAuthenticated = async () => {
    const response = await fetch('/api/auth/me', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    })

    if (response.ok) {
      // Handle successful login
      const result = await response.json();
      console.log(result);
      setIsAuthenticated(true);
    }
    else {
      const errorData = await response.json();
      console.log(errorData);
    }
  };

  useEffect(() => {
    testIsAuthenticated();
  },[])


  if ( isAuthenticated ) {
    return (
      <div>
        {userToken && <p>Token: {userToken}</p>}
        <h1>Logged in</h1>
        <button onClick={() => setIsAuthenticated(false)}>Logout</button>
      </div>
    )
  }
  else {
    return (
      <div>
        <h1>Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="text"
          placeholder="OTP Code"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        {error && <p>{error}</p>}
      </div>
    );
  }
}
