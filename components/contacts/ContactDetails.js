import React, { useState, useEffect } from "react";
import styled from "styled-components";
//import { useQuery, useQueryClient, useMutation } from "react-query";
import { useContactsWorkspace } from "./ContactsWorkspaceContext";

import FieldLabel from "../ui/FieldLabel";
import TextField from "../ui/TextField";
import Checkbox from "../ui/Checkbox";
import Button from "../Button";
import ButtonDanger from "../Button/ButtonDanger";
import ButtonPrimary from "../Button/ButtonPrimary";
import ButtonText from "../Button/ButtonText";

import { PencilIcon, PlusCircleIcon, XIcon, PlusIcon, LinkExternalIcon, CopyIcon } from '@primer/octicons-react';

import ReactMarkdown from 'react-markdown';
import Tag from "../ui/Tag";
import CopyToClipboard from "../ui/CopyToClipboard";
import { use } from "passport";


const ContactDetails = ({ setMode }) => {

  const { inspectedContact } = useContactsWorkspace();

  const [contact, setContact] = useState(inspectedContact);

  useEffect(() => {
    setContact(inspectedContact)
  }, [inspectedContact])
  
  const workDetails = [];
  if ( contact?.position ) workDetails.push(contact.position);
  if ( contact?.organization?.name) workDetails.push(contact.organization.name);
  if ( ! contact?.organization?.name && contact.company ) workDetails.push(contact.company);


  const hasActiveEmail = [1,2,3,4,5].some((i) => contact[`email_${i}_address`]);
  const hasActivePhone = [1,2,3,4,5].some((i) => contact[`phone_${i}_number`]);
  const hasActiveSocials = [`Bluesky`, `Instagram`, `Facebook`, `LinkedIn`, `Mastodon`, `Substack`, `Threads`, `YouTube`, `X`].some((social) => contact[`social_${social.toLowerCase()}`]);

  return (
    <StyledContactDetails>
      {/*
      <StyledContactInspectorToolbar>
        <Button onClick={() => setMode('edit')}><PencilIcon /> <span>Edit</span></Button>
      </StyledContactInspectorToolbar>
      */}
      <header>
        {contact.type === "individual" ? (
          <>
            <h1><CopyToClipboard>{contact.first_name} {contact.last_name}</CopyToClipboard></h1>
            <h2>{workDetails.map((detail) => {
              return (
                <React.Fragment key={detail}>
                  <CopyToClipboard>{detail}</CopyToClipboard>
                  {workDetails.length > 1 && workDetails.indexOf(detail) < workDetails.length - 1 && (
                    <span>, </span>
                  )}
                </React.Fragment>
              )
            })}</h2>
          </>
        ) : (
          <h1>{contact.name}</h1>
        )}
        <h3>{contact.location}</h3>
      </header>
      <section>
        <ul>
          {contact?.tags?.map((tag) => (
            <Tag key={`${contact.id}-${tag.contact_tags_id}-detail`} tagId={tag.contact_tags_id} />
          ))}
        </ul>
      </section>
      {( hasActiveEmail || hasActivePhone || hasActiveSocials ) && (
        <section className="contact-points-section">
            {hasActiveEmail && (
              <div>
                <h3>Email</h3>
                <div className="contact-points">
                  {[1,2,3,4,5].map((i) => {
                    return (
                      <React.Fragment key={`email-${i}`}>
                        {contact[`email_${i}_address`] && (
                          <StyledContactPoint>
                            <CopyToClipboard>{contact[`email_${i}_address`]}</CopyToClipboard>
                            {contact[`email_${i}_label`] && (
                              <span>({contact[`email_${i}_label`]})</span>
                            )}
                          </StyledContactPoint>
                        )}
                      </React.Fragment>
                    )
                  })}
                </div>
              </div>
            )}
            {hasActivePhone && (
              <div>
                <h3>Phone</h3>
                <div className="contact-points">
                  {[1,2,3,4,5].map((i) => {
                    return (
                      <React.Fragment key={`phone-${i}`}>
                        {contact[`phone_${i}_number`] && (
                          <StyledContactPoint>
                            <CopyToClipboard>{contact[`phone_${i}_number`]}</CopyToClipboard>
                            {contact[`phone_${i}_label`] && (
                              <span>({contact[`phone_${i}_label`]})</span>
                            )}
                          </StyledContactPoint>
                        )}
                      </React.Fragment>
                    )
                  })}
                </div>
              </div>
            )}
          {hasActiveSocials && (
            <div className="socials">
              <h3>Socials</h3>
              <div className="socials">
                {[`Bluesky`, `Instagram`, `Facebook`, `LinkedIn`, `Mastodon`, `Substack`, `Threads`, `YouTube`, `X`].map((social) => {
                  return (
                    <React.Fragment key={`social-${social}`}>
                      {contact[`social_${social.toLowerCase()}`] && (
                        <StyledExternalLink href={contact[`social_${social.toLowerCase()}`]} title={`View on ${social}`} target="_blank" rel="noopenner noreferrer">
                          <span>{social}</span>
                          <i>
                            <LinkExternalIcon />
                          </i>
                        </StyledExternalLink>
                      )}
                    </React.Fragment>
                  )
                })}
              </div>
            </div>
          )}
        </section>
      )}
      <section className="notes">
        <ReactMarkdown>{contact.notes}</ReactMarkdown>
      </section>
      <section className="meta">
        {contact?.date_updated && (
          <div className="date-meta">
            <strong>Updated:</strong> <time>{new Date(contact.date_updated).toLocaleDateString()}</time>
            {contact?.user_updated?.first_name && (
              <span> by {contact.user_updated.first_name} {contact.user_updated.last_name}</span>
            )}
          </div>
        )}
        {contact?.date_created && (
          <div className="date-meta">
            <strong>Created:</strong> <time>{new Date(contact.date_created).toLocaleDateString()}</time>
            {contact?.user_created?.first_name && (
              <span> by {contact.user_created.first_name} {contact.user_created.last_name} </span>
            )}
          </div>
        )}
      </section>
    </StyledContactDetails>
  );
};

