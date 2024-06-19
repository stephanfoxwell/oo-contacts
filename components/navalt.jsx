import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCurrentUser } from '@/hooks/index'
import styled from 'styled-components'
import { ButtonText, ButtonPrimary } from '@/components/Button/index'
import {BookIcon, SignInIcon, GearIcon} from '@primer/octicons-react'

function Nav() {
  const [user, { mutate }] = useCurrentUser()
  const router = useRouter()
  
  const handleLogout = async () => {
    await fetch('/api/auth', {
      method: 'DELETE',
    });
    mutate(null);
    router.push('/login');
  };

  function isActiveLink( slug ) {
    return (
      router.asPath === `/${slug}` ? true : false
    )
  }

  return (
    <StyledNav>
      <Link href="/">
        <StyledNavLogo></StyledNavLogo>
      </Link>
      {!user ? (
        <StyledNavUser>
          <Link href="/login">
            <a>Login</a>
          </Link>
        </StyledNavUser>
      ) : (
        <>
          <StyledNavLinks>
            <Link href="/contacts">
              {isActiveLink('contacts') ? (
                <ButtonPrimary as="a"><BookIcon /></ButtonPrimary>
              ) : (
                <ButtonText as="a"><BookIcon /></ButtonText>
              )}
            </Link>
            {/*<ButtonText as="a"><CommentIcon /></ButtonText>*/}
          </StyledNavLinks>
          <StyledNavUser>
              
            <Link href="/account">
              {isActiveLink('account') ? (
                <ButtonPrimary as="a"><GearIcon /></ButtonPrimary>
              ) : (
                <ButtonText as="a"><GearIcon /></ButtonText>
              )}
            </Link>
            <ButtonText as="a" role="button" onClick={handleLogout}><SignInIcon /></ButtonText>
          </StyledNavUser>
        </>
      )}
    </StyledNav>
  )
}

export default Nav


const StyledNav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  background-color: var(--color-white);
  height: var(--height-nav);
  padding: 0 var(--padding-viewport);

  height: 100vh;
  flex-direction: column;
  border-right: var(--border-divider);
  border-right: 0;
  padding: var(--padding-viewport) 1em;
`

const StyledNavLogo = styled.a`
  font-size: 0.875em;
  line-height: 1;
  margin: 0;
  display: grid;
  place-items: center;
  height: 2.5em;
  width: 2.5em;
  background-color: var(--color-primary);
  margin-right: 3em;
  color: var(--color-white);
  margin: 0 0 5em;
`
const StyledNavLinks = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  a {
    margin-bottom: 2em;
  }
`
const StyledNavUser = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: auto;
  a {
    margin-top: 1em;
  }
`