import React, { useState, useEffect } from "react";
import styled from "styled-components";
//import { useQuery, useQueryClient, useMutation } from "react-query";
import { useContactsWorkspace } from "./ContactsWorkspaceContext";

import FieldLabel from "../ui/FieldLabel";
import TextField from "../ui/TextField";
import Checkbox from "../ui/Checkbox";
import Button from "../Button/Button";
import ButtonDanger from "../Button/ButtonDanger";
import ButtonPrimary from "../Button/ButtonPrimary";
import ButtonText from "../Button/ButtonText";

import { PlusCircleIcon, XIcon, PlusIcon, LinkExternalIcon, CopyIcon, PencilIcon, EyeIcon } from '@primer/octicons-react';

import ReactMarkdown from 'react-markdown';
import Tag from "../ui/Tag";

import ContactDetails from "./ContactDetails";
import ContactsEditor from "./ContactsEditor";


function ContactsInspector() {

  const {
    inspectedContact,
    setInspectedContact,
    fields,
    setPageStatus,
    tags,
    inspectedContacts,
    toggleInspectedContacts
  } = useContactsWorkspace();

  useEffect(() => {
    //console.log(inspectedContact)
  },[inspectedContact]);

  const [mode, setMode] = useState('view');
  
  const [selectedInspectedContact, setSelectedInspectedContact] = useState();

  const currentInspectedContactIndex = inspectedContacts.findIndex((contact) => contact.id === inspectedContact.id);
  
  return (
    <StyledContactInspector>
        <StyledContactsInspectorNav>
          <div></div>
      {/*inspectedContacts.length > 0 && (
        <>
          <Button onClick={() => setInspectedContact(inspectedContacts[currentInspectedContactIndex - 1])}>Previous</Button>
          <Button onClick={() => setInspectedContact(inspectedContacts[currentInspectedContactIndex + 1])}>Next</Button>
        </>

      )*/}
        {inspectedContact && (
          <Button onClick={() => setMode(mode === 'view' ? 'edit' : 'view')}>{mode === 'view' ? 'Edit' : 'View'}</Button>
        )}
        </StyledContactsInspectorNav>
      <StyledContactInspectorCard>
        <div>
          {inspectedContact ? (
            <>
              {mode === 'view' ? (
                <ContactDetails setMode={setMode} />
              ) : (
                <ContactsEditor setMode={setMode} />
              )}
            </>
          ) : (
            <ContactsEditor />
          )}
        </div>
      </StyledContactInspectorCard>
    </StyledContactInspector>
  );
}

export default ContactsInspector;

const StyledContactsInspectorNav = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledContactInspectorCard = styled.div`
  position: relative;
  z-index: 1;
  background-color: var(--color-white);
  padding: 1.5em;
  border-radius: calc( 8 * var(--border-radius) );
  height: 100%;
  border: var(--border-divider);
  > div {
    position: absolute;
    top: 0;
    right: 0.5em;
    bottom: 0;
    left: 0.5em;
    padding: 1.5em 1em;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
    &::-webkit-scrollbar {
      width: 0.375em;
      height: 0.375em;
    }
    &::-webkit-scrollbar-track {
      width: 0.375em;
      height: 0.375em;
      background-color: #eee;
      border: solid #fff;
      border-width: 0 0.0625em;
      border-radius: 0.375em;
    }
    &::-webkit-scrollbar-thumb {
      height: 0.375em;
      width: 0.375em;
      background: #ddd;
      box-shadow: 0 0 0 1px #fff;
      border-radius: 0.375em;
    }
  }
`;

const StyledContactInspector = styled.div`
  position: relative;
  height: 100vh;
  padding: 1em 1.5em 1.5em;
  background-color: var(--color-off-white);
  display: grid;
  grid-template: auto 1fr / 1fr;
  gap: 1em;
  .toolbar {
    position: sticky;
    top: 0;
    z-index: 5;
    background-color: var(--color-off-white);
    border-bottom: var(--border-divider);
    padding: 1em 0;
  }
`;
