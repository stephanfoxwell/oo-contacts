import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { useContactsWorkspace } from './ContactsWorkspaceContext'
import FieldLabel from '../ui/FieldLabel'
import TextField from '../ui/TextField'
import Dialog from '../ui/Dialog'
import Button, { ButtonText, ButtonPrimary } from '../Button/index'
import {EyeIcon, EyeClosedIcon, InfoIcon, TagIcon, SyncIcon, LockIcon, XCircleIcon} from '@primer/octicons-react'
import randomColor from 'randomcolor';

import fetchTags from '../../utils/fetchTagsAlt'


import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import RadioInput from '../ui/RadioInput'
import { use } from 'passport'



function ContactsTags() {
  const { filters, setFilters, tags } = useContactsWorkspace();
  const [isEditMode, setIsEditMode] = useState(false);

  const [searchedTags, setSearchedTags] = useState(tags);
  const [tagsSearchValue, setTagsSearchValue] = useState('');

  const [theTags, setTheTags] = useState([]);

  useEffect(() => {
    if ( tags && tags.length > 0 ) {
      setTheTags(tags)
    }
  }, [tags])

  useEffect(() => {
    console.log("useEffect tagsSearchValue", tagsSearchValue);
    if (tagsSearchValue.length > 0) {
      setSearchedTags(theTags.filter(tag => tag.name.toLowerCase().includes(tagsSearchValue.toLowerCase())))
    }
    else {
      setSearchedTags(theTags)
    }
  }, [tagsSearchValue, theTags]);


  const [tagFormIsOpen, setTagFormIsOpen] = useState(false);

  return (
    <StyledContactTags>
      <StyledContactTagsHeader>
        <div>
          <TextField 
            placeholder="Filter tags..."
            value={tagsSearchValue}
            onChange={(e) => setTagsSearchValue(e.target.value)}
            autoComplete="off" 
            autoCorrect="off" 
            autoCapitalize="off"
            spellCheck="false"
          />
          {tagsSearchValue.length > 0 && (
            <button type="button" onClick={() => setTagsSearchValue('')}><XCircleIcon /></button>
          )}
        </div>
      </StyledContactTagsHeader>
      <StyledContactTagItems>
        {searchedTags?.map((tag) => <TagListItem 
          key={tag.id} 
          tag={tag}
          isEditMode={isEditMode}
        />)}
      </StyledContactTagItems>
      <StyledContactTagsFooter>

        <div className="options">
          <label>Match:</label>
          <RadioInput 
            label="All"
            name="tags-operator"
            value="and"
            currentValue={filters.includeTagsOperator || 'and'}
            onChange={(e) => setFilters({ includeTagsOperator: e.target.value })}
          />
          <RadioInput
            label="Any"
            name="tags-operator"
            value="or"
            currentValue={filters.includeTagsOperator || 'and'}
            onChange={(e) => setFilters({ includeTagsOperator: e.target.value })}
          />
        </div>
        {/*<div className="admin">
          <Button variant="small">Create</Button>

          <Dialog isOpen={tagFormIsOpen} setIsOpen={setTagFormIsOpen}>
            <TagForm setIsOpen={setTagFormIsOpen} />
          </Dialog>
          {isEditMode ? (
            <ButtonPrimary variant="small" onClick={() => setIsEditMode( ! isEditMode )}>Done</ButtonPrimary>
          ) : (
            <Button variant="small" onClick={() => setIsEditMode( ! isEditMode )}>Edit</Button>
          )}
        </div>*/}
      </StyledContactTagsFooter>
    </StyledContactTags>
  );
};

export default ContactsTags;


const StyledContactTags = styled.div`
  position: relative;
  border-right: var(--border-divider);
  border-right: 0;
  height: calc(100vh - 2.5em);
  user-select: none;
  background-color: var(--color-white);
  display: grid;
  grid-template: auto 1fr auto / 1fr;
`

const StyledContactTagsHeader = styled.header`
  position: sticky;
  top: 0;
  z-index: 2;
  margin: 0 var(--padding-viewport);
  border-bottom: var(--border-divider);
  background-color: inherit;
  padding: 1em 0;
  > div {
    position: relative;
    button {
      position: absolute;
      top: 0.87em;
      right: 0.5em;
      z-index: 1;
    }
  }
`

const StyledContactTagItems = styled.ol`
  position: relative;
  padding: 1em;
  list-style: none;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25em;
  height: 100%;
  -webkit-overflow-scrolling: touch;
  overflow: auto;
  &::after {
    content: '';
    display: block;
    height: 0.25em;
  }

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
`

