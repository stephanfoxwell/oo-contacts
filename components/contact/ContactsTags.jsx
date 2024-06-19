import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { useQuery, useQueryClient, useMutation } from 'react-query'
import { useWorkspace } from '@/components/contact/WorkspaceContext'
import FieldLabel from '@/components/ui/FieldLabel'
import TextField from '@/components/ui/TextField'
import Dialog from '@/components/ui/Dialog'
import Button, { ButtonText, ButtonPrimary } from '@/components/Button/index'
import {EyeIcon, EyeClosedIcon, InfoIcon, TagIcon, SyncIcon} from '@primer/octicons-react'
import randomColor from 'randomcolor'


async function fetchTags() {
  //console.log('fetch tags')
  const response = await fetch('/api/tags/')

  if ( ! response.ok )
    throw new Error("Network response was not ok")
  
  return response.json()
}

function ContactsTags() {

  const {
    filters,
    setFilters,
    setPageIndex
  } = useWorkspace()

  const [tags, setTags] = useState([])
  const [isEditMode, setIsEditMode] = useState(false)


  const {isSuccess, isLoading, isError, data, error } = useQuery('tags', fetchTags)
  /*
  useEffect(() => {
    setTags( data )
  }, [isSuccess])
  */
  useEffect(() => {
    if ( isSuccess ) {
      setTags( data )
    }
  }, [data])

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
    if ( filters?.includeTags?.includes(tag._id) || filters?.excludeTags?.includes(tag._id) ) {
      return true
    }
    return false
  }

  const activeTags = tags.filter(tag => tagIsActive(tag))

  return (
    <StyledContactTags hasActiveTags={activeTags.length > 0 ? true : undefined}>
      <StyledContactTagsHeader>
        <ButtonText onClick={toggleIncludeTagsOperator} variant="small">
          <EyeIcon /><span>{filters?.includeTagsOperator === 'and' ? 'All' : 'Any'}</span>
        </ButtonText>
        <ButtonText onClick={toggleExcludeTagsOperator} variant="small">
          <EyeClosedIcon /><span>{filters?.excludeTagsOperator === 'and' ? 'All' : 'Any'}</span>
        </ButtonText>
        {/*<ButtonText onClick={clearAllTags}>Clear</ButtonText>*/}
      </StyledContactTagsHeader>
      {activeTags?.length > 0 && (
        <StyledContactTagsActive>
          {activeTags?.map((tag) => (
            <TagItem 
              key={tag._id} 
              tag={tag}
              isEditMode={isEditMode}
              hideActiveBackground={true}
            />
          ))}
        </StyledContactTagsActive>
      )}
      <StyledContactTagItems>
        {tags?.map((tag) => <TagItem 
          key={tag._id} 
          tag={tag}
          isEditMode={isEditMode}
        />)}
      </StyledContactTagItems>
      <StyledContactTagsFooter>
        {isEditMode ? (
          <ButtonPrimary variant="small" onClick={() => setIsEditMode( ! isEditMode )}>Done</ButtonPrimary>
        ) : (
          <Button variant="small" onClick={() => setIsEditMode( ! isEditMode )}>Edit</Button>
        )}
        <div><span><TagIcon />{tags.length}</span></div>
      </StyledContactTagsFooter>
    </StyledContactTags>
  );
}

export default ContactsTags


const StyledContactTags = styled.aside`
  position: relative;
  border-right: var(--border-divider);
  border-right: 0;
  height: calc(100vh - var(--height-nav));
  user-select: none;
  -webkit-overflow-scrolling: touch;
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  background-color: var(--color-white);
  display: grid;
  grid-template: ${props => props.hasActiveTags ? 'auto auto 1fr auto / 1fr' : 'auto 1fr auto / 1fr'};
`

