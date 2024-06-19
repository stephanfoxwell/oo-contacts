import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCurrentUser } from '@/hooks/index';
import styled from 'styled-components';
import { ButtonPrimary, ButtonText } from '@/components/Button/index'
import TextField from '@/components/ui/TextField'


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


const LoginPage = () => {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');
  const [user, { mutate }] = useCurrentUser();
  useEffect(() => {
    // redirect to home if user is authenticated
    if (user) router.push('/contacts');
  }, [user]);

  async function onSubmit(e) {
    e.preventDefault();
    const body = {
      email: e.currentTarget.email.value,
      password: e.currentTarget.password.value,
    };
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.status === 200) {
      const userObj = await res.json();
      mutate(userObj);
    } else {
      setErrorMsg('Incorrect username or password. Try again!');
    }
  }

  return (
    <StyledLoginWrap>
      <Head>
        <title>Sign in</title>
      </Head>
      <StyledLogin>
        <form onSubmit={onSubmit}>
          {errorMsg ? <p style={{ color: 'red' }}>{errorMsg}</p> : null}
          <label htmlFor="email">
            <TextField
              id="email"
              type="email"
              name="email"
              placeholder="Email address"
              autoFocus="true"
            />
          </label>
          <label htmlFor="password">
            <TextField
              id="password"
              type="password"
              name="password"
              placeholder="Password"
            />
          </label>
          <ButtonPrimary type="submit">Sign in</ButtonPrimary>
          <Link href="/forget-password">
            <ButtonText as="a">Forgot password</ButtonText>
          </Link>
        </form>
      </StyledLogin>
    </StyledLoginWrap>
  );
};

export default LoginPage;
