import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { useContactsWorkspace } from './ContactsWorkspaceContext'
import FieldLabel from '../ui/FieldLabel'
import TextField from '../ui/TextField'
import Dialog from '../ui/Dialog'
import Button, { ButtonText, ButtonPrimary, ButtonOutline } from '../Button/index'
import {EyeIcon, EyeClosedIcon, InfoIcon, TagIcon, SyncIcon} from '@primer/octicons-react'
import randomColor from 'randomcolor'

function ContactsActiveFilters() {
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


  const clearAllTags = () => {
    setFilters({
      includeTags: [],
      excludeTags: []
    })
  }


  return (
    <StyledContactsFilterBar hasActiveTags={hasActiveTags} className={hasActiveTags ? 'is-active' : undefined}>
      {hasActiveTags && (
        <>
          <div className="label">
            Active Tags:
          </div>
          <div className="filters">
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
          </div>
          <div className="actions">
            <ButtonOutline variant="small" onClick={clearAllTags}>Clear</ButtonOutline>
          </div>
        </>
      )}
    </StyledContactsFilterBar>
  );
}

export default ContactsActiveFilters;


const StyledContactsFilterBar = styled.div`
  position: relative;
  height: 2.5em;
  display: grid;
  //box-shadow: inset 0 0 0.25em -0.125em rgba(0,0,0,0.3);
  grid-template: 1fr / 6em 1fr 4em;
  padding: 0 1.5em;
  width: 100%;
  &:not(.is-active) {
    grid-template: 1fr / 1fr;
    align-items: center;
    &::before {
      content: "Selected tags will appear here...";
      font-size: 0.875em;
      font-style: italic;
      font-weight: 500;
    }
  }
  .label {
    font-size: 0.875em;
    font-weight: 700;
    position: relative;
    display: flex;
    align-items: center;
    &::after {
      content: "";
      position: absolute;
      top: 0.5em;
      bottom: 0.5em;
      right: 0;
      width: 1px;
      background-color: currentColor;
    }
  }
  .filters {
    display: flex;
    gap: 0.375em;
    width: 100%;
    max-width: 100%;
    display: flex;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
    padding-right: 1em;
    padding-left: 1em;
    &.is-active {
      display: flex;
    }
    > div {
      white-space: nowrap;
      display: flex;
      padding: 0.5em;
    }
  }
  .actions {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    &::after {
      content: "";
      position: absolute;
      top: 0.5em;
      bottom: 0.5em;
      left: 0;
      width: 1px;
      background-color: currentColor;
    }
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
        </>
    </StyledTagItem>
    </>
  )
}

const StyledTagItem = styled.div`
  position: relative;
  z-index: 1;
  display: inline-grid;
  align-items: center;
  gap: 0.375em;
  padding: 0 0.5em;
  border-radius: calc(4* var(--border-radius));
  border: 1px solid;
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
