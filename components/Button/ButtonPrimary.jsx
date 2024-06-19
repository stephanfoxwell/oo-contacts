import styled from 'styled-components'
import ButtonBase from './ButtonBase'

const ButtonPrimary = styled(ButtonBase)`
  background-color: var(--color-primary);
  color: var(--color-white);
  .can-hover &:hover,
  &:active,
  &:focus {
    color: var(--color-white);
  }
`

export default ButtonPrimary