import React, { useState, useEffect, useRef } from "react"
import styled, { css } from 'styled-components'
import Button from "../Button/Button"
import { TriangleDownIcon } from '@primer/octicons-react'

const StyledDetails = styled.details`
  position: relative;
  user-select: none;
  display: inline-block;
  &[open] {
    z-index: 10;
  }
  summary {
    outline: none;
    &::-webkit-details-marker {
      display: none;
    }
  }
`

const Dropdown = props => {
  const [opened, setOpened] = useState(false)
  const handleToggleOpen = (e) => {
    e.preventDefault()
    setOpened( ! opened )
  } 
  
  const detailsRef = useRef()

  const handleOuterClick = (e) => {
    if ( detailsRef.current && ! detailsRef.current.contains( e.target ) ) {
      setOpened( undefined )
    }
    else if ( opened && detailsRef.current && ! detailsRef.current.contains( e.target ) ) {
      setOpened( undefined )
    }
    else if ( opened && detailsRef.current && detailsRef.current.contains( e.target ) ) {
      if ( e.target.nodeName === 'SUMMARY' || e.target.parentNode.nodeName === 'SUMMARY' ) {
      }
      else if ( opened ) {
        setOpened( undefined )
      }
    }
    else {
      e.preventDefault()
      setOpened( true )
    }
  }
  useEffect(() => {
    console.log(opened)
  }, [opened])

  useEffect(() => {
    document.body.addEventListener('click',handleOuterClick, false)
    return () => {
      document.body.removeEventListener( 'click', handleOuterClick, false )
    }
  },[opened])

  return (
    <StyledDetails
      {...props}
      ref={detailsRef}
      open={opened ? true : undefined}
    >
      {props.children}
    </StyledDetails>
  )
}

const DropdownButton = ( props ) => {

  return (
    <Button 
      as="summary" 
      aria-haspopup="true" 
      {...props}
    >
      <span>{props.children}</span>
      <DropdownCaret />
    </Button>
  )
}

const DropdownCaret = () => (
  <TriangleDownIcon />
)

const DropdownMenu = styled.ul`
  position: absolute;
  z-index: 2;
  background-color: var(--color-white);
  border: var(--border-divider);
  box-shadow: 0 0.25em 0.75em -0.375em rgba(0,0,0,0.3);
  border-radius: calc(3*var(--border-radius));
  padding: 0.25em;
  margin: 0.5em 0;
  list-style: none;
  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    height: 0.75em;
    width: 0.75em;
    background-color: inherit;
    border: inherit;
    border-radius: var(--border-radius);
    transform: rotate(45deg);
  }
  &::after {
    content: '';
    position: absolute;
    z-index: -1;
    width: 1.5em;
    height: 0.625em;
    background-color: inherit;
  }
  ${props => props.direction === 'sw' && css`
    top: 100%;
    right: 0;
    &::before {
      top: -0.375em;
      right: 0.75em;
    }
    &::after {
      top: 0;
      right: 0.5em;
    }
  `}
  ${props => props.direction === 'ne' && css`
    bottom: 100%;
    left: 0;
    &::before {
      bottom: -0.375em;
      left: 0.75em;
    }
    &::after {
      bottom: 0;
      left: 0.5em;
    }
  `}
  ${props => ( ! props.direction || props.direction === 'se' ) && css`
    top: 100%;
    left: 0;
    &::before {
      top: -0.375em;
      left: 0.75em;
    }
    &::after {
      top: 0;
      left: 0.5em;
    }
  `}
`

const DropdownItem = styled.li`
  > * {
    display: block;
    font-size: 0.875em;
    line-height: 1.3;
    padding: 0.375em 0.75em;
    border-radius: var(--border-radius-button);
    white-space: nowrap;
    cursor: pointer;
    &:hover,
    &.is-active {
      background-color: var(--color-primary);
      color: var(--color-white);
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
  }
`


export default Object.assign(Dropdown, {
  Caret: DropdownCaret,
  Menu: DropdownMenu,
  Item: DropdownItem,
  Button: DropdownButton
})