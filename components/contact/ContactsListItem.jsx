import React, { useState, useEffect } from 'react'
import styled, {css} from 'styled-components'

import { useWorkspace } from '@/components/contact/WorkspaceContext'

import Checkbox from '@/components/ui/Checkbox'

import { CheckIcon, VerifiedIcon, StarFillIcon } from '@primer/octicons-react'

function ContactsListItem({ contact, inspectedContact, setInspectedContact }) {

  const { 
    selectedRecords,
    setSelectedRecords
  } = useWorkspace()

  const [selected, setSelected] = useState(selectedRecords?.includes(contact._id) ? true : false)

  useEffect(() => {
    selected ? (
      setSelectedRecords([...selectedRecords, contact._id])
    ) : (
      setSelectedRecords( selectedRecords.filter((item) => item !== contact._id))
    )
  },[selected])

  useEffect(() => {
    selectedRecords.includes( contact._id ) ? setSelected(true) : setSelected(false)
  }, [selectedRecords])

  function handleContactClick( contact ) {
    if ( contact._id === inspectedContact?._id ) {
      setInspectedContact(false)
    }
    else {
      setInspectedContact(contact)
    }
    //document.getElementById('notes').scrollTop = 0;
  }

  const displayName = contact.firstName || contact.lastName ? (
    (`${contact?.lastName ? `${contact.lastName}, `  : ``}${contact?.firstName || ``}`).trim()
  ) : contact.email

  const contactPoints = [/*'email', 'phone', */'twitter', 'facebook', 'instagram', 'linkedin']

  return (
    <StyledContactListItem
      
      className={inspectedContact?._id === contact._id ? `is-inspected` : undefined}
    >
      <Checkbox
        onClick={() => setSelected( ! selected )}
        checked={selected ? true : undefined}
      />
      <StyledContactListItemName onClick={() => handleContactClick(contact)}>
        <h3>{displayName} {contact?.isVerified && <VerifiedIcon />}</h3>
        {contact.company && <span>{contact.company}</span>}
      </StyledContactListItemName>
      {contact?.tags?.length > 0 && (
        <StyledContactListItemTags>
          {contact?.tags?.map((item) => (
            <StyledContactListItemTagsItem 
              key={`${item._id}-${contact._id}`} 
              color={item.color ? item.color : undefined}
            >{item.name}</StyledContactListItemTagsItem>
          ))}
        </StyledContactListItemTags>
      )}
      <StyledContactListItemPoints>
        {contactPoints.map((contactPoint) => {
          let link = ''
          switch ( contactPoint ) {
            case 'twitter':
              link = `https://twitter.com/${contact[contactPoint]}`
              break
            case 'instagram':
              link = `https://www.instagram.com/${contact[contactPoint]}`
              break
            default:
              link = contact[contactPoint]
          }
          return (
            <>
              {contact[contactPoint] && (
                <li 
                  key={`${contact._id}-${contactPoint}`}
                ><a href={link} target="_blank"
                className={contactPoint.toLowerCase()}>{contactPoint.substring(0,1)}{contact[`${contactPoint}IsFollower`] && <CheckIcon />}</a></li>
              )}
            </>
          )
        })}
      </StyledContactListItemPoints>
    </StyledContactListItem>
  )
}

const StyledContactListItem = styled.li`
  position: relative;
  display: grid;
  grid-template: auto / 1.5em 30% calc(70% - 11.5em) 7em;
  align-items: center;
  grid-gap: 1em;
  padding: 1em 0;
  &:not(:last-of-type) {
    border-bottom: var(--border-divider);
  }
  > *:last-child {
    margin-left: auto;
  }
  > button:last-of-type {
    opacity: 0;
  }
`

const StyledContactListItemName = styled.div`
  position:relative;
  z-index: 1;
  cursor: pointer;
  padding: 0.25em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-self: stretch;
  &::after,
  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    top: -0.25em;
    right: -0.25em;
    bottom: -0.25em;
    left: -0.25em;
    border-radius: calc(4 * var(--border-radius));
    background-color: var(--color-primary);
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  &::before {
    background-color: var(--color-off-white);
  }
  .can-hover &:hover::before {
    opacity: 1;
  }
  .is-inspected & {
    color: var(--color-white);
    &::after {
      opacity: 1;
    }
  }
  h3 {
    font-size: 0.875em;
    font-weight: 500;
    margin: 0;
    line-height: 1;
    letter-spacing: 0.00625em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex;
    align-items: center;
    svg {
      margin-left: 0.5em;
      color: var(--color-primary);
    }
  }
  span {
    display: block;
    margin-top: 0.5em;
    font-size: 0.75em;
    letter-spacing: 0.025em;
    opacity: 0.5;
    line-height: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .is-inspected & {
    h3 {
      font-weight: 700;
      svg {
        color: inherit;
      }
    }
    span {
      opacity: 1;
      font-weight: 500;
    }
  }
`

const StyledContactListItemTags = styled.ul`
  /*padding: 0.125em 0.5em 0.375em;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: none;
  white-space: nowrap;
  user-select: none;
  cursor: default;
  &::-webkit-scrollbar {
    display: none;
  }
  */
 padding: 0;
 margin: 0;
  display: flex;
  flex-wrap: wrap;
`
const StyledContactListItemTagsItem = styled.li`
  display: flex;
  align-content: center;
  font-size: 0.75em;
  font-weight: 500;
  letter-spacing: 0.0125em;
  line-height: 1;
  padding: 0.375em 0.5em 0.3em;
  margin: 0 0.25em 0.25em 0;
  border-radius: calc(3*var(--border-radius));
  background-color: var(--color-off-white);
  ${props => props.color && css`
    background-color: ${props.color};
    color: var(--color-white);
  `}
`

const StyledContactListItemPoints = styled.ul`
  display: flex;
  list-style: none;
  margin: 0 0 0 auto;
  padding: 0;
  user-select: none;
  li {
    &:not(:last-child) {
      margin-right: 0.5em;
    }
    a {
      font-size: 0.75em;
      font-weight: 700;
      line-height: 1.45;
      padding: 0 0.375em;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 1.5em;
      min-width: 1.5em;
      text-align: center;
      border-radius: calc(2 * var(--border-radius));
      background-color: var(--color-gray);
      color: var(--color-white);
      text-transform: uppercase;
      svg {
        height: 12px;
        width: 12px;
        margin-left: 0.25em;
      }
      &.facebook {
        background-color: #4267B2;
        color: var(--color-white);
      }
      &.twitter {
        background-color: #1d9bf0;
        color: var(--color-white);
      }
      &.instagram {
        background-color: #C13584;
        color: var(--color-white);
      }
      &.linkedin {
        background-color: #0077B5;
        color: var(--color-white);
      }
    }
  }
`

export default ContactsListItem