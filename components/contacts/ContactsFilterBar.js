import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { useContactsWorkspace } from './ContactsWorkspaceContext'
import FieldLabel from '../ui/FieldLabel'
import TextField from '../ui/TextField'
import Dialog from '../ui/Dialog'
import Button, { ButtonText, ButtonPrimary } from '../Button/index'
import {EyeIcon, EyeClosedIcon, InfoIcon, TagIcon, SyncIcon} from '@primer/octicons-react'
import randomColor from 'randomcolor'

function ContactsFilterBar() {
  const { filters, setFilters, setPageIndex, tags, setTags } = useContactsWorkspace();

  const tagIsActive = (tag) => {
    if ( filters?.includeTags?.includes(tag.id) || filters?.excludeTags?.includes(tag.id) ) {
      return true
    }
    return false
  }

  const activeTags = tags?.filter(tag => tagIsActive(tag)) || [];

  const activeIncludeTags = tags?.filter(tag => filters?.includeTags?.includes(tag.id)) || [];
  const activeExcludeTags = tags?.filter(tag => filters?.excludeTags?.includes(tag.id)) || [];

  const filterLabels = {
    company: `Company`,
    email: 'Email',
    first_name: `First name`,
    last_name: `Last name`,
    location:  `Location`,
    notes: `Notes`,
    phone: `Phone`,
  };

  const [hasActiveTags, setHasActiveTags] = useState(activeTags.length > 0 ? true : undefined);

  useEffect(() => {
    setHasActiveTags(activeTags.length > 0 ? true : undefined)
  }, [activeTags])


  return (
    <StyledContactsFilterBar hasActiveTags={hasActiveTags} className={hasActiveTags ? 'is-active' : undefined}>
      <div>
        
      {activeTags?.length > 0 && (
        <StyledContactTagsActive>
          {activeTags?.length > 0 && (
            <>
              {activeTags.map((tag) => (
                <TagItem 
                  key={tag.id} 
                  tag={tag}
                />
              ))}
            </>
          )}
        </StyledContactTagsActive>
      )}
      </div>
      {/*
         <StyledContactTagsActive>
         {Object.entries(filters).map(( filter ) => {
           return (
             ! filter[0].match(/tags/i) && ! filter[0].match(/operator/i) && ! filter[0].match(/sort_/) && ! filter[0].match(/type/) && filter[1]
             ?
             <>
                {filter[1].map(( value ) => (
                  <FilterItem filterLabels={filterLabels} filter={filter} value={value} />
                ))}
             </>
             
             :
             <></>
           )
         })}
       </StyledContactTagsActive>
       */}
    </StyledContactsFilterBar>
  );
}

export default ContactsFilterBar;


const StyledContactsFilterBar = styled.div`
  position: relative;
  background-color: var(--color-off-white);
  border-radius: calc(6 * var(--border-radius));
  height: 2.5em;
  align-items: center;
  display: flex;
  gap: 0.375em;
  //box-shadow: inset 0 0 0.25em -0.125em rgba(0,0,0,0.3);
  width: 100%;
  max-width: 100%;
  display: flex;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  &.is-active {
    display: flex;
  }
  > div {
    white-space: nowrap;
    display: flex;
    padding: 0.5em;
  }
`


const StyledContactTagsActive = styled.div`
  position: relative;
  display: inline-flex;
  gap: 0.375em;
`

function FilterItem({ filterLabels, filter, value })  {

  const { filters, setFilters } = useContactsWorkspace();

  const handleRemoveFilter = () => {
    const currentFilterValue = filters[filter[0]];

    if ( Array.isArray(currentFilterValue) ) {
      setFilters({ [filter[0]]: currentFilterValue.filter(( item ) => item !== value) })
    }
  }

  return (
    <StyledFilterItem onClick={handleRemoveFilter}>
      <small>{filterLabels[filter[0]]}</small>
      <span>{value}</span>
    </StyledFilterItem>
  )
}
const StyledFilterItem = styled.div`
  position: relative;
  display: flex;
  background-color: var(--color-white);
  border-radius: var(--border-radius-button);
  height: auto;
  cursor: pointer;
  padding: 0.125em;
  &:not(:last-of-type) {
    margin-right: 0.5em;
  }
  align-items: center;
  font-size: 0.875em;
  padding: 0em 0.5em 0.125em;
  height: 2.5em;
  border: var(--border-divider);
  display: grid;
  align-items: start;
  small {
    display: block;
    font-size: 0.6875em;
    font-weight: 600;
    text-transform: lowercase;
    letter-spacing: 0.025em;
    background-color: black;
    color: white;
    padding: 0.125em 0.25em;
    line-height: 1;
    border-radius: calc(2 * var(--border-radius));
    top: -0.5em;
  }
  .can-hover &:hover {
    color: var(--color-white);
    background-color: var(--color-caution);
  }
`