const StyledContactTagsHeader = styled.header`
  position: sticky;
  top: 0;
  z-index: 2;
  margin: 0 var(--padding-viewport);
  height: var(--height-titlebar);
  border-bottom: var(--border-divider);
  background-color: inherit;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.25em;
`

const StyledContactTagsActive = styled.ol`
  position: relative;
  padding: 1em 0;
  list-style: none;
  margin: 0 var(--padding-viewport);
  display: grid;
  grid-template: auto / 100%;
  border-bottom: var(--border-divider);
`
const StyledContactTagItems = styled.ol`
  position: relative;
  padding: 1em var(--padding-viewport);
  list-style: none;
  margin: 0;
  display: grid;
  grid-template: auto / 100%;
  -webkit-overflow-scrolling: touch;
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  &::after {
    content: '';
    display: block;
    height: 0.25em;
  }
`

const StyledContactTagsFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--height-titlebar);
  margin: 0 var(--padding-viewport);
  border-top: var(--border-divider);
  div {
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
  }
`


function TagItem({ tag, isEditMode, hideActiveBackground }) {

  const { filters, setFilters, setPageIndex } = useWorkspace()

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
      //setIsExclude(false)
      const newIncludeTags = filters.includeTags || []
      newIncludeTags.push( tagId )
      setFilters({ includeTags: newIncludeTags, })
    }
  }

  useEffect(() => {
    if ( typeof isActive !== 'undefined' ) {
      //console.log('init toggleActiveTag')
      toggleActiveTag( tag._id, isActive )
      //setPageIndex(1)
    }
  }, [isActive])
  
  useEffect(() => {
    if ( filters?.includeTags?.includes(tag._id) || filters?.excludeTags?.includes(tag._id) ) {
      //console.log('set to active')
      setIsActive(true)
      if ( filters?.excludeTags?.includes(tag._id) ) {
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
      toggleIncludeTag( tag._id, isExclude )
    }
  }, [isExclude])

  return (
    <>
    <StyledTagItem 
      className={showHint ? 'expanded' : undefined}
      active={isActive ? true : undefined}
      expanded={showHint ? true : undefined}
      title={tag.name}
      hideActiveBackground={hideActiveBackground || undefined}
    >
      {isEditMode ? (
        <strong onClick={() => setIsOpen(true)}>{tag.name}</strong>
      ) : (
        <>
          <strong onClick={(e) => setIsActive( ! isActive )}>{tag.name}</strong>
          <StyledTagActions className={isActive ? 'active' : undefined}>
            {tag?.description?.length > 0 && (
              <button className="note" type="button" onClick={() => setShowHint( ! showHint )}><InfoIcon /></button>
            )}
            {isActive && (
              <button type="button" onClick={() => setIsExclude( ! isExclude )}>
                {isExclude ? (
                  <EyeClosedIcon />
                ) : (
                  <EyeIcon />
                )}
              </button>
            )}
          </StyledTagActions>
          {showHint && (
            <p>{tag?.description}</p>
          )}
        </>
      )}
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
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    &:not(:last-of-type) {
      margin-bottom: 0.25em;
    }
  }
  ${props => props.active && css`
    strong {
      width: calc(100% - 4em);
    }
  `}
  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    top: 0;
    right: calc(-1 * (var(--padding-viewport) / 3));
    bottom: 0;
    left: calc(-1 * (var(--padding-viewport) / 3));
    background-color: var(--color-off-white);
    border-radius: calc(4* var(--border-radius));
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  .can-hover &:hover::before {
    opacity: 1;
  }
  ${props => ( ( props.active && ! props.hideActiveBackground ) || props.expanded ) && css`
    strong {
      color: var(--color-primary);
    }
  `}
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
  button:not(:last-of-type) {
    margin-right: 0.875em;
  }
  .note {
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  .can-hover ${StyledTagItem}:hover & .note,
  .expanded & .note {
    opacity: 1;
  }
  &.active,
  ${StyledTagItem}:hover &,
  .expanded & {
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