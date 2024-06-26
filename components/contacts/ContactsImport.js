import React, { useState } from 'react'
import { useCSVReader } from 'react-papaparse';
import styled from 'styled-components'
//import { CSVLink } from "react-csv"
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useContactsWorkspace } from './ContactsWorkspaceContext';

import Button, { ButtonPrimary } from '../Button/index'
import { UploadIcon, FileIcon, KebabHorizontalIcon  } from '@primer/octicons-react'
import Dropdown from '../ui/Dropdown'


const ContactsImport = () => {

  const [fileIsSelected, setFileIsSelected] = useState(false)
  const [fileItemCount, setFileItemCount] = useState(false)
  const [fileData, setFileData] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedCount, setProcessedCount] = useState(0)
  const [isComplete, setIsComplete] = useState(false);

  const buttonRef = React.createRef();

  const queryClient = useQueryClient();

  const { fields, tags } = useContactsWorkspace();

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
  /*
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
  */

  function getTagId(tagName) {
    const matchedTag = tags.find(tag => tag.name.toLowerCase() === tagName.trim().toLowerCase());
    return matchedTag ? matchedTag.id : null;
  }

  const handleFileProcessing = async (getRemoveFileProps) => {
    const data = fileData;
    setIsProcessing( true );
    let n = 0;
    for ( const item in fileData ) {
      n += 1;
      const itemData = fileData[item];

      const possibleFields = [
        'id',
        'first_name',
        'last_name',
        'email_1_address',
        'email_2_address',
        'email_3_address',
        'email_4_address',
        'email_5_address',
        'email_1_label',
        'email_2_label',
        'email_3_label',
        'email_4_label',
        'email_5_label',
        'phone_1_number',
        'phone_2_number',
        'phone_3_number',
        'phone_4_number',
        'phone_5_number',
        'phone_1_label',
        'phone_2_label',
        'phone_3_label',
        'phone_4_label',
        'phone_5_label',
        'company',
        'location',
        'name',
        'notes',
        'position',
        'social_bluesky',
        'social_facebook',
        'social_instagram',
        'social_linkedin',
        'social_mastodon',
        'social_substack',
        'social_threads',
        'social_x',
        'social_youtube',
        'type'
      ];

      const body = {};
      for ( const field of possibleFields ) {
        if ( itemData[field] && itemData[field].trim() !== '') {
          if ( field === 'type' ) {
            body[field] = itemData[field].toLowerCase();
          }
          else {
            body[field] = itemData[field];
          }
        }
      }

      const potentialTags = itemData.tags ? itemData.tags.split(',') : [];
      const structuredTags = [];
      for ( const tagName of potentialTags ) {
        const tagId = getTagId(tagName);
        if ( tagId ) {
          structuredTags.push({ contact_tags_id: tagId });
        }
      }
      if ( structuredTags.length > 0 ) {
        body.tags = structuredTags;
      }
      
      
     const res = await fetch('/api/contacts', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }).then(( data ) => setProcessedCount( n ) );
      
    }

    setIsComplete(true);

    queryClient.invalidateQueries(['contacts', 'tags', 'organizations']);
  }

  const handleUploadAccepted = (results) => {
    const data = results.data;
    console.log('data', data)
    setFileItemCount(data.length);
    setFileIsSelected(true);
    setFileData(data);
    setIsProcessing(false);
  }

  const { CSVReader } = useCSVReader();

    return (
      <StyledContactsImporter>
        <CSVReader
          onUploadAccepted={handleUploadAccepted}
          config={{
            header: true,
          }}
        >
          {({ getRootProps, acceptedFile, getRemoveFileProps, removeFile }) => (
            <>
              <Button type="button"{...getRootProps()}><UploadIcon /><span>Import</span></Button>
              {acceptedFile &&
                <StyledImporterControls>
                  <div>
                    <h2>Import</h2>
                    <StyledImporterFile>
                      <span>{fileItemCount && `${fileItemCount} items`}</span>
                      { isProcessing &&
                        <span>{processedCount} of {fileItemCount}</span>
                      }
                    </StyledImporterFile>
                    
                    { ! isProcessing && ! isComplete && (
                      <div>
                        <Button className="black" type="button" onClick={() => handleFileProcessing(getRemoveFileProps)}>Import</Button>
                        <Button {...getRemoveFileProps()}>Cancel</Button>
                      </div>
                    )}
                    { isComplete && (
                      <div>
                        <span>Import complete</span>
                        <ButtonPrimary type="button" {...getRemoveFileProps()}>Close</ButtonPrimary>
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
                {/*<CSVLink
                  className="button"
                  data={[cells]}
                  headers={headers}
                  filename={`contact-import-template.csv`}
                >
                  <FileIcon /><span>Template .csv</span>
                </CSVLink>*/}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </StyledContactsImporter>
    )

}

export default ContactsImport;





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