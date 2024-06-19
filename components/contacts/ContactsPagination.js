import React, { useState, useEffect } from 'react'
import styled from 'styled-components';

import { useContactsWorkspace } from './ContactsWorkspaceContext';

import Button from '../Button/index'
import TextField from '../ui/TextField'

import { ChevronLeftIcon, ChevronRightIcon, PersonIcon, FileIcon } from '@primer/octicons-react'


const ContactsPagination = ({ pageMeta }) => {
  
  const {
    filters,
    pageIndex,
    setPageIndex,
  } = useContactsWorkspace()


  const [perPage, setPerPage] = useState(pageMeta?.limit ? pageMeta.limit : 100)

  const isSingle = ( number ) => {
    return new Intl.NumberFormat().format(1) !== new Intl.NumberFormat().format(number) ? false : true
  }

  const pluralize = ( number ) => {
    return ! isSingle( number ) ? `s` : ``
  }

  const currentRecordsCount = pageMeta && pageMeta.filter_count ? new Intl.NumberFormat().format(pageMeta.filter_count) : 0;
  const currentPagesCount = pageMeta && pageMeta.filter_count ? new Intl.NumberFormat().format( Math.ceil( pageMeta.filter_count / perPage ) ) : 0;

  const hasNextPage = pageMeta.filter_count < pageMeta.page * perPage ? false : true;
  const hasPreviousPage = pageMeta.page > 1 ? true : false;

  return (
    <StyledContactsPagination>
      {pageMeta?.filter_count > 0 ?
        <div><span><PersonIcon />{currentRecordsCount}</span> <span><FileIcon />{currentPagesCount}</span></div>
        :
        <div>No results</div>
      }
      <Button 
        type="button"
        onClick={() => setPageIndex(pageIndex - 1)}
        disabled={hasPreviousPage ? undefined : `disabled`}
        title="Previous page"
      ><ChevronLeftIcon /></Button>
      <TextField 
        type="number"
        min="1"
        max={pageMeta ? currentPagesCount : undefined}
        disabled={currentPagesCount === 1 ? 'disabled' : undefined}
        value={pageIndex}
        onChange={(e) => setPageIndex( parseInt( e.target.value, 10) )}
      />
      <Button
        type="button"
        onClick={() => setPageIndex(pageIndex + 1)}
        disabled={hasNextPage ? undefined : `disabled`}
        title="Next page"
      ><ChevronRightIcon /></Button>
    </StyledContactsPagination>
  )
}

export default ContactsPagination;

const StyledContactsPagination = styled.div`
  display: flex;
  align-items: center;
  input {
    width: 3.5em;
    text-align: center;
  }
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
  > *:not(:last-child) {
    margin-right: 0.5em;
  }
`
