import styled from 'styled-components'
import ButtonBase from './ButtonBase'

const ButtonOutline = styled(ButtonBase)`
  background-color: transparent;
  font-weight: 500;
  box-shadow: inset 0 0 0 var(--border-width) currentColor;
`

export default ButtonOutline