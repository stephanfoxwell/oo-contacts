import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useCSVDownloader } from 'react-papaparse';

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'

import { useContactsWorkspace } from './ContactsWorkspaceContext'

import Button, { ButtonText, ButtonPrimary } from '../Button/index'
import Dropdown from '../ui/Dropdown'
import Checkbox from '../ui/Checkbox'

import { DownloadIcon, TrashIcon, VersionsIcon } from '@primer/octicons-react'

import ContactsList from './ContactsList'

import ContactsImport from './ContactsImport'
import ContactsSearch from './ContactsSearch'
import ContactsPagination from './ContactsPagination';

import Dialog from '../ui/Dialog'
import ContactsFilterBar from './ContactsFilterBar'
import ContactsExporter from './ContactsExporter';

import fetchContacts from '../../utils/fetchContactsAlt';

export default function Contacts({ inspectedContact, setInspectedContact}) {
  
  const {
    setCurrentRecords,
  } = useContactsWorkspace()

  const [theRecords, setTheRecords] = useState([])
  const [allRecords, setAllRecords] = useState([])
  const [exportItems, setExportItems] = useState([])
  const [pageMeta, setPageMeta]= useState({})

  const { filters, pageIndex } = useContactsWorkspace();

  const { isSuccess, isLoading, isError, data, error } = useQuery({
    queryKey: ['contacts', { filters, pageIndex }],
    queryFn: () => fetchContacts(filters, pageIndex),
    keepPreviousData: true,
  });
  //const {isSuccess: allIsSuccess, data: allData } = useQuery(['contacts', { filters }], () => fetchContacts(filters, 1, 30000))

  useEffect(() => {
    if ( isSuccess ) {
      setPageMeta(data.meta)
      setTheRecords( data.data )
    }
  }, [data])

  useEffect(() => {
    setCurrentRecords(theRecords)
  }, [theRecords])

  /*
  useEffect(() => {
    if ( isSuccess ) {
      setTheRecords( data.items )
    }
    if ( allIsSuccess ) {
      setAllRecords( allData.items )
      setExportItems( filterExportItems(allData.items) )
    }
  }, [filters])
  */
  /*const implodeTags = (tags) => {
    const filteredTags = []
    tags.forEach((tag) => {
      filteredTags.push(tag.name)
    })
    return filteredTags.join(', ')
  }

  const filterExportItems = (items) => {
    return items.map((item, index) => {
      return {...item, tags: implodeTags(item.tags), email: (item.email || []).join(', '), phone: (item.phone || []).join(', ') }
    })
  }

  useEffect(() => {
    if ( allIsSuccess ) {
      console.log(`all: ${allData.items.length}`)
      setAllRecords( allData.items )
      setExportItems( filterExportItems(allData.items) )
    }
  }, [allData])
  */

  return (
    <StyledContacts>
      <StyledContactFilters>
        <ContactsFilterBar />
        <ContactsToolbar 
          exportItems={exportItems}
          pageMeta={pageMeta}
        />
      </StyledContactFilters>
      <StyledContactsContent>
        <ContactsList 
          theRecords={theRecords}
          setPageMeta={setPageMeta}
          inspectedContact={inspectedContact}
          setInspectedContact={setInspectedContact}
        />
      </StyledContactsContent>
      <ContactsListMeta 
        inspectedContact={inspectedContact}
        setInspectedContact={setInspectedContact}
        pageMeta={pageMeta}
        currentRecords={theRecords}
      />
    </StyledContacts>
  )
}

const StyledContactFilters = styled.div`
  display: grid;
  padding: 1em 0;
  gap: 0.5em;
`;

const StyledContacts = styled.div`
  position: relative;
  height: 100%;
  display: grid;
  grid-template: auto 1fr auto / 1fr;
  width: 100%;
  max-width: 100%;
  height: 100vh;
`

const StyledContactsContent = styled.div`
  position: relative;
  margin: 0;
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: thin;
  scrollbar-color: var(--color-border) #f7f6f1;

`

const ContactsToolbar = ({ exportItems, pageMeta }) => {

  const [isOpen, setIsOpen] = useState(false)

  return (
    <StyledContactsToolbar>
      <ContactsSearch />
      <StyledContactsToolbarActions>
      </StyledContactsToolbarActions>
    </StyledContactsToolbar>
  )
}


const StyledContactsToolbar = styled.div`
  position: sticky;
  z-index: 101;
  top: 0;
  display: flex;
  align-items: center;

  h2 {
    font-size: 1em;
    margin: 0 1em 0 0;
    line-height: 1.5;
  }
  & > div {
    display: flex;
    align-items: center;
  }
  > div:last-of-type {
    margin-left: auto;
  }
`

const StyledContactsToolbarActions = styled.div`
  display: flex;
  align-items: center;
  margin-right: -0.5em;
  > * {
    margin: 0 0.5em;
  }
  > hr {
    width: var(--border-width);
    height: 1.5em;
    background-color: var(--color-border-light);
    margin: 0 0.25em;
  }
`


async function deleteContact( data ) {
  
  const response = await fetch('/api/contacts', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if ( ! response.ok )
    throw new Error("Network response was not ok")
    
  return response.json()
}

function ContactsListMeta({ pageMeta, inspectedContact, setInspectedContact }) {

  const {
    setPageStatus,
    currentRecords,
    selectedRecords,
    setSelectedRecords
  } = useContactsWorkspace()

  const queryClient = useQueryClient()

  const [selectAll, setSelectAll] = useState(false)

  useEffect(() => {
    if ( selectAll ) {
      setSelectedRecords( currentRecords.map((item) => item._id ))
    }
    else {
      setSelectedRecords([])
    }
  }, [selectAll])
  /*
  useEffect(() => {
    if ( selectAll && selectedRecords?.length < 1 )
      setSelectAll(false)
  }, [selectedRecords])
  */
  /* FIX
  const deleteMutation = useMutation(deleteContact, {
    onSuccess: () => {
      queryClient.invalidateQueries('contacts')
      queryClient.invalidateQueries('tags')
      setPageStatus(`deleted`)
      setTimeout(() => setPageStatus(null), 3000)
    },
  })
  */
  async function handleDelete(e) {

    e.preventDefault()

    if ( selectedRecords.length < 1 ) {
      return;
    }
    
    if ( window.confirm(`Delete selected records? This cannot be undone.`) ) {

      setPageStatus(`deleting...`);

      if ( inspectedContact && selectedRecords.includes(inspectedContact._id) ) {
        setInspectedContact(undefined)
      }
      
      for ( const selectedRecord of selectedRecords ) {

        const body = {
          _id: selectedRecord
        }

        deleteMutation.mutate(body)
      }
      
    }
  }

  return (
    <StyledContactsListMeta>
      <div>
        <ContactsImport />
      </div>
      <div>
        <ContactsPagination pageMeta={pageMeta} />
      </div>
      <ContactsExporter />
    </StyledContactsListMeta>
  )
}

const StyledContactsListMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--height-titlebar);
  margin: 0 calc(2 * var(--padding-viewport));
  &:last-of-type {
    border-top: var(--border-divider);
  }
  > div {
    display: flex;
    align-items: center;
    > * {
      margin-right: 0.5em;
      margin-left: 0.5em;
    }
    > *:first-child {
      margin-left: 0;
    }
    > *:last-child {
      margin-right: 0;
    }
  }
  hr {
    height: 1.5em;
    width: 0;
    border-right: var(--border-divider);
    margin: 0 0.5em;
  }
`