import React, { useEffect } from "react"
import styled, { css } from 'styled-components'

import { XIcon  } from '@primer/octicons-react'

const StyledOverlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  background-color: rgba(255,255,255,0.25);
  backdrop-filter: blur(3px);
  display: flex;
  justify-content: center;
  align-items: center;
`
const StyledDialog = styled.aside`
  position: fixed;
  z-index: 1000;
  top: 50%;
  left: 50%;
  padding: var(--padding-viewport);
  background-color: var(--color-white);
  border: var(--border-divider);
  border-radius: calc(2 * var(--border-radius));
  box-shadow: 0 0.25em 0.75em -0.25em rgba(0,0,0,0.3);
  width: 80vw;
  max-width: 20em;
  transform: translate3d(-50%,-50%,0);
  outline: none;
`

const Dialog = ({ isOpen, setIsOpen, children }) => {

  const close = () => {
    setIsOpen(false)
  }

  return (
    <>
      {isOpen && (
        <>
          <StyledOverlay onClick={close} />
          <StyledDialog tabIndex={-1} role="dialog" aria-model="true">
            <StyledDialogClose type="button" onClick={close}><XIcon /></StyledDialogClose>
            {children}
          </StyledDialog>
        </>
      )}
    </>
  )
}

const StyledDialogClose = styled.button`
  position: absolute;
  z-index: 10;
  top: 1.5em;
  right: 1.5em;
`


const DialogHeader = ( props ) => {

  return (
    <StyledDialogHeader>
      {props.children}
    </StyledDialogHeader>
  )
}

const StyledDialogHeader = styled.h3`
  font-size: 1em;
  margin: 0;
  margin-bottom: 1.5em;
`


export default Object.assign(Dialog, {
  Header: DialogHeader,
})