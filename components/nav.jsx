import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCurrentUser } from '@/hooks/index'
import styled from 'styled-components'

import { ButtonText } from '@/components/Button/index'
import Dropdown from '@/components/ui/Dropdown'

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

  function activeClassName( slug ) {
    return (
      router.asPath === `/${slug}` ? 'is-active' : undefined
    )
  }

  return (
    <StyledNav>
      <Link href="/">
        <StyledNavLogo>Contacts</StyledNavLogo>
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
              <a className={activeClassName('contacts')}>Contacts</a>
            </Link>
          </StyledNavLinks>
          <StyledNavUser>
            <Dropdown>
              <ButtonText as="summary"><span>Account</span><Dropdown.Caret /></ButtonText>
              <Dropdown.Menu direction="sw">
                <Dropdown.Item> 
                  <Link href="/account"><a>Settings</a></Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <a role="button" onClick={handleLogout}>Sign out</a>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
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
  border-bottom: var(--border-divider);
  height: var(--height-nav);
  padding: 0 var(--padding-viewport);
`

const StyledNavLogo = styled.a`
  font-size: 0.875em;
  line-height: 1;
  margin: 0;
  text-indent: -999em;
  display: block;
  height: 2.75em;
  width: 2.75em;
  background-color: var(--color-primary);
  margin-right: 3em;
  border-radius: calc(3* var(--border-radius));
`
const StyledNavLinks = styled.div`
  display: flex;
  align-items: center;
  a {
    display: block;
    padding: 0.375em 0.875em;
    font-size: 0.9375em;
    font-weight: 500;
    letter-spacing: 0.0125em;
    border-radius: calc(3 * var(--border-radius));
    .can-hover &:hover,
    &:active,
    &:focus,
    &.is-active {
      background-color: var(--color-off-white);
    }
    &.is-active {
      font-weight: 700;
    }
    &:not(:last-of-type) {
      margin-right: 1em;
    }
  }
`
const StyledNavUser = styled.div`
  margin-left: auto;
`