function TagItem({ tag, hideActiveBackground }) {

  const { filters, setFilters, setPageIndex } = useContactsWorkspace()

  const [showHint, setShowHint] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const [isActive, setIsActive] = useState(undefined)
  const [isExclude, setIsExclude] = useState(undefined)

  function toggleActiveTag( tagId, active ) {
    if ( ! active ) {
      setFilters({
        includeTags: (filters.includeTags || []).filter(( id ) => id !== tagId),
        excludeTags: (filters.excludeTags || []).filter(( id ) => id !== tagId)
      })
    }
    else {
      const newIncludeTags = filters.includeTags || [];
      if ( ! newIncludeTags.includes(tagId) ) {
        newIncludeTags.push( tagId );
        setFilters({ includeTags: newIncludeTags, });
      }
    }
  }

  useEffect(() => {
    if ( typeof isActive !== 'undefined' ) {
      console.log('init toggleActiveTag')
      toggleActiveTag( tag.id, isActive )
      //setPageIndex(1)
    }
  }, [isActive])
  
  useEffect(() => {
    if ( filters?.includeTags?.includes(tag.id) || filters?.excludeTags?.includes(tag.id) ) {
      //console.log('set to active')
      setIsActive(true)
      if ( filters?.excludeTags?.includes(tag.id) ) {
        setIsExclude(true)
      }
      else {
        setIsExclude(false)
      }
    }
    else if ( isActive ) {
      setIsActive(false)
    }
  }, [filters])

  const toggleIncludeTag = ( tagId, exclude = false ) => {

    let newIncludeTags = filters.includeTags || []
    let newExcludeTags = filters.excludeTags || []
    
    if ( ! exclude ) {
      if ( ! newIncludeTags.some(elem => elem === tagId ) ) {
        newIncludeTags.push( tagId );
      }

      if ( newExcludeTags.some(elem => elem === tagId ) ) {
        newExcludeTags = newExcludeTags.filter(function(value, index, arr){ 
          return value !== tagId;
        });
      }
    }
    else {
      if ( ! newExcludeTags.some(elem => elem === tagId ) ) {
        newExcludeTags.push( tagId );
      }
      if ( newIncludeTags.some(elem => elem === tagId ) ) {
        newIncludeTags = newIncludeTags.filter(function(value, index, arr){ 
          return value !== tagId;
        });
      }
    }
    setFilters({ includeTags: newIncludeTags, excludeTags: newExcludeTags })
  }
  
  useEffect(() => {
    if ( typeof isExclude !== 'undefined' ) {
      toggleIncludeTag( tag.id, isExclude )
    }
  }, [isExclude]);

  const getClassName = () => {
    const classNames = [];
    if ( isActive ) {
      classNames.push('is-active');
    }
    if ( showHint ) {
      classNames.push('is-expanded');
    }
    return classNames.join(' ');
  }

  return (
    <>
    <StyledTagItem 
      className={getClassName()}
      active={isActive ? true : undefined}
      expanded={showHint ? true : undefined}
      title={tag.name}
      hideActiveBackground={hideActiveBackground || undefined}
    >
        <>
          {isActive && (
            <button type="button" onClick={() => setIsExclude( ! isExclude )}>
              {isExclude ? (
                <EyeClosedIcon />
              ) : (
                <EyeIcon />
              )}
            </button>
          )}
          <strong onClick={(e) => setIsActive( ! isActive )}>{tag.name}</strong>
          {/*<span>{tag.contacts_count}</span>*/}
          <StyledTagActions className={isActive ? 'active' : undefined}>
            {tag?.description?.length > 0 && (
              <button className="note" type="button" onClick={() => setShowHint( ! showHint )}><InfoIcon /></button>
            )}
          </StyledTagActions>
          {showHint && (
            <p>{tag?.description}</p>
          )}
        </>
    </StyledTagItem>
      <Dialog isOpen={isOpen} setIsOpen={setIsOpen}>
        <TagForm tag={tag} setIsOpen={setIsOpen} />
      </Dialog>
    </>
  )
}

