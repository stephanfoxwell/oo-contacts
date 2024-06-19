import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Router from 'next/router'
import styled from 'styled-components'
import { useCurrentUser } from '@/hooks/index'

import FieldLabel from '@/components/ui/FieldLabel'
import TextField from '@/components/ui/TextField'
import { ButtonPrimary } from '@/components/Button/index'

const fields = [
  {
    name: 'team',
    label: 'Team or account name',
    type: 'string',
  },
  {
    name: 'name',
    label: 'Name',
    type: 'string',
  },
  {
    name: 'email',
    label: 'Email',
    type: 'string',
    format: 'email'
  },
  {
    name: 'password',
    label: 'Password',
    type: 'string',
    format: 'password'
  },
]

const SignupPage = () => {
  const [user, { mutate }] = useCurrentUser();
  const [errorMsg, setErrorMsg] = useState('');
  useEffect(() => {
    // redirect to home if user is authenticated
    if (user) Router.replace('/');
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      email: e.currentTarget.email.value,
      name: e.currentTarget.name.value,
      password: e.currentTarget.password.value,
    };
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.status === 201) {
      const userObj = await res.json();
      mutate(userObj);
    } else {
      setErrorMsg(await res.text());
    }
  };

  return (
    <>
      <Head>
        <title>Sign up</title>
      </Head>
      <div>
       {/*
        <h2>Sign up</h2>
        <StyledForm onSubmit={handleSubmit}>
          {errorMsg ? <p style={{ color: 'red' }}>{errorMsg}</p> : null}
          {fields?.map(( field ) => (
            <div className={field?.display === 'half' ? 'half' : 'full'}>
              <FieldLabel htmlFor={`form-${field.name}`}>{field.label}</FieldLabel>
              <TextField
                id={`form-${field.name}`}
                as={field.type === 'text' ? 'textarea' : 'input'}
                name={field.name}
                type={field.format || 'text'}
                rows={field.rows ? field.rows : undefined}
                theme="solid"
              />
            </div>
          ))}
          <div>
            <ButtonPrimary type="submit">Create account</ButtonPrimary>
          </div>
        </StyledForm>
          */}
      </div>
      
    </>
  )
}

export default SignupPage

const StyledForm = styled.form`
  position: relative;
  display: grid;
  grid-template: auto / 1fr 1fr;
  grid-gap: 1em;
  max-width: 20em;
  margin: 0 auto;
  > div {
    grid-column: auto / span 2;
    &.half {
      grid-column: auto / span 1;
    }
  }
`
