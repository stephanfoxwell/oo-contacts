import { CopyIcon } from '@primer/octicons-react';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const CopyToClipboard = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      // Using the Clipboard API to copy the text
      await navigator.clipboard.writeText(text);
      setCopied(true);
      // Automatically hide the notification after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <StyledPermalink>
      <button type="button" title="Copy to clipboard" onClick={(e) => handleClick(e)}>
        <CopyIcon />
      </button>
      {/* Conditionally rendering the notification based on the copied state */}
      {copied && <span>Copied to clipboard</span>}
    </StyledPermalink>
  );
};

export default CopyToClipboard;

const StyledPermalink = styled.div`
  position: relative;
  display: block;
  a {
    transition: opacity 0.2s ease;
    opacity: 0.4;
    display: block;
    .can-hover &:hover,
    &:active {
      opacity: 1;
    }
  }
  span {
    position: absolute;
    bottom: 100%;
    background-color: var(--color-white);
    color: var(--color-black);
    padding: 0.25em 0.5em;
    border-radius: 0.25em;
    font-size: 0.75em;
    font-family: var(--font-sans);
    font-weight: 500;
    white-space: nowrap;
    /*left: 50%;
    transform: translate3d(-50%, -0.5em, 0);*/
    box-shadow: 0 0.125em 0.25em rgba(0,0,0,0.1);
    left: 0;
    transform: translate3d(0, -0.5em, 0);
  }
`;