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
    tags
  } = useContactsWorkspace();

  useEffect(() => {
    console.log(inspectedContact)
  },[inspectedContact]);

  const [mode, setMode] = useState('view');
  
  
  return (
    <StyledContactInspector>
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
    </StyledContactInspector>
  );
}

export default ContactsInspector;


const StyledContactInspector = styled.div`
  position: relative;
  .toolbar {
    position: sticky;
    top: 0;
    z-index: 5;
    background-color: var(--color-off-white);
    border-bottom: var(--border-divider);
    padding: 1em 0;
  }
`;
