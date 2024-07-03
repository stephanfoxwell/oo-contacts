import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { useQuery } from '@tanstack/react-query';

import { useContactsWorkspace, ContactsWorkspaceProvider } from './ContactsWorkspaceContext';
import { use } from 'passport';

import ContactsFilterBar from './ContactsFilterBar';
import ContactsInspector from './ContactsInspector';
import ContactsTags from './ContactsTags';

import Contacts from './Contacts';

import fetchContacts from '../../utils/fetchContactsAlt';
import ContactsActiveFilters from './ContactsActiveFilters';

import fetchTags from '../../utils/fetchTagsAlt';

function ContactsWorkspace() {

  return (
    <ContactsWorkspaceProvider>
      <ContactsWorkspaceContent />
    </ContactsWorkspaceProvider>
  );
};

export default ContactsWorkspace;

function ContactsWorkspaceContent() {

  const { filters, pageIndex, contacts, setContacts, setFilters, setPageIndex, tags, setTags, inspectedContact, inspectedContacts, setOrganizations } = useContactsWorkspace();

  useEffect(() => {
    console.log("inspected contacts", inspectedContacts);
  }, [inspectedContacts])

  const [loading, setLoading] = useState(false);

  const orgFilters = { type: 'organization', limit: -1, sort_field: 'name' };

  const { isSuccess, isLoading, isError, data, error } = useQuery({
    queryKey: ['organizations', { orgFilters }],
    queryFn: () => fetchContacts(orgFilters, 1, -1),
    keepPreviousData: true,
  });
  //const {isSuccess: allIsSuccess, data: allData } = useQuery(['contacts', { filters }], () => fetchContacts(filters, 1, 30000))

  useEffect(() => {
    if ( isSuccess ) {
      //console.log('organizations', data.data);
      setOrganizations(data.data)
    }
  }, [data]);


  const {
    data: tagsData,
    error: tagsError,
    isLoading: tagsIsLoading,
    isSuccess: tagsIsSuccess,
  } = useQuery({
    queryKey: ['tags'], 
    queryFn: fetchTags
  });

  useEffect(() => {
    if ( tagsIsSuccess ) {
      setTags(tagsData.data)
    }
  }, [tagsData]);

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
      <div className="active-filters">
        <ContactsActiveFilters />
      </div>
    </StyledWorkspace>
  )
}

const StyledWorkspace = styled.div`
  position: relative;
  display: grid;
  grid-template: 1fr auto / 1fr 32em;
  height: 100vh;
  max-width: 100vw;
  gap: 0 1.5em;
  .content {
    position: relative;
    display: grid;
    height: calc(100vh - 2em - 3em);
    gap: 1.5em;
    //padding: 1.5em;
    grid-template: 1fr / 14em auto;
    width: 100%;
    max-width: 100%;
    .tags,
    .contacts {
      position: relative;
      height: calc(100vh - 0em - 2.5em);
      width: 100%;
      max-width: 100%;
    }
  }
  .contact-workspace {
    height: calc(100vh - 2.5em);
    width: 100%;
    position: relative;
    //padding: 1.5em;
    /*> div {
      position: relative;
      height: 100%;
      //box-shadow: 0 0 0.5em rgba(0,0,0,0.1), 0 0 0.125em 0 rgba(0,0,0,0.1);
      padding: 0 1.5em;
      //border-radius: calc(8 * var(--border-radius));
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      background-color: var(--color-off-white);
      border-left: var(--border-divider);
    }*/
  }
  .active-filters {
    position: relative;
    display: flex;
    height: 2.5em;
    background-color: var(--color-primary);
    color: var(--color-white);
    grid-column: 1 / span 2;
    z-index: 10;
  }
`