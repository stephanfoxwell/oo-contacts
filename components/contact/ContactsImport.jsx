import React, { Component, useState } from 'react'
import { CSVReader } from 'react-papaparse'
import styled from 'styled-components'
import { CSVLink } from "react-csv"
import { useQuery, useQueryClient, useMutation } from 'react-query'
import { useWorkspace } from './WorkspaceContext'

import Button from '@/components/Button/index'
import { UploadIcon  } from '@primer/octicons-react'
import Dropdown from '@/components/ui/Dropdown'

import { FileIcon, KebabHorizontalIcon } from '@primer/octicons-react'

function ContactsImport() {

  const [fileIsSelected, setFileIsSelected] = useState(false)
  const [fileItemCount, setFileItemCount] = useState(false)
  const [fileData, setFileData] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedCount, setProcessedCount] = useState(0)

  const buttonRef = React.createRef()

  const queryClient = useQueryClient()

  const { fields } = useWorkspace()

  const headers = []
  const cells = {}

  for ( const field of fields ) {
    if ( field.name ) {
      headers.push({
        label: field.name,
        key: field.name
      })
      cells[field.name] = (field.multiple ? '(comma-separated list)' : ( field.type === 'boolean' ? '(1 for yes, 0 for no)' : ''))
    }
  }

  const handleOpenDialog = (e) => {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.open(e)
    }
  }

  const handleOnFileLoad = (data) => {
    setFileItemCount(data.length);
    setFileIsSelected(true);
    setFileData(data);
    setIsProcessing(false);
  }

  const handleOnError = (err, file, inputElem, reason) => {
    console.log(err)
  }

  const handleOnRemoveFile = (data) => {
    setFileIsSelected(false);
    setFileData(false);
  }

  const handleRemoveFile = (e) => {
    setFileIsSelected(false);
    setFileData(false);
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.removeFile(e)
    }
  }

  const handleFileProcessing = async () => {
    const data = fileData;
    setIsProcessing( true );
    let n = 0;
    for ( const item in data ) {
      n += 1;
      const itemData = data[item].data

      const formatArrayField = ( value ) => {
        if ( ! value || value.trim() === '' ) {
          return undefined
        }
        const items = value.replace(/, /, ',').split(',')
        return items.map( item => item !== '' && item.trim() )
      }

      const formattedEmail = formatArrayField( itemData.email )
      const formattedPhone = formatArrayField( itemData.phone )
      const formattedTags = formatArrayField( itemData.tags )
      
      

      const body = {
        firstName: itemData.firstName,
        lastName: itemData.lastName,
        email: formattedEmail,
        phone: formattedPhone,
        notes: itemData.notes,
        position: itemData.position,
        jobTitle: itemData.jobTitle,
        company: itemData.company,
        location: itemData.location,
        twitter: itemData.twitter,
        instagram: itemData.instagram,
        linkedin: itemData.linkedin,
        facebook: itemData.facebook,
        tags: formattedTags
      }
      if ( itemData.creatorId ) {
        body.creatorId = itemData.creatorId
      }
      if ( itemData.createdAt ) {
        body.createdAt = itemData.createdAt
      }
      if ( itemData.lastModifiedBy ) {
        body.lastModifiedBy = itemData.lastModifiedBy
      }
      if ( itemData.lastModifiedAt ) {
        body.lastModifiedAt = itemData.lastModifiedAt
      }
      console.log(body)
      const res = await fetch('/api/contacts', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }).then(( data ) => setProcessedCount( n ) );
      
    }
    setFileIsSelected(false)
    setFileData(false)
    queryClient.invalidateQueries('contacts')
    queryClient.invalidateQueries('tags')
  }

    return (
      <StyledContactsImporter>
        <CSVReader
          ref={buttonRef}
          onFileLoad={handleOnFileLoad}
          onError={handleOnError}
          noClick
          noDrag
          onRemoveFile={handleOnRemoveFile}
          noProgressBar
          config={{
            header: true
          }}
        >
          {({ file }) => (
            <>
              <Button onClick={handleOpenDialog}><UploadIcon /><span>Import</span></Button>
              {fileIsSelected && file &&
                <StyledImporterControls>
                  <div>
                    <h2>Import</h2>
                    <StyledImporterFile>
                      <span>{fileItemCount && `${fileItemCount} items`}</span>
                      { isProcessing &&
                        <span>{processedCount} of {fileItemCount}</span>
                      }
                    </StyledImporterFile>
                    
                    { ! isProcessing && (
                      <div>
                        <Button className="black" type="button" onClick={() => handleFileProcessing()}>Import</Button>
                        <Button onClick={() => handleRemoveFile()}>Cancel</Button>
                      </div>
                    )}
                  </div>
                </StyledImporterControls>
              }
            </>
          )}
        </CSVReader>
        &nbsp;&nbsp;
        <Dropdown>
            <Button as="summary"><KebabHorizontalIcon /></Button>
            <Dropdown.Menu direction="ne">
              <Dropdown.Item>
                <CSVLink
                  className="button"
                  data={[cells]}
                  headers={headers}
                  filename={`contact-import-template.csv`}
                >
                  <FileIcon /><span>Template .csv</span>
                </CSVLink>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </StyledContactsImporter>
    )
}


const StyledContactsImporter = styled.div`
  display: flex;
  align-items: center;
  > *:not(:last-of-type) {
    margin-right: 0.5em;
  }
`

const StyledImporterFile = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5em 0.625em;
  background-color: var(--color-off-white);
  border-radius: var(--border-radius);
  line-height: 1;
  margin-right: 0.75em;
  span {
    display: flex;
    line-height: 1;
    white-space: nowrap;
  }
`

const StyledImporterControls = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10000;
  background-color: rgba(255,255,255,0.25);
  backdrop-filter: blur(3px);
  display: flex;
  justify-content: center;
  align-items: center;
  > div {
    padding: var(--padding-viewport);
    background-color: var(--color-white);
    border: var(--border-divider);
    border-radius: calc(2 * var(--border-radius));
    box-shadow: 0 0.25em 0.75em -0.25em rgba(0,0,0,0.3);
    width: 80vw;
    max-width: 20em;
    h2 {
      font-size: 1em;
      margin: 0;
    }
    > div {
      display: flex;
      justify-content: space-between;
      margin-top: 1.5em;
    }
  }
  > span {
    align-self: center;
  }
`

export default ContactsImport