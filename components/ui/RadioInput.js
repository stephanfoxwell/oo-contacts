import React from 'react';
import styled from 'styled-components';

function RadioInput({ label, value, name, options, currentValue, onChange }) {
  return (
    <StyledRadioInput>
      <input
        type="radio"
        name={name}
        value={value}
        checked={currentValue === value}
        onChange={(e) => onChange(e)}
      />
      <span></span>
      <span>{label}</span>
    </StyledRadioInput>
  );
};
export default RadioInput;

const StyledRadioInput = styled.label`
  display: inline-flex;
  gap: 0.25em;
  text-transform: capitalize;
  width: auto;
  input {
    display: none;
  }
  input:checked + span {
    &::after {
      opacity: 1;
    }
  }
  span:first-of-type {
    display: block;
    height: 1.25em;
    width: 1.25em;
    border-radius: 50%;
    background-color: white;
    border: var(--border);
    text-align: center;
    cursor: pointer;
    display: grid;
    place-items: center;
    &::after {
      content: "";
      display: block;
      width: calc(100% - 0.5em);
      height: calc(100% - 0.5em);
      background-color: var(--color-primary);
      border-radius: inherit;
      opacity: 0;
    }
  }
  span:last-of-type {
    font-size: 0.875em;
    font-weight: 500;
  }
`