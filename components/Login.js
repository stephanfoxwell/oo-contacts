// components/Login.js
import { useState } from 'react';
import { login, verify2FA } from '../middlewares/directusClient';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [requires2FA, setRequires2FA] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      const response = await login(email, password);
      if (response.requires2FA) {
        setRequires2FA(true);
      } else {
        onLoginSuccess();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVerify2FA = async () => {
    try {
      await verify2FA(otp);
      onLoginSuccess();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
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
      {requires2FA && (
        <input
          type="text"
          placeholder="2FA Token"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
      )}
      <button onClick={requires2FA ? handleVerify2FA : handleLogin}>
        {requires2FA ? 'Verify 2FA' : 'Login'}
      </button>
      {error && <div>{error}</div>}
    </div>
  );
}
