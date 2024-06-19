import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { useContactsWorkspace, ContactsWorkspaceProvider } from './ContactsWorkspaceContext';
import { use } from 'passport';

import ContactsFilterBar from './ContactsFilterBar';
import ContactsInspector from './ContactsInspector';
import ContactsTags from './ContactsTags';

import Contacts from './Contacts';

function ContactsWorkspace() {

  return (
    <ContactsWorkspaceProvider>
      <ContactsWorkspaceContent />
    </ContactsWorkspaceProvider>
  );
};

export default ContactsWorkspace;

function ContactsWorkspaceContent() {

  const { filters, pageIndex, contacts, setContacts, setFilters, setPageIndex, tags, setTags } = useContactsWorkspace();

  const [loading, setLoading] = useState(false);

  /*
  const {
    data,
    error,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ['tags'], 
    queryFn: fetchTags
  });

  useEffect(() => {
    console.log(data);
    if ( isSuccess )
      setTags(data.data);
  }, [data]);*/

  useEffect(() => {
    console.log(tags)
  },[tags])

  //const { inspectedContact } = useWorkspace()

  const [inspectedContact, setInspectedContact] = useState(undefined)

  return (
    <StyledWorkspace className={inspectedContact ? 'has-inspector' : undefined}>
      <div className="content">
        <div className="tags">
          <ContactsTags />
        </div>
        <div className="contacts">
          <Contacts />
        </div>
      </div>
      <div className="contact-workspace">
        <div>
          <ContactsInspector />
        </div>
      </div>
    </StyledWorkspace>
  )
}

const StyledWorkspace = styled.div`
  position: relative;
  display: grid;
  grid-template: 1fr / 1fr 32em;
  height: 100vh;
  max-width: 100vw;
  gap: 2em;
  .content {
    position: relative;
    display: grid;
    height: calc(100vh - 2em);
    gap: 1.5em;
    //padding: 1.5em;
    grid-template: 1fr / 14em auto;
    width: 100%;
    max-width: 100%;
    .tags,
    .contacts {
      position: relative;
      height: calc(100vh - 0em);
      width: 100%;
      max-width: 100%;
    }
  }
  .contact-workspace {
    height: 100vh;
    width: 100%;
    position: relative;
    //padding: 1.5em;
    > div {
      position: relative;
      height: 100%;
      //box-shadow: 0 0 0.5em rgba(0,0,0,0.1), 0 0 0.125em 0 rgba(0,0,0,0.1);
      padding: 0 1.5em;
      //border-radius: calc(8 * var(--border-radius));
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      background-color: var(--color-off-white);
      border-left: var(--border-divider);
    }
  }
`