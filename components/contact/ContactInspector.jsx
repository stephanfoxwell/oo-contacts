import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useCurrentUser } from '@/hooks/index'
import { useQuery, useQueryClient, useMutation } from 'react-query'
import { useWorkspace } from '@/components/contact/WorkspaceContext'

import FieldLabel from '@/components/ui/FieldLabel'
import TextField from '@/components/ui/TextField'
import Checkbox from '@/components/ui/Checkbox'
import { ButtonDanger, ButtonText, ButtonPrimary } from '@/components/Button/index'

import { PlusCircleIcon, XIcon, PlusIcon, LinkExternalIcon } from '@primer/octicons-react'


async function postContact( data ) {
  const formMethod = data && data._id ? 'PATCH' : 'POST'

  const response = await fetch('/api/contacts', {
    method: formMethod,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if ( ! response.ok )
    throw new Error("Network response was not ok")
    
  const json = await response.json()

  return json
}

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

function ContactInspector({ inspectedContact, setInspectedContact }) {

  const {
    fields,
    setPageStatus,
  } = useWorkspace()

  const queryClient = useQueryClient()

  const [contact, setContact] = useState(inspectedContact || undefined)

  const updateContact = ( update ) => {
    setContact({...contact, ...update})
  }
  useEffect(() => {
    setInspectedContact( contact )
  }, [contact])
  
  useEffect(() => {
    if ( inspectedContact ) {
      setContact(inspectedContact)
    }
    else if ( inspectedContact === false || inspectedContact === undefined ) {
      setContact(undefined)
    }
  }, [inspectedContact])
  
  const [lastModifiedBy, setLastModifiedBy] = useState(false)
  const [user] = useCurrentUser()

  const {isSuccess, isLoading, isError, data, error } = useQuery(['lastModifiedBy'], () => fetchUser(contact.lastModifiedBy))

  useEffect(() => {
    setLastModifiedBy(data)
  }, [data])
  
  const mutation = useMutation(postContact, {
    onSuccess: (response) => {
      console.log('post mutation success')
      queryClient.invalidateQueries('contacts')
      queryClient.invalidateQueries('tags')
      updateContact({ _id: response._id})
    },
  })

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
  
  return (
    <StyledContactInspector autoComplete="off" id="contactForm" method="post">
      {contact ? (
        <>
          {/*
          */}
          <StyledContactInspectorHeader>
            <ButtonText 
              type="reset" 
              onClick={() => setContact(undefined)}
            ><XIcon /></ButtonText>
            <ButtonPrimary type="button" onClick={() => mutation.mutate(contact)}>Save</ButtonPrimary>
          </StyledContactInspectorHeader>
          <StyledContactInspectorForm>
            {fields?.map(( field ) => (
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
                  </div>
                )}
              </>
            ))}
            {contact &&
              <div>
                <ButtonDanger 
                  onClick={(e) => handleDelete(e)}
                >Delete</ButtonDanger>
              </div>
            }
            {lastModifiedBy && 
              <div className="full meta">
                Last modified by {lastModifiedBy.name}
              </div>
            }
          </StyledContactInspectorForm>
        </>
      ) : (
        <InspectorEmpty setContact={setContact} />
      )}
    </StyledContactInspector>
  );
}

export default ContactInspector


const StyledContactInspector = styled.div`
  position: relative;
  height: calc(100vh - var(--height-nav));
  border-left: var(--border-divider);
  border-left: 0;
  background-color: var(--color-off-white);
  .has-inspector & {
    display: grid;
    grid-template: auto 1fr / 1fr;
  }
`


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