import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link'
import Head from 'next/head';
import { useCurrentUser } from '@/hooks/index';
import styled from 'styled-components';
import Button, {ButtonPrimary} from '@/components/Button/index'
import FieldLabel from '@/components/ui/FieldLabel'
import TextField from '@/components/ui/TextField'

const StyledEmpty = styled.div`
  min-height: calc(100vh - var(--height-nav));
  display: flex;
  align-items: center;
  justify-content: center;
`

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
  input + label {
    margin-top: 1.5em;
  }
`

const ProfileSection = () => {
  const [user, { mutate }] = useCurrentUser();
  const [isUpdating, setIsUpdating] = useState(false);
  const nameRef = useRef();
  const [msg, setMsg] = useState({ message: '', isError: false });

  useEffect(() => {
    nameRef.current.value = user.name;
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isUpdating) return;
    setIsUpdating(true);
    const formData = new FormData();
    formData.append('name', nameRef.current.value);
    const res = await fetch('/api/user', {
      method: 'PATCH',
      body: formData,
    });
    if (res.status === 200) {
      const userData = await res.json();
      mutate({
        user: {
          ...user,
          ...userData.user,
        },
      });
      setMsg({ message: 'Account updated' });
    } else {
      setMsg({ message: await res.text(), isError: true });
    }
    setIsUpdating(false);
  };

  const handleSubmitPasswordChange = async (e) => {
    e.preventDefault();
    const body = {
      oldPassword: e.currentTarget.oldPassword.value,
      newPassword: e.currentTarget.newPassword.value,
    };
    e.currentTarget.oldPassword.value = '';
    e.currentTarget.newPassword.value = '';

    const res = await fetch('/api/user/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.status === 200) {
      setMsg({ message: 'Password updated' });
    } else {
      setMsg({ message: await res.text(), isError: true });
    }
  };

  async function sendVerificationEmail() {
    const res = await fetch('/api/user/email/verify', {
      method: 'POST',
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
        <title>Account</title>
      </Head>
        <StyledLogin>
          {msg.message ? <p style={{ color: msg.isError ? 'red' : '#0070f3', textAlign: 'center' }}>{msg.message}</p> : null}
          <form onSubmit={handleSubmit}>
            {/*!user.emailVerified ? (
              <p>
                Your email has not been verify.
                {' '}
                {/* eslint-disable-next-line }
                  <a role="button" onClick={sendVerificationEmail}>
                    Send verification email
                  </a>
              </p>
            ) : null*/}
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <input
              required
              id="name"
              name="name"
              type="text"
              placeholder="Your name"
              ref={nameRef}
            />
            <Button disabled={isUpdating} type="submit">Save</Button>
          </form>
          <form onSubmit={handleSubmitPasswordChange}>
            <FieldLabel htmlFor="oldpassword">Old Password</FieldLabel>
            <input
              type="password"
              name="oldPassword"
              id="oldpassword"
              required
            />
            <FieldLabel htmlFor="newpassword">New Password</FieldLabel>
            <input
              type="password"
              name="newPassword"
              id="newpassword"
              required
            />
            <Button type="submit">Change Password</Button>
          </form>
        </StyledLogin>
    </StyledLoginWrap>
  );
};

const SettingPage = () => {
  const [user] = useCurrentUser();

  if (!user) {
    return (
      <StyledEmpty>
        <Link href="/login">
          <Button as="a">Sign in</Button>
        </Link>
      </StyledEmpty>
    );
  }
  return (
    <>
      <ProfileSection />
    </>
  );
};

export default SettingPage;
