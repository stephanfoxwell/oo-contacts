import styled from 'styled-components'
import ButtonBase from './ButtonBase'

const Button = styled(ButtonBase)`
  background-color: rgba(0,0,0,0.01);
  color: var(--color-black);
  border: var(--border-width) solid rgba(0,0,0,0.09375);
`

export default Button