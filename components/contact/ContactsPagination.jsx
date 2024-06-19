import React, { useState, useEffect } from 'react'
import styled from 'styled-components';

import { useWorkspace } from '@/components/contact/WorkspaceContext'

import Button from '@/components/Button/index'
import TextField from '@/components/ui/TextField'

import { ChevronLeftIcon, ChevronRightIcon, PersonIcon, FileIcon } from '@primer/octicons-react'


function ContactsPagination({ pageMeta }) {

  const {
    filters,
    pageIndex,
    setPageIndex,
  } = useWorkspace()


  const [perPage, setPerPage] = useState(100)

  const isSingle = ( number ) => {
    return new Intl.NumberFormat().format(1) !== new Intl.NumberFormat().format(number) ? false : true
  }

  const pluralize = ( number ) => {
    return ! isSingle( number ) ? `s` : ``
  }

  const currentRecordsCount = pageMeta && pageMeta.count ? new Intl.NumberFormat().format(pageMeta.count) : 0;
  const currentPagesCount = pageMeta && pageMeta.count ? new Intl.NumberFormat().format( Math.ceil( pageMeta.count / perPage ) ) : 0;

  return (
    <StyledContactsPagination>
      {pageMeta.count > 0 ?
        <div><span><PersonIcon />{currentRecordsCount}</span> <span><FileIcon />{currentPagesCount}</span></div>
        :
        <div>No results</div>
      }
      <Button 
        type="button"
        onClick={() => setPageIndex(pageIndex - 1)}
        disabled={pageMeta.currentPageRecordStart && pageMeta.currentPageRecordStart > 1 ? undefined : `disabled`}
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
        disabled={pageMeta.currentPageRecordEnd && pageMeta.currentPageRecordEnd < pageMeta.count ? undefined : `disabled`}
        title="Next page"
      ><ChevronRightIcon /></Button>
    </StyledContactsPagination>
  )
}

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

export default ContactsPagination