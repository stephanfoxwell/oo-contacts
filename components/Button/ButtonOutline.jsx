import styled from 'styled-components'
import ButtonBase from './ButtonBase'

const ButtonOutline = styled(ButtonBase)`
  background-color: transparent;
  color: var(--color-primary);
  box-shadow: inset 0 0 0 var(--border-width) var(--color-border);
`

export default ButtonOutline