export default ContactDetails;

const StyledContactInspectorToolbar = styled.div`
  position: sticky;
  top: 0;
  z-index: 4;
  padding: 1em 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--color-off-white);
  border-bottom: var(--border-divider);
`;

const StyledLinkWithCopy = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
`;

const StyledExternalLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.25em;
  padding: 0.125em 0.25em;
  background-color: var(--color-white);
  border-radius: 0.25em;
  justify-content: space-between;
  i {
    font-style: normal;
    opacity: 0.5;
  }
`;

const StyledContactPoint = styled.div`
  display: grid;
  gap: 0.25em;
  align-items: start;
  > span {
    font-size: 0.75em;
    font-weight: 600;
    opacity: 0.7;
  }
`;

const StyledContactDetails = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  header {
    margin-bottom: 1em;
    h1 {
      font-size: 1.5em;
      font-weight: 600;
      margin: 0;
    }
    h2,
    h3 {
      font-size: 1em;
      font-weight: 500;
      margin: 0;
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
  
  section {
    &:not(:last-of-type) {
      margin-bottom: 1.5em;
      padding-bottom: 1.5em;
      border-bottom: var(--border-divider);
    }
    h3 {
      font-size: 1em;
      font-weight: 500;
      line-height: 1;
      margin-bottom: 1em;
    }
  }

  .contact-points-section {
    display: grid;
    grid-template: auto / 1.5fr 1fr;
    gap: 1.5em;
    place-items: start;
    h3 {
      font-size: 0.8125em;
      font-weight: 700;
      margin: 0 0 0.5em;
    }
    > .socials {
      grid-column: 2;
      grid-row: 1 / span 2;
    }
  }

  .contact-points {
    display: grid;
    gap: 0.5em;
  }

  .socials {
    display: grid;
    gap: 0.5em;
    grid-template: auto / repeat(auto-fill, minmax(100px, 1fr));
  }

  p {
    margin: 0 0 1em;
    &:last-of-type {
      margin-bottom: 0;
    }
  }
  a {
    text-decoration-line: underline;
    text-decoration-thickness: 0.75px;
    text-underline-offset: 0.1em;
    text-decoration-color: black;
    text-decoration: underline;
    opacity: 0.7;
  }
  .can-hover & a:hover,
  a:active {
    opacity: 1;
  }

  .notes {
    font-size: 0.875em;
  }

  .meta {
    margin-top: auto;
    padding-bottom: 1.5em;
  }
  .date-meta {
    font-size: 0.875em;
    font-style: italic;
    strong {
      font-weight: inherit;
    }
  }
`;


const StyledContactInspectorForm = styled.div`
  position: relative;
  display: grid;
  grid-template: auto / repeat(2, calc(50% - 0.875em));
  grid-gap: 1em 1.5em;
  padding: calc(1.5 * var(--padding-viewport)) calc(2 * var(--padding-viewport));
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
  > h3 {
    border-top: var(--border-divider);
    grid-column: auto / span 2;
    font-size: 1em;
    margin: 0.5em 0 0;
    padding: 0.75em 0 0;
  }
  > div {
    position: relative;
    grid-column: auto / span 2;
    &.half {
      grid-column: auto / span 1;
    }
  }
  .meta {
    font-size: 0.6875em;
    font-style: italic;
  }
  @media ( max-width: 80em ) {
    padding: var(--padding-viewport);
    > div {
      position: relative;
      grid-column: auto / span 2;
      &.half {
        grid-column: auto / span 2;
      }
    }
  }
`

const StyledContactInspectorHeader = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: inherit;
  height: var(--height-titlebar);
  margin: 0 calc(1.5 * var(--padding-viewport));
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: var(--border-divider);
  @media ( max-width: 80em ) {
    margin: 0 var(--padding-viewport);
  }
`

function ArrayField({ field, currentValues, updateContact, inlineTags }) {
  const [value, setValue] = useState(``)
  const [values, setValues] = useState(currentValues || [])

  const addValue = ( value ) => {
    if ( value !== `` && ! values.includes(value) ) {
      setValues([...values, value])
      setValue('')
    }
  }
  const removeValue = ( needle ) => {
    setValues( values.filter((item) => item !== needle) )
  }

  const handleKeyDown = ( e ) => {
    if ( e.key === 'Enter' ) {
      e.preventDefault()
      addValue( value )
    }
  }

  useEffect(() => {
    setValues(currentValues)
    setValue('')
  }, [currentValues])
  
  useEffect(() => {
    if ( values.length ) {
      updateContact({[field.name]: values})
    }
  }, [values])

  return (
    <StyledArrayField
      inlineTags={inlineTags ? true : undefined}
    >
      <ul>
        {values.map((item) => (
          <>
            {(item?.name || ( typeof item === 'string' || item instanceof String)) && (
              <li 
                key={`${field.name}_${(item?._id || item)}`} 
              >
                <span>{(item?.name || item)}</span>
                <button onClick={() => removeValue(item)}><XIcon /></button>
              </li>
            )}
          </>
        ))}
      </ul>
      <div>
        <TextField
          name={field.name}
          type={field.format || 'text'}
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          autoComplete="false"
        />
        <button type="button" onClick={() => addValue( value )}><PlusCircleIcon /></button>
      </div>
    </StyledArrayField>
  )
}
const StyledArrayField = styled.div`
  position: relative;
  > div {
    position: relative;
  }
  > div > button {
    position: absolute;
    top: 0.8375em;
    right: 0.8375em;
    opacity: 0.5;
    transition: opacity 0.2s ease;
  }
  .can-hover & > div > button:hover,
  > div > button:active {
    opacity: 1;
  }
  ul {
    position: relative;
    list-style: none;
    margin: 0.5em 0 0.5em;
    padding: 0;
    li {
      position: relative;
      display: grid;
      grid-template: auto / auto auto;
      background-color: var(--color-white);
      border-radius: calc(4 * var(--border-radius));
      box-shadow: inset 0 0 0 var(--border-width) rgba(0,0,0,0.075);
      height: auto;
      align-items: center;
      margin-bottom: 0.5em;
      line-height: normal;
      overflow: hidden;
      span {
        display: block;
        font-size: 0.875em;
        padding: 0.625em 0.5em 0.625em 0.75em;
        -webkit-overflow-scrolling: touch;
        overflow: auto;
        &::-webkit-scrollbar {
          display: none;
        }
      }
      button {
        position:relative;
        z-index: 1;
        border-left: var(--border-divider);
        padding: 0.0625em 0.625em 0 0.375em;
        box-shadow: -0.375em 0 0.5em 0.25em var(--color-white);
        .can-hover &:hover,
        &:active {
          color: var(--color-caution)
        }
      }
    }
  }

  .full & ul {
    display: flex;
    flex-wrap: wrap;
  }
  .full & ul li {
    margin-right: 0.25em;
    margin-bottom: 0.25em;
  }
`

function SocialField({ field, currentValue, currentFollowerValue, updateContact, contact }) {
  const [value, setValue] = useState(currentValue || undefined)
  const [isFollower, setIsFollower] = useState(currentFollowerValue || undefined)

  const handleKeyDown = ( e ) => {
    if ( e.key === 'Enter' ) {
      e.preventDefault()
    }
  }

  useEffect(() => {
    setValue(currentValue || undefined)
  }, [currentValue])

  useEffect(() => {
    setIsFollower(currentFollowerValue || undefined)
  }, [currentFollowerValue])

  useEffect(() => {
    if ( typeof value !== 'undefined' ) {
      if ( value ) {
        updateContact({[field.name]: value})
      }
      if ( value === '' ) {
        setIsFollower(false)
      }
    }
  }, [value])

  useEffect(() => {
    if ( typeof isFollower !== 'undefined' ) {
      updateContact({[`${field.name}IsFollower`]: isFollower})
    }
  }, [isFollower])
  
  let link = ''
  switch ( field.name ) {
    case 'twitter':
      link = `https://twitter.com/${value}`
      break
    case 'instagram':
      link = `https://www.instagram.com/${value}`
      break
    default:
      link = value
  }


  return (
    <StyledSocialField>
      <TextField
        name={field.name}
        type={field.format || 'text'}
        value={value || ''}
        onChange={(e) => setValue(e.currentTarget.value)}
        onKeyDown={handleKeyDown}
        autoComplete="false"
      />
      <Checkbox 
        checked={isFollower}
        onClick={() => setIsFollower( ! isFollower )}
      />
      {value &&
        <a href={link} target="_blank"><LinkExternalIcon /></a>
      }
    </StyledSocialField>
  )
}
const StyledSocialField = styled.div`
  position: relative;
  display: grid;
  grid-template: 1fr / auto auto;
  grid-gap: 0.5em;
  align-items: center;
  a {
    position: absolute;
    z-index: 2;
    top: 0.3em;
    right: 2em;
    opacity: 0.5;
    transition: opacity 0.2s ease;
    .can-hover &:hover,
    &:active {
      opacity: 1;
    }
  }
`

function InspectorEmpty({ setContact }) {
  return (
    <StyledInspectorEmpty>
      <ButtonText onClick={() => setContact({})}><PlusIcon /></ButtonText>
    </StyledInspectorEmpty>
  )
}

const StyledInspectorEmpty = styled.div`
  position: relative;
  height: 100%;
  padding: var(--padding-viewport);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
`