import { CheckCircleFillIcon, CheckIcon, CopyIcon } from '@primer/octicons-react';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const CopyToClipboard = ({ children, text = undefined }) => {
  const [copied, setCopied] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      // Using the Clipboard API to copy the text
      await navigator.clipboard.writeText(text || children);
      setCopied(true);
      // Automatically hide the notification after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <StyledPermalink>
      <button className={copied ? 'is-copied': undefined} type="button" title={`Copy: “${text || children}”`} onClick={(e) => handleClick(e)}>
        <span>{children}</span>
      </button>
    </StyledPermalink>
  );
};

export default CopyToClipboard;

const StyledPermalink = styled.div`
  display: inline;
  button {
    display: inline;
    font-size: inherit;
    font-family: inherit;
    font-weight: inherit;
    background-color: var(--color-off-white);
    text-align: left;
    /*padding: 0.25em 0.5em;
    border-radius: calc(2 * var(--border-radius));*/
    border-bottom: 2px dotted rgba(0,0,0,0.25);
    &.is-copied {
      border-bottom-color: var(--color-primary);
    }
  }
`;