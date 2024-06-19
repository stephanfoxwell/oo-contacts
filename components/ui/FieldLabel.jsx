import React from 'react'
import styled from 'styled-components'

function FieldLabel( props ) {
  return (
    <StyledFieldLabel>{props.children}</StyledFieldLabel>
  )
}

export default FieldLabel

const StyledFieldLabel = styled.label`
  display: block;
  font-size: 0.875em;
  font-weight: 700;
  letter-spacing: 0.0125em;
  margin-bottom: 0.375em;
`