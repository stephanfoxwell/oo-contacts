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

  const theName = (contact.type === "individual" ? `${contact.first_name || ''} ${contact.last_name || ''}` : contact.name);

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
            <h1><CopyToClipboard>{`${theName}`}</CopyToClipboard></h1>
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
          <h1><CopyToClipboard>{contact.name}</CopyToClipboard></h1>
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
                        <div className="social-link">
                          <a href={contact[`social_${social.toLowerCase()}`]} title={`View on ${social}`} target="_blank" rel="noopenner noreferrer">
                            <LinkExternalIcon />
                          </a>
                          <CopyToClipboard text={contact[`social_${social.toLowerCase()}`]}>{social}</CopyToClipboard>
                        </div>
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
    > div {
      font-size: 0.875em;
    }
  }

  .socials {
    display: grid;
    gap: 0.5em;
    grid-template: auto / repeat(auto-fill, minmax(100px, 1fr));
  }

  .social-link {
    display: flex;
    gap: 0.5em;
    font-size: 0.875em;
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
    font-size: 0.8125em;
    font-style: italic;
    strong {
      font-weight: inherit;
    }
  }
`;



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