import React, { useState } from 'react'
import styled from 'styled-components'

import { useWorkspace, WorkspaceProvider } from '@/components/contact/WorkspaceContext'
import ContactInspector from '@/components/contact/ContactInspector'

import Contacts from '@/components/contact/contacts'
import ContactsTags from '@/components/contact/ContactsTags'

function Workspace() {
  return (
    <WorkspaceProvider>
      <WorkspaceContent />
    </WorkspaceProvider>
  )
}

export default Workspace

function WorkspaceContent() {

  //const { inspectedContact } = useWorkspace()

  const [inspectedContact, setInspectedContact] = useState(undefined)

  /*
  const apiKeyBase = `/api/contacts?firstName=${(filters?.firstName ? filters?.firstName : ``)}&lastName=${(filters?.lastName ? filters?.lastName : ``)}&email=${(filters?.email ? filters?.email : ``)}&location=${(filters?.location ? filters?.location : ``)}&notes=${(filters?.notes ? filters?.notes : ``)}&company=${(filters?.company ? filters?.company : ``)}&keywordsOperator=${filters?.keywordsOperator || `or`}&tags=${(filters?.tags ? filters?.tags : ``)}&tagsOperator=${filters?.tagsOperator || `or`}`;

  const apiKey = {
    current: `${apiKeyBase}&page=${pageIndex}`,
    next: `${apiKeyBase}&page=${pageIndex + 1}`,
    all: `${apiKeyBase}&limit=100000`
  }
  */
  return (
    <StyledWorkspace className={inspectedContact ? 'has-inspector' : undefined}>
      <ContactsTags />
      <Contacts 
        inspectedContact={inspectedContact}
        setInspectedContact={setInspectedContact}
      />
      <ContactInspector
        inspectedContact={inspectedContact}
        setInspectedContact={setInspectedContact}
      />
    </StyledWorkspace>
  )
}

const StyledWorkspace = styled.div`
  position: relative;
  display: grid;
  height: calc(100vh - var(--height-nav));
  grid-template: 1fr / 14em 1fr 6em;
  &.has-inspector {
    grid-template: 1fr / 14em 1fr 30em;
  }
  @media ( max-width: 80em ) {
    &.has-inspector {
      grid-template: 1fr / 12em 1fr 20em;
    }
  }
`