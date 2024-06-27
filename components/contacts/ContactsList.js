import React, { useEffect, useRef, useState } from "react";
import { useContactsWorkspace } from "./ContactsWorkspaceContext";


import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import styled from "styled-components";
import Tag from "../ui/Tag";
import { LockIcon, EyeIcon } from "@primer/octicons-react";

import Button from "../Button/index";
import RadioInput from "../ui/RadioInput";


const ContactsList = ({ theRecords, setPageMeta, inspectedContact, setInspectedContact }) => {
  
  const { filters, setFilters } = useContactsWorkspace();

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      setCurrentUser(data);
    }
    getCurrentUser();
  }, []);

  const [sortField, setSortField] = useState('last_name');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {

    if ( ! sortField || ! sortDirection ) return;

    setFilters({ sort_field: sortField, sort_direction: sortDirection })

  }, [sortField, sortDirection]);

  const sortFields = {
    organization: [
      { label: 'Name', value: 'name' },
      {label: 'Date Created', value: 'date_created'},
      {label: 'Date Updated', value: 'date_updated'},
    ],
    individual: [
      {label: 'Last name', value: 'last_name'},
      {label: 'First name', value: 'first_name'},
      {label: 'Date Created', value: 'date_created'},
      {label: 'Date Updated', value: 'date_updated'},
    ]
  };

  useEffect(() => {
    if ( ! filters?.type ) return;
    if ( filters.type === 'organization' ) {
      setSortField('name');
    }
    else {
      setSortField('last_name');
    }
  }, [filters?.type])
  
  const contactListRef = useRef(null);

  useEffect(() => {
    if ( contactListRef.current ) {
      // smoothly scroll consactListRef to top
      contactListRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [filters, sortField, sortDirection, theRecords])
  return (
    <StyledContactsList>
      <div>
        <RadioInput
          label="People"
          name="type"
          value="individual"
          currentValue={filters?.type || 'individual'}
          onChange={(e) => setFilters({ type: e.target.value })}
        />
        <RadioInput
          label="Orgs"
          name="type"
          value="organization"
          currentValue={filters?.type || 'individual'}
          onChange={(e) => setFilters({ type: e.target.value })}
        />
        <select name="sort_field" value={sortField} onChange={(e) => setSortField(e.target.value) }>
          {sortFields[filters?.type || 'individual'].map(field => (
            <option key={field.value} value={field.value}>{field.label}</option>
          ))}
        </select>
        <select name="sort_direction" value={sortDirection} onChange={(e) => setSortDirection(e.target.value)} >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <StyledContactsListItems ref={contactListRef}>
        {theRecords.map(contact => (
          <li key={contact.id}>
            <ContactsListItem 
              contact={contact} 
              setInspectedContact={setInspectedContact} 
              currentUser={currentUser}
            />
          </li>
        ))}
      </StyledContactsListItems>
    </StyledContactsList>
  );
};

export default ContactsList;

const StyledContactsList = styled.div`
  // TODO: make this overflow, add visible scrollbar
  > div {
    position: sticky;
    top: 0;
    z-index: 1;
    height: 2em;
    border-bottom: var(--border-divider);
    background-color: white;
  }
`;

const StyledContactsListItems = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
  > li {
    position: relative;
    padding: 0.5em 0;
    &:not(:last-of-type)::after {
      content: "";
      position: absolute;
      right: 0.75em;
      left: 0.75em;
      bottom: 0;
      border-bottom: var(--border-divider);
    }
  }
`;


const ContactsListItem = ({ contact, currentUser }) => {

  const { filters, inspectedContact, setInspectedContact, tags, inspectedContacts, toggleInspectedContacts } = useContactsWorkspace();


  const doesContactHaveIsRestrictedTag = (contact) => {
    const restrictedTags = tags.filter( tag => tag.is_restricted );

    const matchedRestrictedTags = restrictedTags.filter( tag => contact.tags.find( t => t.contact_tags_id === tag.id ) );

    //const matchedRestrictedTags = contact.tags.filter( tag => restrictedTags.find( t => t.id === tag.contact_tags_id ) );

    //console.log("matchedRestrictedTags", matchedRestrictedTags)

    //console.log("restricted", matchedRestrictedTags)

    let isRestricted = false;

    matchedRestrictedTags.forEach( tag => {
      //console.log("tag user length", tag?.users?.length)
      if ( ! tag?.users?.length || tag?.users?.length === 0 ) {
        isRestricted = true;
      }
      else {
        tag?.users?.forEach( user => {
          if ( user.directus_users_id === currentUser.id ) {
            isRestricted = false;
          } 
        });
      }
    });

    return isRestricted;

    return contact?.tags?.some( tag => tags?.find( t => t.id === tag.contact_tags_id )?.is_restricted );
  }

  const isContactRestricted = doesContactHaveIsRestrictedTag(contact);

  function handleContactClick() {
    if ( ! isContactRestricted ) {
      toggleInspectedContacts(contact);
      if ( contact.id === inspectedContact?.id ) {
        setInspectedContact(false)
      }
      else {
        setInspectedContact(contact)
      }
    }
    //document.getElementById('notes').scrollTop = 0;
  }

  const details = []; 
  if ( contact.position ) details.push(contact.position);
  if ( contact?.organization?.name ) details.push(contact.organization.name);
  if ( contact.location ) details.push(contact.location);


  function getClassName() {
    if (isContactRestricted) {
      return "is-restricted";
    }
    if ( contact.id === inspectedContact?.id ) {
      return "is-selected";
    }
    return undefined;
  }

  function getTheName() {
    if (contact.type === "organization") {
      return contact.name || '';
    }
    const names = [];
    if ( filters?.sort_field === 'first_name' ) {
      if ( contact.first_name ) names.push(contact.first_name);
      if ( contact.last_name ) names.push(contact.last_name);
      return names.join(' ');
    }

    if ( contact.last_name ) names.push(contact.last_name);
    if ( contact.first_name ) names.push(contact.first_name);
    return names.join(', ');
  }

  return (
    <StyledContactsListItem className={getClassName()} onClick={handleContactClick}>
      <div>
        <strong>
          {getTheName()}
        </strong>
        <span>
          {details.join(', ')}
        </span>
      </div>
      <ul>
        {contact.tags && contact.tags.map(tag => (
          <Tag key={`${contact.id}-${tag.contact_tags_id}`} tagId={tag.contact_tags_id} />
        ))}
      </ul>
      <span className="action-icon">
      {! isContactRestricted ? <EyeIcon /> : <LockIcon />}
      </span>
    </StyledContactsListItem>
  );
};

const StyledContactsListItem = styled.div`
  position: relative;
  display: grid;
  grid-template: 1fr / 1fr 1fr auto;
  gap: 1em;
  width: 100%;
  align-items: center;
  padding: 1em 0;
  cursor: pointer;
  z-index: 0;
  padding: 0.5em 0.75em;
  &.is-selected {
    color: var(--color-primary);
  }
  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border-radius: calc(6 * var(--border-radius));
    background-color: var(--color-off-white);
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &::after {
    background-color: transparent;
    box-shadow: inset 0 0 0 2px var(--color-primary);
  }
  

  &.is-restricted {
    cursor: default;
    &::before,
    &::after {
      display: none;
    }
    > * {
      opacity: 0.5;
    }
  }
  > div:first-of-type {
    display: grid;
    strong {
      font-weight: 600;
      font-size: 0.875em;
      display: flex;
      gap: 0.5em;
      align-items: center;
      line-height: 1;
    }
    span {
      font-size: 0.75em;
      opacity: 0.7;
    }
  }

  ul {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.25em;
    padding: 0;
    margin: 0;
  }

  .action-icon {
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .can-hover &:hover,
  &:active,
  &.is-selected {
    &::before {
      opacity: 1;
    } 
    .action-icon {
      opacity: 1;
    }
  }
  &.is-selected {
    &::before {
      opacity: 0.7;
    }
    &::after {
      opacity: 0.5;
    }
  }
`;