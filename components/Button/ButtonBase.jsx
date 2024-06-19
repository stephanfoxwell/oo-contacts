import styled, { css } from 'styled-components'

const ButtonBase = styled.button`
  position: relative;
  display: inline-block;
  z-index: 1;
  vertical-align: middle;
  text-align: center;
  text-decoration: none;
  appearance: none;
  font-size: 0.875rem;
  font-family: inherit;
  font-weight: 500;
  background: none;
  white-space: nowrap;
  user-select: none;
  line-height: 1;
  padding: 0.5em 0.8125em;
  cursor: pointer;
  border: none;
  border-radius: var(--border-radius-button);
  margin: 0;
  &:disabled {
    opacity: 0.5;
    cursor: default;
    &::before {
      display: none;
    }
  }

  > svg:last-child:not(:first-child) {
    margin-left: 0.375em;
  }

  > svg:last-child {
    margin-right: -0.25em;
  }
  > svg:first-child {
    margin-left: -0.25em;
  }
  > svg:first-child:not(:last-child) {
    margin-right: 0.375em;
  }

  ${props => props.variant === 'tiny' && (css`
    font-size: 0.75em;
    font-weight: 500;
    padding: 0.25em 0.5em;
  `)}

  ${props => props.variant === 'small' && (css`
    font-size: 0.75em;
    font-weight: 500;
    padding: 0.5em 0.75em;
  `)}

`

export default ButtonBase