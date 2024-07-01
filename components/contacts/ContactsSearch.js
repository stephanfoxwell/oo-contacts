import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { useContactsWorkspace } from './ContactsWorkspaceContext';

import TextField from '../ui/TextField';
import { PlusCircleIcon } from '@primer/octicons-react';

import Button, { ButtonText } from '../Button/index';
import Dropdown from '../ui/Dropdown';

const ContactsSearch = () => {

  const {
    filters,
    setFilters
  } = useContactsWorkspace();

  const [filterKey, setFilterKey] = useState(`email`)

  const [newFilterValue, setNewFilterValue] = useState(``)

  const [hasFilter, setHasFilter] = useState(false);

  const filterLabels = {
    company: `Company`,
    email: 'Email',
    first_name: `First name`,
    last_name: `Last name`,
    location:  `Location`,
    notes: `Notes`,
    phone: `Phone`,
    position: `Position`,
  };


  function handleAddFilter(e) {
    e.preventDefault();

    const updatedFilterValue = filters[filterKey] || [];

    if ( updatedFilterValue.includes(newFilterValue) ) {
      return;
    }
    else {
      updatedFilterValue.push(newFilterValue);
    }
    

    setFilters({[filterKey] : updatedFilterValue })
    setNewFilterValue(``)
  }

  function toggleKeywordsOperator() {
    const newOperator = filters.keywordsOperator === `and` ? `or` : `and`;
    setFilters({keywordsOperator: newOperator});
  };

  function hasActiveFilters() {
    let foundActiveFilter = false;
    Object.entries(filters).map(( filter ) => {
      if ( ! filter[0].match(/tags/i) && ! filter[0].match(/operator/i) && ! filter[0].match(/sort_/) && ! filter[0].match(/type/) && filter[1] && filter[1].length > 0 ) {
        foundActiveFilter = true;
        return;
      }
    });

    return foundActiveFilter;
    
  }

  useEffect(() => {
    if ( ! filters ) return;
    const foundActiveFilter = hasActiveFilters();
    return setHasFilter(foundActiveFilter);
  }, [filters])

  return (
    <StyledContactsFilters>
      <StyledContactsSearch onSubmit={(e) => handleAddFilter(e)}>
        <div>
          <Dropdown>
            <ButtonText as="summary"><span>{filterLabels[filterKey]}</span><Dropdown.Caret /></ButtonText>
            <Dropdown.Menu>
              {Object.entries(filterLabels).map(( item ) => {
                return (
                  <Dropdown.Item
                    key={`filter-label-${item[0]}`}
                  >
                    <span onClick={() => setFilterKey( item[0] )} className={item[0] === filterKey ? 'is-active' : undefined}>{item[1]}</span>
                  </Dropdown.Item>
                )
              })}
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <TextField 
          placeholder="Filter..."
          value={newFilterValue}
          onChange={(e) => setNewFilterValue(e.target.value)}
          autoComplete="off" 
          autoCorrect="off" 
          autoCapitalize="off"
          spellCheck="false"
          hasBorder={false}
          hasBorderRadiusTopLeft={false}
          hasBorderRadiusBottomLeft={false}
        />
        <button type="submit"><PlusCircleIcon /></button>
      </StyledContactsSearch>
      {hasFilter && (
        <StyledActiveFilters>
          <Button variant="tiny" onClick={() => toggleKeywordsOperator()} type="button">{(filters.keywordsOperator === 'or' || ! filters.keywordsOperator ) ? 'Any' : 'All'}</Button>
          <div>
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
          </div>
        </StyledActiveFilters>
      )}
    </StyledContactsFilters>
  );
};

export default ContactsSearch;

const StyledContactsFilters = styled.div`
  display: grid;
  grid-template: auto / auto 1fr;
  gap: 1em;
  width: 100%;
`;

const StyledContactsSearch = styled.form`
  position: relative;
  display: flex;
  align-items: center;
  width: 16em;
  display: grid;
  grid-template: auto / auto auto;
  border-radius: calc( 4 * var(--border-radius) );
  border: var(--border);
  > div:first-of-type {
    display: grid;
    place-items: center;
    height: 100%;
    border-right: var(--border);
  }
  > button {
    position: absolute;
    top: 0.8375em;
    right: 0.8375em;
    opacity: 0.5;
    transition: opacity 0.2s ease;
    border-right: var(--border);
  }
  .can-hover & > button:hover,
  > button:active {
    opacity: 1;
  }
`

const StyledActiveFilters = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background-color: var(--color-off-white);
  padding: 0.375em 0 0.375em 0.5em;
  border-radius: calc(4 * var(--border-radius));
  > div {
    white-space: nowrap;
    display: flex;
    padding: 0.375em 0.5em;
    padding: 0 0.5em;
    margin-left: 0.5em;
    width: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    -ms-overflow-style: none;
    scrollbar-width: none;
    scroll-behavior: smooth;
    user-select: none;
    border-left: var(--border);
    &::-webkit-scrollbar {
      display: none;
    }
    &:empty {
      display: none;
    }
  }
`

function FilterItem({ filterLabels, filter, value })  {

  const { filters, setFilters } = useContactsWorkspace();

  const handleRemoveFilter = () => {
    const currentFilterValue = filters[filter[0]];

    if ( Array.isArray(currentFilterValue) ) {
      setFilters({ [filter[0]]: currentFilterValue.filter(( item ) => item !== value) });
    }
  };

  return (
    <StyledFilterItem onClick={handleRemoveFilter}>
      <span>{filterLabels[filter[0]]}: {value}</span>
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
  border: 1px solid rgba(0,0,0,0.15);
  &:not(:last-of-type) {
    margin-right: 0.5em;
  }
  align-items: center;
  font-size: 0.875em;
  padding: 0em 0.5em 0.125em;
  .can-hover &:hover {
    color: var(--color-white);
    background-color: var(--color-caution);
  }
`