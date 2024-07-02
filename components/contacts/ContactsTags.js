import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { useContactsWorkspace } from './ContactsWorkspaceContext'
import FieldLabel from '../ui/FieldLabel'
import TextField from '../ui/TextField'
import Dialog from '../ui/Dialog'
import Button, { ButtonText, ButtonPrimary } from '../Button/index'
import {EyeIcon, EyeClosedIcon, InfoIcon, TagIcon, SyncIcon, LockIcon} from '@primer/octicons-react'
import randomColor from 'randomcolor';

import fetchTags from '../../utils/fetchTagsAlt'


import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Radio } from '@primer/react'
import RadioInput from '../ui/RadioInput'

const ContactsStructuredFilters = () => {

  const [activeList, setActiveList] = useState('tags');

  const [listSearchValue, setListSearchValue] = useState('');

  return (
    <StyledContactsStructuredFilters>
      {/*<div>
        <Button variant="small" onClick={() => setActiveList('tags')} active={activeList === 'tags' ? true : undefined}>Tags</Button>
        <Button variant="small" onClick={() => setActiveList('organizations')} active={activeList === 'organizations' ? true : undefined}>Orgs</Button>
        <Button variant="small" onClick={() => setActiveList('countries')} active={activeList === 'countries' ? true : undefined}>Countries</Button>
      </div>*/}
      {activeList === 'tags' && (
        <ContactsTags />
      )}
      {activeList === 'organizations' && (
        <ContactsOrganizations />
      )}
    </StyledContactsStructuredFilters>
  )

};

export default ContactsStructuredFilters;

const StyledContactsStructuredFilters = styled.div`
  position: relative;
  height: 100%;
  user-select: none;
  display: grid;
  grid-template: auto 1fr / 1fr;
`;

function ContactsTags() {
  const { filters, setFilters, setPageIndex, tags, setTags } = useContactsWorkspace();
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    data,
    error,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ['tags'], 
    queryFn: fetchTags
  });

  useEffect(() => {
    console.log("useEffect data", data);
    if ( isSuccess ) setTags(data.data);
  }, [data]);

  const [theTags, setTheTags] = useState(tags || []);

  useEffect(() => {
    setTheTags(tags)
  }, [tags])

  function toggleIncludeTagsOperator() {
    const newOperator = filters.includeTagsOperator === `and` ? `or` : `and`
    setFilters({includeTagsOperator: newOperator});
  }
  function toggleExcludeTagsOperator() {
    const newOperator = filters.excludeTagsOperator === `and` ? `or` : `and`
    setFilters({excludeTagsOperator: newOperator})
  }

  const clearAllTags = () => {
    setFilters({
      includeTags: [],
      excludeTags: []
    })
  }

  const tagIsActive = (tag) => {
    if ( filters?.includeTags?.includes(tag.id) || filters?.excludeTags?.includes(tag.id) ) {
      return true
    }
    return false
  }

  const activeTags = theTags?.filter(tag => tagIsActive(tag)) || [];

  const activeIncludeTags = theTags?.filter(tag => filters?.includeTags?.includes(tag.id)) || [];
  const activeExcludeTags = theTags?.filter(tag => filters?.excludeTags?.includes(tag.id)) || [];

  const [searchedTags, setSearchedTags] = useState(theTags);
  const [tagsSearchValue, setTagsSearchValue] = useState('');

  useEffect(() => {
    console.log("useEffect tagsSearchValue", tagsSearchValue);
    if (tagsSearchValue.length > 0) {
      setSearchedTags(theTags.filter(tag => tag.name.toLowerCase().includes(tagsSearchValue.toLowerCase())))
    }
    else {
      setSearchedTags(theTags)
    }
  }, [tagsSearchValue, theTags]);

  /*
  useEffect(() => {
    if ( ! tags || ! tags.length ) return;
    console.log("useEffect tags", tags);
    if (tagsSearchValue.length === 0) {
      setSearchedTags(tags)
    }
  }, [tags]);
  */

  return (
    <StyledContactTags hasActiveTags={activeTags.length > 0 ? true : undefined}>
      {/*<StyledContactTagsHeader>
        <ButtonText onClick={toggleIncludeTagsOperator} variant="small">
          <EyeIcon /><span>{filters?.includeTagsOperator === 'and' ? 'All' : 'Any'}</span>
        </ButtonText>
        <ButtonText onClick={toggleExcludeTagsOperator} variant="small">
          <EyeClosedIcon /><span>{filters?.excludeTagsOperator === 'and' ? 'All' : 'Any'}</span>
        </ButtonText>
        {/*<ButtonText onClick={clearAllTags}>Clear</ButtonText>*
      </StyledContactTagsHeader>*/}
      {/*activeTags?.length > 0 && (
        <StyledContactTagsActive>
          {activeIncludeTags?.length > 0 && (
            <div>
              <strong>With <Button variant="tiny" onClick={toggleIncludeTagsOperator}>{filters?.includeTagsOperator === 'and' ? 'All' : 'Any'}</Button> Tags</strong>
              <ol>
                {activeIncludeTags?.map((tag) => (
                  <TagItem 
                    key={tag.id} 
                    tag={tag}
                    isEditMode={isEditMode}
                    hideActiveBackground={true}
                  />
                ))}
              </ol>
            </div>
          )}
          {activeExcludeTags?.length > 0 && (
            <div>
              <strong>Without <Button variant="tiny" onClick={toggleExcludeTagsOperator} >{filters?.excludeTagsOperator === 'and' ? 'All' : 'Any'}</Button> Tags</strong>
              <ol>
                {activeExcludeTags?.map((tag) => (
                  <TagItem 
                    key={tag.id} 
                    tag={tag}
                    isEditMode={isEditMode}
                    hideActiveBackground={true}
                  />
                ))}
              </ol>
            </div>
          )}
        </StyledContactTagsActive>
)*/}
      <StyledContactTagsHeader>
        <TextField 
          placeholder="Filter tags..."
          value={tagsSearchValue}
          onChange={(e) => setTagsSearchValue(e.target.value)}
          autoComplete="off" 
          autoCorrect="off" 
          autoCapitalize="off"
          spellCheck="false"
        />
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
        {/*isEditMode ? (
          <ButtonPrimary variant="small" onClick={() => setIsEditMode( ! isEditMode )}>Done</ButtonPrimary>
        ) : (
          <Button variant="small" onClick={() => setIsEditMode( ! isEditMode )}>Edit</Button>
        )*/}
        {/*<div><span><TagIcon />{theTags.length}</span></div>*/}
      </StyledContactTagsFooter>
    </StyledContactTags>
  );
}


