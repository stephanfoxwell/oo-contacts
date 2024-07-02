import React, { useState, useEffect } from "react";
import styled from "styled-components";
//import { useQuery, useQueryClient, useMutation } from "react-query";
import { useContactsWorkspace } from "./ContactsWorkspaceContext";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import FieldLabel from "../ui/FieldLabel";
import TextField from "../ui/TextField";
import Checkbox from "../ui/Checkbox";
import ButtonDanger from "../Button/ButtonDanger";
import ButtonPrimary from "../Button/ButtonPrimary";
import ButtonText from "../Button/ButtonText";

import { EyeIcon, PlusCircleIcon, XIcon, PlusIcon, LinkExternalIcon } from '@primer/octicons-react'
import Button from "../Button";

async function postContact( data ) {
  const formMethod = data && data.id ? 'PATCH' : 'POST';
  
  const response = await fetch('/api/contacts', {
    method: formMethod,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if ( ! response.ok )
    throw new Error("Network response was not ok");
    
  return await response.json();
  
}

/*
async function deleteContact( data ) {
  
  const response = await fetch('/api/contacts', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if ( ! response.ok )
    throw new Error("Network response was not ok")
    
  return await response.json()
}

async function fetchUser(userId) {
  const response = await fetch(`/api/user?_id=${userId}`)

  if ( ! response.ok )
    throw new Error("Network response was not ok")
  
  return await response.json()
}
*/


const fetchData = async (newContactId) => {
  console.log("attempt to fetch new contact", newContactId);
  try {
    const response = await fetchContacts({ id: newContactId });
    console.log("inspectedContact",response.data);
    //setInspectedContact(response.data);
    console.log("did update inspected contact on mutate")
  } catch (error) {
    console.error('Error fetching data:', error);
    //setLoading(false); // Ensure loading is set to false in case of an error
  }
};

function ContactsEditor({ setMode }) {

  const {
    inspectedContact,
    setInspectedContact,
    setInspectedContactId,
    organizations
  } = useContactsWorkspace()

  const queryClient = useQueryClient();
  
  const [contact, setContact] = useState(inspectedContact || undefined)

  const updateContact = ( update ) => {
    if ( typeof contact === 'undefined') {
      setContact(update);
    }
    else {
      setContact({...contact, ...update})
    }
  }
  useEffect(() => {
    //setInspectedContact( contact )
  }, [contact])
  
  useEffect(() => {
    if ( inspectedContact ) {
      setContact(inspectedContact)
    }
    else if ( inspectedContact === false || inspectedContact === undefined ) {
      setContact(undefined)
    }
  }, [inspectedContact]);
  
  const [savingState, setSavingState] = useState('Save');
  
  const mutation = useMutation({
    mutationFn: postContact,
    onMutate: () => {
      setSavingState("Saving");
    },
    onSuccess: (response) => {
      setSavingState("Saved");
      setTimeout(() => setSavingState("Save"), 2000);
      const newContact = response.data;
      setInspectedContactId(newContact.id);
      queryClient.invalidateQueries(['contacts', 'tags', 'organizations', 'inspected_contact']);
      console.log("mutate success", response);
      console.log("newContact id", newContact.id);
  
      //fetchData(newContact.id);
      // TODO: FIX VIEW MODE UPDATE
      //setInspectedContact(newContact);
      //setContact(newContact);
      if ( ! contact?.id ) {
        /*console.log(data);
        setContact(response);
        setInspectedContactId(response.id);*/
      }
      //updateContact({ id: response.id})
    },
  });

  /*
  const deleteMutation = useMutation(deleteContact, {
    onSuccess: () => {
      console.log('delete mutation success')
      setContact(undefined)
      //setInspectedContact(false)
      //queryClient.invalidateQueries('contacts')
      //queryClient.invalidateQueries('tags')
      setPageStatus(`deleted`)
      setTimeout(() => setPageStatus(null), 3000)
    },
  })

  async function handleDelete(e) {
    
    if ( ! contact ) {
      return
    }
    e.preventDefault();
    if ( window.confirm(`Delete this contact? This cannot be undone.`) ) {
      setPageStatus(`deleting...`)
      
      const body = {
        _id: contact._id
      }

      deleteMutation.mutate(body)
    }
  }
  */
  
  return (
    <StyledContactEditor autoComplete="off" id="contactForm" method="post">
        <>
          {/*
          */}
          <StyledContactEditorHeader>
            {/*<Button onClick={() => setMode('view')}><EyeIcon /> <span>View</span></Button>*/}
            <ButtonPrimary type="button" onClick={() => mutation.mutate(contact)}>{savingState}</ButtonPrimary>
          </StyledContactEditorHeader>
          <StyledContactEditorForm autoComplete="off">
            <div className="full">
              <FieldLabel htmlFor="form-name">Type</FieldLabel>
              <ChoicesField name="type" options={['individual', 'organization']} currentValue={contact?.type || "individual"} updateContact={updateContact} />
            </div>
            {contact?.type === "organization" ? (
              <>
                <div className="full">
                  <FieldLabel htmlFor="form-organization">Name</FieldLabel>
                  <TextField
                    id="form-organization"
                    name="name"
                    type="text"
                    value={contact?.name || ``}
                    onChange={(e) => updateContact({ name: e.currentTarget.value})}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="half">
                  <FieldLabel htmlFor="form-firstName">First Name</FieldLabel>
                  <TextField
                    id="form-firstName"
                    name="firstName"
                    type="text"
                    value={contact?.first_name || ``}
                    onChange={(e) => updateContact({ first_name: e.currentTarget.value})}
                  />
                </div>
                <div className="half">
                  <FieldLabel htmlFor="form-lastName">Last Name</FieldLabel>
                  <TextField
                    id="form-lastName"
                    name="lastName"
                    type="text"
                    value={contact?.last_name || ``}
                    onChange={(e) => updateContact({ last_name: e.currentTarget.value})}
                  />
                </div>
              </>
            )}
            <div className="full">
              <FieldLabel htmlFor="form-notes">Notes</FieldLabel>
              <TextField
                id="form-notes"
                as="textarea"
                name="notes"
                type="text"
                value={contact?.notes || ``}
                rows="10"
                onChange={(e) => updateContact({ notes: e.currentTarget.value})}
              />
              <p className="meta">Add links like so: [link text](http://example.com)</p>
            </div>

            <div className="full">
              <FieldLabel htmlFor="form-tags">Tags</FieldLabel>
              <ArrayField
                field={{name: 'tags', type: 'string', multiple: true}}
                currentValues={contact?.tags || []}
                updateContact={updateContact}
                inlineTags
              />
            </div>

            {[1,2,3,4,5].map((i) => (
              <>
                <div className="full">
                  <FieldLabel htmlFor={`form-email_${i}`}>Email {i}</FieldLabel>
                  <EmailField
                    field={{name: `email_${i}`, type: 'email'}}
                    updateContact={updateContact}
                    contact={contact}
                  />
                </div>
              </>
            ))}
            {[1,2,3,4,5].map((i) => (
              <>
                <div className="full">
                  <FieldLabel htmlFor={`form-phone_${i}`}>Phone {i}</FieldLabel>
                  <EmailField
                    field={{name: `phone_${i}`, type: 'tel'}}
                    updateContact={updateContact}
                    contact={contact}
                  />
                </div>
              </>
            ))}
            {['Bluesky', 'Facebook', 'Instagram', 'LinkedIn', 'Mastodon', 'Substack', 'Threads', 'X', 'YouTube' ].map((social) => (
              <div className="full">
                <FieldLabel htmlFor={`form-${social.toLowerCase()}`}>{social}</FieldLabel>
                <TextField
                  id={`form-${social.toLowerCase()}`}
                  name={`social_${social.toLowerCase()}`}
                  type="text"
                  value={contact?.[`social_${social.toLowerCase()}`] || ``}
                  onChange={(e) => updateContact({ [`social_${social.toLowerCase()}`]: e.currentTarget.value})}
                />
              </div>
            ))}
            {contact?.type === 'individual' && (
              <>
                <div className="full">
                  <FieldLabel htmlFor="form-organization">Organization</FieldLabel>
                  <div className="select">
                    <select
                      id="form-organization"
                      name="organization"
                      value={contact?.organization?.id || ``}
                      onChange={(e) => updateContact({ organization: { id: e.currentTarget.value } })}
                    >
                      <option value="">Select an organization</option>
                      {organizations?.map((org) => (
                        <option key={org.id} value={org.id} selecte={contact?.organization?.id || undefined}>{org.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="full">
                  <FieldLabel htmlFor="form-company">Company (if no organization)</FieldLabel>
                  <TextField
                    id="form-company"
                    name="company"
                    type="text"
                    value={contact?.company || ``}
                    onChange={(e) => updateContact({ company: e.currentTarget.value})}
                  />
                </div>
                <div className="full">
                  <FieldLabel htmlFor="form-position">Position</FieldLabel>
                  <TextField
                    id="form-position"
                    name="position"
                    type="text"
                    value={contact?.position || ``}
                    onChange={(e) => updateContact({ position: e.currentTarget.value})}
                  />
                </div>
              </>
            )}
            <div className="full">
              <FieldLabel htmlFor="form-location">Location</FieldLabel>
              <TextField
                id="form-location"
                name="location"
                type="text"
                value={contact?.location || ``}
                onChange={(e) => updateContact({ location: e.currentTarget.value})}
              />
            </div>
            {/*fields?.map(( field ) => (
              <>
                {field.type === 'divider' ? (
                  <h3>{field.label}</h3>
                ) : (
                  <div className={field?.display === 'half' ? 'half' : 'full'}>
                    <FieldLabel htmlFor={`form-${field.name}`}>{field.label}</FieldLabel>
                    {field.multiple  ? (
                      <ArrayField
                        field={field}
                        currentValues={contact?.[field.name] || []}
                        updateContact={updateContact}
                      />
                    ) : (
                      <>
                        {field.type === 'social' ? (
                          <SocialField
                            field={field}
                            currentValue={contact?.[field.name] || false}
                            currentFollowerValue={contact?.[`${field.name}IsFollower`]}
                            updateContact={updateContact}
                            contact={contact}
                          />
                        ) : (
                          <>
                            {field.type === 'boolean' ? (
                              <label>
                                <Checkbox 
                                  checked={contact?.[field.name] ? true : undefined} 
                                  onClick={() => updateContact({[field.name] : ( ! contact?.[field.name] )})}
                                />
                                {field.hint && <span>{field.hint}</span>}
                              </label>
                            ) : (
                              <>
                                {(field.type === "email" || field.type === "tel" ) ? (
                                  <EmailField
                                    field={field}
                                    updateContact={updateContact}
                                    contact={contact}
                                  />
                                ) : (
                                  <TextField
                                    id={`form-${field.name}`}
                                    as={field.type === 'text' ? 'textarea' : 'input'}
                                    name={field.name}
                                    type="text"
                                    value={contact?.[field.name] || ``}
                                    rows={field.rows ? field.rows : undefined}
                                    onChange={(e) => updateContact({ [field.name]: e.currentTarget.value})}
                                  />
                                )}
                              </>
                            )}
                          </>
                        )}
                      </>
                    )}
                    {field.hint && <div className="meta">{field.hint}</div>}
                  </div>
                )}
              </>
            ))*/}
            {/*contact &&
              <div>
                <ButtonDanger 
                  onClick={(e) => handleDelete(e)}
                >Delete</ButtonDanger>
              </div>
            */}
            {/*lastModifiedBy && 
              <div className="full meta">
                Last modified by {lastModifiedBy.name}
              </div>
          */}
          </StyledContactEditorForm>
        </>
    </StyledContactEditor>
  );
}

export default ContactsEditor


const StyledContactEditor = styled.div`
  position: relative;
  .has-inspector & {
    display: grid;
    grid-template: auto 1fr / 1fr;
  }
  select::-ms-expand {
  display: none;
}
  select {
  // A reset of styles, including removing the default dropdown arrow
    appearance: none;
    // Additional resets for further consistency
    background-color: transparent;
    border: none;
    padding: 0 1em 0 0;
    margin: 0;
    width: 100%;
    font-family: inherit;
    font-size: inherit;
    cursor: inherit;
    line-height: inherit;
    border: var(--border-width) solid rgba(0,0,0,0.09375);
    border-radius: var(--border-radius-button);
    font-size: 0.875rem;
    font-weight: 500;
    padding: 0.5em 0.8125em;
    display: inline-block;
    outline: none;
    cursor: pointer;

    .can-hover &:hover:not(:focus) {
    box-shadow: 0 0 0 calc(2* var(--border-width)) var(--color-primary-outline);
  }
  &:focus {
    box-shadow: 0 0 0 var(--border-width) var(--color-primary), 0 0 0 calc(4* var(--border-width)) var(--color-primary-outline);
    border-color: var(--color-border-dark);
  }
  .can-hover &:hover {
    border-color: var(--color-border-dark);
  }
  option {
    font-family: inherit;
  }
  }
  .select {
    position: relative;

    &::after {
      content: "";
      position: absolute;
      top: 50%;
      transform: translate3d(0,calc(-50% + 0.1em),0);
      right: 0.75em;
      width: 0.7em;
      height: 0.375em;
      background-color: currentColor;
      clip-path: polygon(100% 0%, 0 0%, 50% 100%);
    }
  }
`


const StyledContactEditorForm = styled.form`
  position: relative;
  display: grid;
  grid-template: auto / repeat(2, calc(50% - 0.875em));
  grid-gap: 1em 1.5em;
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

const StyledContactEditorHeader = styled.div`
  position: sticky;
  top: 0;
  display: inline-flex;
  margin-left: auto;
  z-index: 10;
  /*z-index: 4;
  padding: 1em 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--color-off-white);
  border-bottom: var(--border-divider);*/
`;

function ChoicesField({ name, options, currentValue, updateContact }) {
  return (
    <StyledChoicesField>
      {options.map((option) => (
        <label key={option}>
          <input

            type="radio"
            name={name}
            value={option}
            checked={currentValue === option}
            onChange={(e) => updateContact({[name]: e.currentTarget.value})}
          />
          <span></span>
          {option}
        </label>
      ))}
    </StyledChoicesField>
  )
}
const StyledChoicesField = styled.div`
  position: relative;
  display: flex;
  gap: 1.5em;
  label {
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
    span {
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
  }
`

function EmailField({ field, updateContact, contact }) {

  const nameModifier = field.type === 'email' ? 'address' : 'number'

  return (
    <StyledFieldWithLabel>
      <TextField
        id={`form-${field.name}`}
        as={field.type === 'text' ? 'textarea' : 'input'}
        name={`${field.name}_${nameModifier}`}
        type="text"
        value={contact?.[`${field.name}_${nameModifier}`] || ``}
        onChange={(e) => updateContact({ [`${field.name}_${nameModifier}`]: e.currentTarget.value})}
        placeholder={field.type === 'email' ? "Email address" : "Phone number"}
      />
      <TextField
        id={`form-${field.name}`}
        as={field.type === 'text' ? 'textarea' : 'input'}
        name={`${field.name}_label`}
        type="text"
        value={contact?.[`${field.name}_label`] || ``}
        onChange={(e) => updateContact({ [`${field.name}_label`]: e.currentTarget.value})}
        placeholder="Label (optional)"
      />
    </StyledFieldWithLabel>
  );
};

const StyledFieldWithLabel = styled.div`
  display: grid;
  grid-template: 1fr / 2.5fr 1fr;
  gap: 0.5em;
`;

function ArrayField({ field, currentValues, updateContact, inlineTags }) {
  const [value, setValue] = useState(``);

  const { tags } = useContactsWorkspace();


  const [values, setValues] = useState(currentValues || []);

  const addValue = ( value ) => {
    if ( value !== `` && ! values.includes(value) ) {
      setValues([...values, {contact_tags_id: value}])
      setValue('')
    }
  }
  const removeValue = ( needle ) => {
    setValues( values.filter((item) => item.contact_tags_id !== needle) )
  }

  const handleKeyDown = ( e ) => {
    if ( e.key === 'Enter' ) {
      e.preventDefault()
      addValue( e.target.value )
    }
  }
  
  useEffect(() => {
    setValues(currentValues || [])
    setValue('')
  }, [currentValues])
  
  useEffect(() => {
    if ( values.length ) {
      updateContact({[field.name]: values})
    }
  }, [values])

  useEffect(() => {
    console.log(value)
  }, [value])

  return (
    <StyledArrayField
      inlineTags={inlineTags ? true : undefined}
    >
      <div className="controls">
        <div className="select">
          <select name="tags-select" onKeyDown={(e) => handleKeyDown(e)} onChange={(e) => setValue(e.target.value)}>
            <option value="">Select a tag</option>
            {tags?.filter( tag => ! values.find( value => value.contact_tags_id === tag.id ) ).map((item) => (
              <option key={item.id} value={item.id} disabled={item.is_closed ? 'disabled': undefined}>{item.name}</option>
            ))}
          </select>
        </div>
        {value && value !== '' && (
          <ButtonPrimary type="button" onClick={() => addValue( document.querySelector('select[name="tags-select"]').value )}>Add Tag</ButtonPrimary>
        )}
        {/*<TextField
          name={field.name}
          type={field.format || 'text'}
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          autoComplete="false"
        />
        <button type="button" onClick={() => addValue( value )}><PlusCircleIcon /></button>*/}
      </div>
      <ul>
        {tags?.filter( tag => values.find( value => value.contact_tags_id === tag.id ) ).map((item) => (
          <>
            {item?.name && (
              <li 
                key={`${field.name}_${(item?.id || item)}`} 
              >
                <span>{(item?.name || item)}</span>
                <button onClick={() => removeValue(item.id)}><XIcon /></button>
              </li>
            )}
          </>
        ))}
      </ul>
    </StyledArrayField>
  )
}
const StyledArrayField = styled.div`
  position: relative;
  > div {
    position: relative;
  }
  .controls {
    display: flex;
    gap: 0.5em;
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

function EditorEmpty({ setContact }) {
  return (
    <StyledEditorEmpty>
      <ButtonText onClick={() => setContact({})}><PlusIcon /></ButtonText>
    </StyledEditorEmpty>
  )
}

const StyledEditorEmpty = styled.div`
  position: relative;
  height: 100%;
  padding: var(--padding-viewport);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
`