const StyledTagItem = styled.li`
  position: relative;
  z-index: 1;
  display: inline-grid;
  align-items: center;
  gap: 0.375em;
  padding: 0 0.5em;
  border-radius: calc(4* var(--border-radius));
  //box-shadow: 0 0.0625em 0.25em -0.125em rgba(0,0,0,0.3);
  border: 1px solid rgba(0,0,0,0.15);
  font-size: 0.875em;
  &.is-active {
    grid-template: auto / auto 1fr;
  }
  button:first-of-type {
    align-self: center;
    border-right: var(--border-divider);
    padding-right: 0.5em;
  }
  strong {
    position: relative;
    display: block;
    font-size: 0.8125em;
    font-weight: 500;
    padding: 0.4em 0 0.375em 0;
    text-align: left;
    width: 100%;
    line-height: 1.4;
    border-radius: 0;
    white-space: nowrap;
    cursor: pointer;
  }
  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: var(--color-off-white);
    border-radius: inherit;
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  &.is-active {
    background-color: white;
    strong {
      font-weight: 600;
    }
    &::before {
      opacity: 0;
    }
  }
  .can-hover &:hover::before {
    opacity: 1;
  }
  span {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  p {
    font-size: 0.75em;
    margin: 0.125em 0 0.75em;
    line-height: 1.4;
    border-top: var(--border-divider);
    border-color: var(--color-white);
    padding-top: 0.5em;
  }
`

const StyledTagActions = styled.div`
  position: absolute;
  top: 0.4em;
  right: 0.125em;
  opacity: 0;
  transition: opacity 0.2s ease;
  display: flex;
  align-items: center;
  display: none;
  button:not(:last-of-type) {
    margin-right: 0.875em;
  }
  .note {
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  .can-hover ${StyledTagItem}:hover & .note,
  .is-expanded & .note {
    opacity: 1;
  }
  &.active,
  ${StyledTagItem}:hover &,
  .is-expanded & {
    opacity: 1;
  }
  .can-hover & button:hover,
  button:active {
    opacity: 0.5;
  }
`


export async function postTag( data ) {
  
  const response = await fetch('/api/tags', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if ( ! response.ok )
    throw new Error("Network response was not ok")
    
  return response.json()
}

function TagForm( props ) {

  const [tag, setTag] = useState(props.tag)

  const updateTag = ( update ) => {
    setTag({...tag, ...update })
  }

  const generateColors = () => {
    const newColors = []
    for ( let i = 0; i < 17; i ++ ) {
      newColors.push(randomColor())
    }
    return newColors
  }

  const [colors, setColors] = useState(generateColors)

  const queryClient = useQueryClient()

  const mutation = useMutation(postTag, {
    onSuccess: () => {
      queryClient.invalidateQueries('tags')
      queryClient.invalidateQueries('contacts')
      props.setIsOpen(false)
    },
  })

  return (
    <StyledFormset>
      <div>
        <FieldLabel htmlFor="tagName">Name</FieldLabel>
        <TextField
          id="tagName"
          type="text"
          value={tag?.name}
          onChange={(e) => updateTag({ name: e.currentTarget.value })}
        />
      </div>
      <div>
        <FieldLabel htmlFor="tagDescription">Description</FieldLabel>
        <TextField
          id="tagDescription"
          as="textarea"
          type="text"
          value={tag?.description}
          rows="5"
          onChange={(e) => updateTag({ description: e.currentTarget.value })}
        />
      </div>
      <div>
        <FieldLabel htmlFor="tagColor">Color (hex value)</FieldLabel>
        <StyledColorField color={tag?.color || undefined}>
          <TextField
            id="tagColor"
            type="text"
            value={tag?.color}
            onChange={(e) => updateTag({ color: e.currentTarget.value })}
          />
          {tag?.color &&
            <i />
          }
        </StyledColorField>
        <StyledColorOptions>
          {colors.map(color => (
            <StyledColorOption 
              color={color} 
              onClick={(e) => updateTag({ color: color })}
            />
          ))}
          <StyledColorOption onClick={(e) => setColors(generateColors())}><SyncIcon /></StyledColorOption>
        </StyledColorOptions>
      </div>
      <div>
        <Button onClick={() => mutation.mutate(tag)}>Save</Button>
      </div>
    </StyledFormset>
  )
}

const StyledFormset = styled.div`
  display: grid;
  grid-template: auto / 1fr;
  grid-gap: 1em;
`
const StyledColorField = styled.div`
  position: relative;
  i {
    position: absolute;
    display: block;
    left: 0.5em;
    top: 0.45em;
    height: 1.25em;
    width: 1.25em;
    background-color: ${props => props.color};
    border-radius: calc(2.5 * var(--border-radius));
  }
  input {
    padding-left: 2.75em;
  }
`
const StyledColorOptions = styled.div`
  display: grid;
  grid-template: auto / repeat(9, 1fr);
  grid-gap: 0.375em;
  margin-top: 0.75em;
`
const StyledColorOption = styled.button`
  position: relative;
  display: block;
  background-color: ${props => props.color};
  &::before {
    content: '';
    display: block;
    padding-bottom: 100%;
  }
  svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%,-50%,0);
  }
`