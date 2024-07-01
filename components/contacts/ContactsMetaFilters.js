import React, { useEffect, useRef, useState } from "react";
import { useContactsWorkspace } from "./ContactsWorkspaceContext";


import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import styled from "styled-components";
import Tag from "../ui/Tag";
import { LockIcon, EyeIcon, ArrowUpIcon, ArrowDownIcon } from "@primer/octicons-react";

import Button, { ButtonText } from "../Button/index";
import RadioInput from "../ui/RadioInput";
import Dropdown from "../ui/Dropdown";


const ContactsMetaFilters = ({ theRecords, setPageMeta, inspectedContact, setInspectedContact }) => {
  
  const { filters, setFilters } = useContactsWorkspace();

  const [sortField, setSortField] = useState('last_name');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {

    if ( ! sortField || ! sortDirection ) return;

    setFilters({ sort_field: sortField, sort_direction: sortDirection })

  }, [sortField, sortDirection]);

  const sortFields = {
    organization: [
      { label: 'Name', value: 'name' },
      {label: 'Date Created', value: 'date_created'},
      {label: 'Date Updated', value: 'date_updated'},
    ],
    all: [
      {label: 'Last name', value: 'last_name'},
      {label: 'First name', value: 'first_name'},
      {label: 'Date Created', value: 'date_created'},
      {label: 'Date Updated', value: 'date_updated'},
    ],
    individual: [
      {label: 'Last name', value: 'last_name'},
      {label: 'First name', value: 'first_name'},
      {label: 'Date Created', value: 'date_created'},
      {label: 'Date Updated', value: 'date_updated'},
    ]
  };

  function getSortFieldLabelByValue(value) {
    return sortFields[filters?.type || 'all'].find(field => field.value === value)?.label;
  }

  useEffect(() => {
    if ( filters?.type === 'organization' ) {
      setSortField('name');
    }
    else {
      setSortField('last_name');
    }
  }, [filters?.type])
  
  return (
      <StyledContactsListMetaFilters>
        <div>
          <RadioInput
            label="All"
            name="type"
            value="all"
            currentValue={filters?.type || 'all'}
            onChange={(e) => setFilters({ type: undefined })}
          />
          <RadioInput
            label="People"
            name="type"
            value="individual"
            currentValue={filters?.type || 'all'}
            onChange={(e) => setFilters({ type: e.target.value })}
          />
          <RadioInput
            label="Orgs"
            name="type"
            value="organization"
            currentValue={filters?.type || 'all'}
            onChange={(e) => setFilters({ type: e.target.value })}
          />
        </div>
        <div>
          <span>Sort: </span>
          <Dropdown>
            <Button className="is-small" as="summary"><span>{getSortFieldLabelByValue(sortField)}</span><Dropdown.Caret /></Button>
            <Dropdown.Menu>
              {sortFields[filters?.type || 'individual'].map(field => (
                <Dropdown.Item key={`sort-${field.value}`}>
                  <span onClick={() => setSortField(field.value)} className={field.value === sortField ? 'is-active' : undefined}>{field.label}</span>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          {/*
          <select name="sort_field" value={sortField} onChange={(e) => setSortField(e.target.value) }>
            {sortFields[filters?.type || 'individual'].map(field => (
              <option key={field.value} value={field.value}>{field.label}</option>
            ))}
          </select>
          */}
          <Button className="is-small" onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}>{sortDirection === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon /> }</Button>
          {/*}
          <select name="sort_direction" value={sortDirection} onChange={(e) => setSortDirection(e.target.value)} >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
          */}
        </div>
      </StyledContactsListMetaFilters>
  );
};

export default ContactsMetaFilters;

const StyledContactsListMetaFilters = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  > div {
    display: flex;
    gap: 0.5em;
    align-items: center;
    > span:first-of-type {
      font-size: 0.75em;
      font-weight: 500;
      opacity: 0.7;
    }
  }
`;
