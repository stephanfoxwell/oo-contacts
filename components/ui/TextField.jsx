import React from 'react'
import styled, {css} from 'styled-components'

function TextField( props ) {
  return (
    <StyledTextField
      as={props?.as || 'input'}
      type={props?.type || 'text'}
      {...props}
    />
  )
}

export default TextField

const StyledTextField = styled.input`
  display: block;
  padding: 0.5625em 0.75em;
  padding: 0.625em 0.75em;
  border: var(--border);
  border-radius: calc(2*var(--border-radius));
  border-radius: calc(4 * var(--border-radius));
  background-color: var(--color-white);
  border: var(--border-width) solid rgba(0,0,0,0.09375);
  ${props => props.theme === 'solid' && css`
    background-color: var(--color-off-white);
    border: 0;
  `}
  resize: vertical;
  .can-hover &:hover:not(:focus) {
    box-shadow: 0 0 0 calc(2* var(--border-width)) var(--color-primary-outline);
  }
  &:focus {
    box-shadow: 0 0 0 var(--border-width) var(--color-primary), 0 0 0 calc(4* var(--border-width)) var(--color-primary-outline);
    border-color: var(--color-border-dark);
  }
  .can-hover &:hover {
    border-color: var(--color-border-dark);
  }
  &::-webkit-inner-spin-button, 
  &::-webkit-outer-spin-button { 
    -webkit-appearance: none; 
    margin: 0; 
  }
  &::-webkit-contacts-auto-fill-button {
    visibility: hidden;
    display: none !important;
    pointer-events: none;
    position: absolute;
    right: 0;
  }
`