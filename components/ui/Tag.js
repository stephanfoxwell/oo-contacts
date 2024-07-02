import { LockIcon } from "@primer/octicons-react";
import React from "react";
import styled from "styled-components";
import { useContactsWorkspace } from "../contacts/ContactsWorkspaceContext";

const Tag = ({ tagId, as = "li" }) => {
  
  const { tags } = useContactsWorkspace();
  

  const theTag = tags.find((tag) => tag.id === tagId);

  if (!theTag) {
    return null;
  }
  return (
    <StyledTag as={as} data-color={theTag.color ? theTag.color : undefined} style={{"--color": theTag.color ? theTag.color : undefined}}>
      {theTag.is_restricted && (
        <LockIcon />
      )}
      <span>{theTag.name}</span>
    </StyledTag>
  );
};

export default Tag;

const StyledTag = styled.li`
  padding: 0.375em 0.5em 0.3em;
  border-radius: 0.375em;
  background-color: #eee;
  font-size: 0.75em;
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0.0125em;
  z-index: 0;
  display: inline-flex;
  gap: 0.25em;
  align-items: center;
  box-shadow: 0 0 0 1px var(--color-white);
  span {
    color: #333;
  }
  &[data-color] {
    contain: paint;
    &::before {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      border-radius: inherit;
      background-color: var(--color);
      z-index: -1
    }
    span {
      color: white;
    }
  }
`;