const StyledContactTagsFooter = styled.div`
  margin: 0 var(--padding-viewport);
  border-top: var(--border-divider);
  margin-top: auto;
  padding: 1em 0;
  .options {
    display: flex;
    gap: 0.5em;
    align-items: center;
    label:first-of-type {
      font-size: 0.875em;
      margin: 0;
      font-weight: 500;
    }
  }
  .admin {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: var(--border-divider);
    padding-top: 0.5em;
    margin-top: 0.5em;
  }
`

function TagListItem({ tag, isEditMode, hideActiveBackground }) {

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
    console.log("useEffect isActive", isActive);
    if ( typeof isActive !== 'undefined' ) {
      toggleActiveTag( tag.id, isActive )
      //setPageIndex(1)
    }
  }, [isActive])
  
  useEffect(() => {
    console.log("useEffect filters", filters);
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
    <StyledTagListItem 
      className={getClassName()}
      active={isActive ? true : undefined}
      expanded={showHint ? true : undefined}
      title={`${tag.name}${tag?.description ? `: ${tag.description}` : ''}`}
      hideActiveBackground={hideActiveBackground || undefined}
    >
      {isEditMode ? (
        <strong onClick={() => setIsOpen(true)}>{tag.name}</strong>
      ) : (
        <>
          {/*isActive && (
            <button type="button" onClick={() => setIsExclude( ! isExclude )}>
              {isExclude ? (
                <EyeClosedIcon />
              ) : (
                <EyeIcon />
              )}
            </button>
          )*/}
          <div>
            <strong onClick={(e) => setIsActive( ! isActive )}>
              
            {tag.is_restricted && (
              <LockIcon />
            )}
            <span>{tag.name}</span>
            </strong>
           
            {isActive ? (
            <button type="button" onClick={() => setIsExclude( ! isExclude )}>
              {isExclude ? (
                <EyeClosedIcon />
              ) : (
                <EyeIcon />
              )}
            </button>
            ) : (
              <span className="tag-count">{tag.contacts_count}</span>
            )}
          </div>
          {/*<StyledTagActions className={isActive ? 'active' : undefined}>
            {tag?.description?.length > 0 && (
              <button className="note" type="button" onClick={() => setShowHint( ! showHint )}><InfoIcon /></button>
            )}
          </StyledTagActions>*/}
          {isActive && tag?.description && (
            <p>{tag?.description}</p>
          )}
        </>
      )}
    </StyledTagListItem>
      <Dialog isOpen={isOpen} setIsOpen={setIsOpen}>
        <TagForm tag={tag} setIsOpen={setIsOpen} />
      </Dialog>
    </>
  )
}

const StyledTagListItem = styled.li`
  position: relative;
  z-index: 1;
  button:first-of-type {
    //border-left: var(--border-divider);
    //padding-left: 0.5em;
      background-color: var(--color-primary);
      color: var(--color-white);
      border-radius: calc(4 * var(--border-radius));
      padding: 0 0.5em;
  }
  > div {
    display: flex;
    gap: 0.25em;
  }
  strong {
    position: relative;
    display: block;
    font-size: 0.8125em;
    font-weight: 500;
    text-align: left;
    width: 100%;
    line-height: 1.4;
    border-radius: 0;
    white-space: nowrap;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0.375em 0.5em;
    border-radius: calc(4* var(--border-radius));
    span:not(:first-child) {
      margin-left: 0.25em;
    }
  }
  &.is-active {
    strong {
      font-weight: 600;
      background-color: var(--color-primary);
      color: var(--color-white);
    }
    &::before {
      opacity: 1;
    }
  }
  .can-hover &:hover::before {
    opacity: 1;
  }
  .tag-count {
    display: block;
    font-size: 0.6875em;
    font-weight: 700;
    padding: 0.125em 0.25em;
    line-height: 1;
    align-self: center;
    border-radius: calc(2 * var(--border-radius));
    background-color: var(--color-off-white);
  }
  p {
    font-size: 0.75em;
    margin: 0.25em 0 0;
    line-height: 1.4;
    grid-template-columns: 1 / span 2;
    font-style: italic;
    text-indent: -0.4em;
    padding-left: 0.4em;

    display: none;
    &::before {
      content: "-";
    }
  }
`

export async function postTag( data ) {

  const method = data.id ? 'PATCH' : 'POST'
  
  const response = await fetch('/api/tags', {
    method: method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if ( ! response.ok )
    throw new Error("Network response was not ok")
    
  return response.json()
}

function TagForm( props ) {

  const [tag, setTag] = useState(props.tag || {})

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

  const [colors, setColors] = useState(generateColors);

  const queryClient = useQueryClient();

  const [savingState, setSavingState] = useState('Save');

  const mutation = useMutation({
    mutationFn: postTag,
    onMutate: () => {
      setSavingState('Saving')
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['contacts', 'tags', 'organizations']);
      setSavingState('Saved');
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
        <Button onClick={() => mutation.mutate(tag)}>{savingState}</Button>
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