import React, { useEffect } from 'react'
import Head from 'next/head';
import styled from 'styled-components'


function registerTouchables() {
  const touchables = document.querySelectorAll('button, button, a[href], label');
  let touchablesLength = touchables.length;


  while ( touchablesLength-- ) {
    touchables[touchablesLength].addEventListener('touchstart', () => {}, {passive: true});
    touchables[touchablesLength].addEventListener('touchend', () => {}, {passive: true});
  }
};

function adjustOutsideLinks() {
  const anchors = document.querySelectorAll('a[href]');
  let anchorsLength = anchors.length;


  while ( anchorsLength-- ) {
    if ( anchors[anchorsLength].hostname !== window.location.hostname ) {
      anchors[anchorsLength].target = '_blank';
      anchors[anchorsLength].rel = 'noopener noreferrer';
    }
  }
}

function setCanHover() {
  const canHover = !(matchMedia(`(hover: none)`).matches)
  if ( canHover ) {
    document.getElementsByTagName( 'html' )[0].classList.add(`can-hover`);
  }
  else {
    document.getElementsByTagName( 'html' )[0].classList.add(`no-hover`);
  }

}

const Layout = ({ children }) => {
  
  useEffect(() => {

    document.getElementsByTagName( 'html' )[0].classList.add(`js`);

    registerTouchables();
    adjustOutsideLinks();
    setCanHover();
  });

  return (
    <>
      <style jsx global>
        {`
          //#F9F7EA
          :root {
            --color-black: #262B26;
            --color-black: rgb(27,31,35);
            --color-white: #fff;
            --color-highlight: #515F44;
            --color-highlight: #448B79;
            --color-bg-light: #fff;
            --color-bg-medium: #f7f6f1;
            --color-border: #dedddc;
            --color-border-light: #efeeed;
            --color-border-dark: #ccc;
            --border-radius: 0.125em;
            --border-radius-button: calc(4*var(--border-radius));
            --color-text-gray: #aaa;
            --color-gray: #868686;
            --color-light-gray: #c6c6c6;
            --color-error: red;
            --color-success: green;
            --color-warning: orange;

            --color-white: #fff;
            --color-shaded: #f9f9f8;
            --color-off-white: #f6f6f4;
            --color-off-white: #f6f6f5;
            --color-primary-dark: #557558;
            --color-primary-medium: #EAF3EB;
            --color-important: #716b67;
            --color-default: #efeeea;
            --color-primary: #0366d6;
            --color-primary-outline: rgb(200,225,255);
            --color-caution: #D84E52;

            
            --padding-viewport: 1.5em;

            --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
            --font-mono: SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
            --border-width: 0.0625rem;
            --border: var(--border-width) solid var(--color-border);
            --border-medium: var(--border-width) solid rgba(4,4,4,0.2);
            --border-dark: var(--border-width) solid rgba(4,4,4,0.3);
            --border-divider: var(--border-width) solid var(--color-border-light);
            --height-nav: 4em;
            --height-nav: 0em;
            --height-titlebar: 3.75em;
            --height-metabar: 2.5em;
            --height-content: calc(100vh - var(--height-titlebar) );
            
          }
          /*
          .dark-theme {
            --color-white: #111;
            --color-black: #ddd;
            color: var(--color-black);
          }
          */
          html {
            box-sizing: border-box;
          }
          *,
          *::before,
          *::after {
            box-sizing: inherit;
          }
          a {
            text-decoration: none;
            cursor: pointer;
            color: inherit;
          }
          a:hover {
            color: inherit;
          }
          body {
            margin: 0;
            padding: 0;
            color: var(--color-black);
            font-family: var(--font-sans);
            font-size: 1em;
            line-height: 1.5;
            background-color: var(--color-white);
            -webkit-font-smoothing: antialiased;
          }
          h1, h2, h3, h4, h5, h6 {
            margin: 1em 0 0.5em;
          }
          hr {
            margin: 0.25em 0;
            width: 100%;
            height: 0;
            border: 0;
            border-top: var(--border-divider);
          }
          details,
          details > * {
            box-sizing: border-box;
          }
          summary {
            cursor: default;
          }
          label {
            display: flex;
            margin-bottom: 0.5rem;
            align-items: center;
            width: 100%;
            cursor: default;
          }
          input,
          textarea {
            font-family: inherit;
            font-size: 1em;
            margin: 0;
            display: block;
            box-shadow: none;
            box-sizing: border-box;
            width: 100%;
            color: #000;
            background-color: transparent;
            border: 1px solid var(--color-border-dark);
            border-radius: var(--border-radius);
            outline: 0px;
            padding: 0.5em 0.625em;
            font-size: 0.875em;
          }
          textarea {
            resize: vertical;
            line-height: 1.4;
          }
          input.small {
            font-family: var(--font-mono);
            font-size: 0.875em;
            height: 2.5em;
          }
          button {
            appearance: none;
            border: none;
            background: none;
            font-size: 0.75rem;
            font-family: inherit;
            color: currentColor;
            padding: 0;
            margin: 0;
            cursor: pointer;
          }
          /*@media ( min-width: 105em ) {
            html {
              font-size: 1.17em;
            }
          }*/
        `}
      </style>
      <Head>
        <title>OO Contacts</title>
        <meta key="viewport" name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      </Head>
      <StyledApp>
        {children}
      </StyledApp>
    </>
  );
};

export default Layout;

const StyledApp = styled.div`
  position: relative;
`