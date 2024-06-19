import styled, { css } from 'styled-components'

import { CheckIcon  } from '@primer/octicons-react'

const StyledCheckbox = styled.span`
  position: relative;
  z-index: 2;
  height: 1em;
  width: 1em;
  border: var(--border);
  border-radius: calc(1.5 * var(--border-radius));
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-white);
  cursor: pointer;
  background-color: var(--color-white);
  user-select: none;
  svg {
    width: 0.75em;
    height: 0.75em;
  }

  .can-hover &:hover:not(:focus) {
    box-shadow: 0 0 0 calc(2* var(--border-width)) var(--color-primary-outline);
  }
  ${props => props.checked && css`
    color: var(--color-primary);
    box-shadow: 0 0 0 calc(2* var(--border-width)) var(--color-primary-outline);
    border-color: var(--color-primary);
  `}
  & + span {
    margin-left: 0.5em;
  }
`

function Checkbox( props ) {
  return (
    <StyledCheckbox {...props}>{props.checked && <CheckIcon />}</StyledCheckbox>
  )
}
export default Checkbox