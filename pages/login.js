// pages/login.js
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { ButtonPrimary, ButtonText } from '../components/Button/index'
import TextField from '../components/ui/TextField'

import { directus } from '../middlewares/directusClient';

const Login = () => {

  const router = useRouter();
  const [error, setError] = useState(undefined);

  async function handleSubmit(e) {
    e.preventDefault();
    const body = {
      email: e.currentTarget.email.value,
      password: e.currentTarget.password.value,
      otp: e.currentTarget.otp.value
    };
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.status === 200) {
      router.push('/contacts');
    } else {
      setError('Incorrect username or password. Please try again.');
    }
  }

  return (
    <StyledLoginWrap>
      <StyledLogin>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <TextField
            id="email"
            type="email"
            name="email"
            autoFocus="true"
            value="stephan@theoutlawocean.com"
          />
          <label htmlFor="password">Password</label>
          <TextField
            id="password"
            type="password"
            name="password"
            value="rrzDwYQNmp"
          />
          <label htmlFor="otp">Two-Factor Verification Code</label>
          <TextField
            id="otp"
            type="text"
            name="otp"
          />
          <ButtonPrimary type="submit">Sign in</ButtonPrimary>
          {error && <p>{error}</p>}
          <ButtonText as={Link} href="/forget-password">Forgot password</ButtonText>
        </form>
      </StyledLogin>
    </StyledLoginWrap>
  );
};

export default Login;


const StyledLoginWrap = styled.div`
  min-height: calc(100vh - var(--height-nav));
  display: flex;
  align-items: center;
  justify-content: center;
`
const StyledLogin = styled.div`
  position: relative;
  max-width: 16em;
  width: 100%;
  label {
    font-size: 0.875em;
    font-weight: 500;
    margin: 1em 0 0.25em;
  }
  button {
    margin: 1em 0;
  }
  a {
    font-size: 0.75em;
    &:hover {
      text-decoration: underline;
    }
  }
  button {
    margin-right: 1em;
  }
`
