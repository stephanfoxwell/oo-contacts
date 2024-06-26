import React from 'react'
import styled, {css} from 'styled-components'

function TextField( props ) {

  const defaultProps = {
    hasBorder: true,
    hasBorderRadiusTopLeft: true,
    hasBorderRadiusTopRight: true,
    hasBorderRadiusBottomLeft: true,
    hasBorderRadiusBottomRight: true,
    theme: 'default',
    type: 'text',
  };

  props = {...defaultProps, ...props};
  
  function getClassName() {
    const classNames = [];
    if ( props?.hasBorder ) {
      classNames.push('has-border')
    }
    if ( props?.theme === 'solid' ) {
      classNames.push('is-solid')
    }
    if ( props?.hasBorderRadiusTopLeft ) {
      classNames.push('has-border-radius-top-left')
    }
    if ( props?.hasBorderRadiusTopRight ) {
      classNames.push('has-border-radius-top-right')
    }
    if ( props?.hasBorderRadiusBottomLeft ) {
      classNames.push('has-border-radius-bottom-left')
    }
    if ( props?.hasBorderRadiusBottomRight ) {
      classNames.push('has-border-radius-bottom-right')
    }

    return classNames.join(' ');
  }

  return (
    <StyledTextField
      as={props?.as || 'input'}
      type={props?.type || 'text'}
      className={getClassName()}
      {...props}
    />
  )
}

export default TextField

const StyledTextField = styled.input`
  display: block;
  padding: 0.5625em 0.75em;
  padding: 0.625em 0.75em;
  border: 0;
  border-radius: 0;
  background-color: var(--color-white);
  &.has-border-radius-top-left {
    border-top-left-radius: calc(4 * var(--border-radius));
  }
  &.has-border-radius-top-right {
    border-top-right-radius: calc(4 * var(--border-radius));
  }
  &.has-border-radius-bottom-left {
    border-bottom-left-radius: calc(4 * var(--border-radius));
  }
  &.has-border-radius-bottom-right {
    border-bottom-right-radius: calc(4 * var(--border-radius));
  }
  &.has-border {
    border: var(--border);
    border: var(--border-width) solid rgba(0,0,0,0.09375);
  }
  &.is-solid {
    background-color: var(--color-off-white);
    border: 0;
  }
  /*${props => props.theme === 'solid' && css`
    background-color: var(--color-off-white);
    border: 0;
  `}*/
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