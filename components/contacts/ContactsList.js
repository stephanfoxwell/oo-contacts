import React, { useEffect, useRef, useState } from "react";
import { useContactsWorkspace } from "./ContactsWorkspaceContext";


import styled from "styled-components";
import Tag from "../ui/Tag";


const ContactsList = ({ theRecords, setPageMeta, inspectedContact, setInspectedContact }) => {
  
  const { filters, setFilters, inspectedContactId } = useContactsWorkspace();

  const [currentUser, setCurrentUser] = useState(null);

  // TODO: move to context
  useEffect(() => {
    const getCurrentUser = async () => {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      setCurrentUser(data);
    }
    getCurrentUser();
  }, []);
  
  const contactListRef = useRef(null);

  useEffect(() => {
    // TODO: prevent scrolling when saving a contact
    if ( contactListRef.current ) {
      // smoothly scroll consactListRef to top
      contactListRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [filters, theRecords]);



  return (
    <StyledContactsList ref={contactListRef}>
      {theRecords?.map(contact => (
        <li key={contact.id}>
          <ContactsListItem 
            contact={contact} 
            setInspectedContact={setInspectedContact} 
            currentUser={currentUser}
          />
        </li>
      ))}
    </StyledContactsList>
  );
};

export default ContactsList;


const StyledContactsList = styled.ol`
  list-style: none;
  padding: 0;
  padding-right: 0.5em;
  margin: 0;
  height: calc(100vh - (6.0625em + var(--height-titlebar) + 2.5em));
  
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

  const { filters, inspectedContact, setInspectedContact, tags, inspectedContacts, toggleInspectedContacts, inspectedContactId, setInspectedContactId } = useContactsWorkspace();


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
        const user = tag?.users?.find( user => user.directus_users_id === currentUser.id );
        if ( user ) {
          isRestricted = false;
        }
        else {
          isRestricted = true;
        }
      }
    });

    return isRestricted;

  }

  const isContactRestricted = doesContactHaveIsRestrictedTag(contact);

  function handleContactClick() {
    if ( ! isContactRestricted ) {
      toggleInspectedContacts(contact.id);
      if ( inspectedContactId === contact.id ) {
        setInspectedContactId(false);
      }
      else {
        setInspectedContactId(contact.id);
      }
      //setInspectedContactId(contact.id);
      /*if ( contact.id === inspectedContact?.id ) {
        setInspectedContact(false);
      }
      else {
        setInspectedContact(contact);
      }*/
    }
  }

  const details = []; 
  if ( contact.position ) details.push(contact.position);
  if ( contact?.organization?.name ) details.push(contact.organization.name);
  if ( ! contact?.organization?.name && contact.company ) details.push(contact.company);
  //if ( contact.location ) details.push(contact.location);


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

      if ( names.length === 0 ) names.push(contact.email_1_address || contact.phone_1_number || 'No name')

      return names.join(' ');
    }

    if ( contact.last_name ) names.push(contact.last_name);
    if ( contact.first_name ) names.push(contact.first_name);

    if ( names.length === 0 ) names.push(contact.email_1_address || contact.phone_1_number || 'No name')

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
      {filters.sort_field === 'date_created' && (
        <span className="date">
          <span>Created:</span> <time>{new Date(contact.date_created).toLocaleDateString()}</time>
        </span>
      )}
      {filters.sort_field === 'date_updated' && (
        <span className="date">
          <span>Updated:</span> <time>{new Date(contact.date_updated).toLocaleDateString()}</time>
        </span>
      )}
      {/*<span className="action-icon">
      {! isContactRestricted ? <EyeIcon /> : <LockIcon />}
      </span>*/}
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
  border-radius: calc(4 * var(--border-radius));
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
  .date {
    font-size: 0.75em;
    font-weight: 500;
    span {

    }
  }
  /*
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
    */
  &.is-selected {
    background-color: var(--color-primary);
    color: var(--color-white);
    /*&::before {
      opacity: 0.7;
    }
    &::after {
      opacity: 0.5;
    }*/
  }
`;