const StyledContactTags = styled.div`
  position: relative;
  border-right: var(--border-divider);
  border-right: 0;
  height: calc(100vh - 2.5em);
  user-select: none;
  background-color: var(--color-white);
  display: grid;
  grid-template: ${props => props.hasActiveTags ? 'auto auto 1fr auto / 1fr' : 'auto 1fr auto / 1fr'};
`

const StyledContactTagsHeader = styled.header`
  position: sticky;
  top: 0;
  z-index: 2;
  margin: 0 var(--padding-viewport);
  border-bottom: var(--border-divider);
  background-color: inherit;
  padding: 1em 0;
`

const StyledContactTagsActive = styled.div`
  position: relative;
  padding: 1em 0;
  list-style: none;
  margin: 0 var(--padding-viewport);
  display: grid;
  grid-template: auto / 100%;
  border-bottom: var(--border-divider);
  gap: 0.75em;
  padding: 0.75em;
  background-color: var(--color-off-white);
  border-radius: calc(4* var(--border-radius));
  > div {
    &:not(:last-of-type) {
      padding-bottom: 0.75em;
      border-bottom: var(--border-divider);
    }
    > strong {
      font-size: 0.75em;
      line-height: 1;
      display: block;
      margin-bottom: 0.75em;
    }
  }
  ol {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.375em;
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
  //display: flex;
  //align-items: center;
  //justify-content: space-between;
  //height: var(--height-titlebar);
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
  /*div {
    display: flex;
    align-items: center;
    span {
      font-size: 0.8125em;
      letter-spacing: 0.025em;
      opacity: 0.7;
      &:not(:last-of-type) {
        margin-right: 1em;
      }
      svg {
        margin-right: 0.25em;
      }
    }
  }*/
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
        </>
    </StyledTagItem>
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
  .can-hover ${StyledTagListItem}:hover & .note,
  .is-expanded & .note {
    opacity: 1;
  }
  &.active,
  ${StyledTagListItem}:hover &,
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