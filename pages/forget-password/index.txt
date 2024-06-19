import React, { useState } from 'react';
import Head from 'next/head';
import styled from 'styled-components';

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
`

const ForgetPasswordPage = () => {
  const [msg, setMsg] = useState({ message: '', isError: false });

  async function handleSubmit(e) {
    e.preventDefault(e);

    const body = {
      email: e.currentTarget.email.value,
    };

    const res = await fetch('/api/user/password/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.status === 200) {
      setMsg({ message: 'An email has been sent to your mailbox' });
    } else {
      setMsg({ message: await res.text(), isError: true });
    }
  }

  return (
    <StyledLoginWrap>
      <Head>
        <title>Forgot password</title>
      </Head>
      <StyledLogin>
        <h2>Forgot password</h2>
        {msg.message ? <p style={{ color: msg.isError ? 'red' : '#0070f3', textAlign: 'center' }}>{msg.message}</p> : null}
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">
            <input
              id="email"
              type="email"
              placeholder="Email"
            />
          </label>
          <button type="submit">Submit</button>
        </form>
      </StyledLogin>
    </StyledLoginWrap>
  );
};

export default ForgetPasswordPage;
