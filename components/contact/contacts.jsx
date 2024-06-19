import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { CSVDownloader } from 'react-papaparse'

import { useQuery, useQueryClient, useMutation } from 'react-query'

import { useWorkspace } from '@/components/contact/WorkspaceContext'

import Button, { ButtonPrimary } from '@/components/Button/index'
import Dropdown from '@/components/ui/Dropdown'
import Checkbox from '@/components/ui/Checkbox'

import { DownloadIcon, TrashIcon, VersionsIcon } from '@primer/octicons-react'

import ContactsImport from './ContactsImport'
import ContactsSearch from './ContactsSearch'
import ContactsPagination from './ContactsPagination'
import ContactsListItem from './ContactsListItem'

import Dialog from '@/components/ui/Dialog'

async function fetchContacts( filters, pageIndex = 1, limit = 100 ) {
  const params = new URLSearchParams(filters).toString()
  console.log(params)
  const url = `/api/contacts?${params}`

  const response = await fetch( `${url}&page=${pageIndex}&limit=${limit}` )

  if ( ! response.ok )
    throw new Error("Network response was not ok")
  
  return response.json()
}


export default function Contacts({ inspectedContact, setInspectedContact}) {
  
  const {
    setCurrentRecords,
  } = useWorkspace()

  const [theRecords, setTheRecords] = useState([])
  const [allRecords, setAllRecords] = useState([])
  const [exportItems, setExportItems] = useState([])
  const [pageMeta, setPageMeta]= useState({})

  const { filters, pageIndex } = useWorkspace()

  const {isSuccess, isLoading, isError, data, error } = useQuery(['contacts', { filters, pageIndex }], () => fetchContacts(filters, pageIndex), { keepPreviousData: true })

  //const {isSuccess: allIsSuccess, data: allData } = useQuery(['contacts', { filters }], () => fetchContacts(filters, 1, 30000))

  useEffect(() => {
    if ( isSuccess ) {
      setPageMeta(data.meta)
      setTheRecords( data.items )
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
      <ContactsToolbar 
        exportItems={exportItems}
        pageMeta={pageMeta}
      />
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

const StyledContacts = styled.div`
  position: relative;
  height: calc(100vh - var(--height-nav));
  display: grid;
  grid-template: auto 1fr auto / 1fr;
  background-color: var(--color-white);
`

const StyledContactsContent = styled.div`
  position: relative;
  padding: var(--padding-viewport) calc(2 * var(--padding-viewport));
  margin: 0;
  height: calc(100vh - var(--height-nav) - var(--height-titlebar) - var(--height-titlebar));
  overflow: auto;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: thin;
  scrollbar-color: var(--color-border) #f7f6f1;

`

function ContactsToolbar({ exportItems, pageMeta }) {

  const [isOpen, setIsOpen] = useState(false)

  return (
    <StyledContactsToolbar>
      <ContactsSearch />
      <StyledContactsToolbarActions>
        
        <Button  type="button" onClick={() => setIsOpen(true)}> <span>Export</span><DownloadIcon /></Button>
        <CSVDownloader
          data={exportItems} 
          filename={`contact-export`}
          bom={true}
        >
        </CSVDownloader>

        <Dialog isOpen={isOpen} setIsOpen={setIsOpen}>
          <Dialog.Header>Export contacts</Dialog.Header>
          <ExportContent setIsOpen={setIsOpen} />
        </Dialog>
      </StyledContactsToolbarActions>
    </StyledContactsToolbar>
  )
}

const ExportContent = ({ setIsOpen }) => {
  console.log('export content loaded')
  const [exportRecords, setExportRecords] = useState([])
  const { filters } = useWorkspace()
  const {isSuccess, isLoading, data } = useQuery(['contacts', { filters }], () => fetchContacts(filters, 1, 50000))
  const implodeTags = (tags) => {
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
    if ( isSuccess ) {
      setExportRecords( filterExportItems(data.items) )
    }
  }, [data])

  return (
    <>
      {isLoading &&
        <p>Loading export content...</p>
      }
      {isSuccess &&
        <CSVDownloader
          data={exportRecords} 
          filename={`contact-export`}
          bom={true}
        >
          <ButtonPrimary  type="button" onClick={() => setIsOpen(false)}>Download</ButtonPrimary>
        </CSVDownloader>
      }
    </>
  )
}


const StyledContactsToolbar = styled.div`
  position: sticky;
  z-index: 101;
  top: 0;
  display: flex;
  align-items: center;
  margin: 0 calc(2 * var(--padding-viewport));
  height: var(--height-titlebar);
  border-bottom: var(--border-divider);
  background-color: var(--color-white);
  padding-top: 0.25em;
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

function ContactsList({ 
  theRecords,
  inspectedContact,
  setInspectedContact
}) {

  return (
    <StyledContactsList>
      {theRecords?.map((contact) => (
        <ContactsListItem 
          key={`contact-${contact._id}`} 
          contact={contact} 
          inspectedContact={inspectedContact}
          setInspectedContact={setInspectedContact}
        />
      ))}
    </StyledContactsList>
  )
}

const StyledContactsList = styled.ol`
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
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
  } = useWorkspace()

  const queryClient = useQueryClient()

  const [selectAll, setSelectAll] = useState(false)

  useEffect(() => {
    if ( selectAll ) {
      console.log(currentRecords.length)
      setSelectedRecords( currentRecords.map((item) => item._id ))
      console.log('select all')
    }
    else {
      setSelectedRecords([])
      console.log('select none')
    }
  }, [selectAll])
  /*
  useEffect(() => {
    if ( selectAll && selectedRecords?.length < 1 )
      setSelectAll(false)
  }, [selectedRecords])
  */

  const deleteMutation = useMutation(deleteContact, {
    onSuccess: () => {
      queryClient.invalidateQueries('contacts')
      queryClient.invalidateQueries('tags')
      setPageStatus(`deleted`)
      setTimeout(() => setPageStatus(null), 3000)
    },
  })

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
        <Checkbox 
          onClick={() => setSelectAll( ! selectAll )}
          checked={selectAll ? true : undefined}
        />
          <Dropdown>
            <Button as="summary"><VersionsIcon /></Button>
            <Dropdown.Menu direction="ne">
                <Dropdown.Item>
                  <span onClick={handleDelete}><TrashIcon /><span>Delete selected</span></span>
                </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        <hr />
        <ContactsImport />
        
      </div>
      <div>
        <ContactsPagination pageMeta={pageMeta} />
      </div>
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