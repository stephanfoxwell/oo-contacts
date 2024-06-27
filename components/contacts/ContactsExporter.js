import React, { useState, useEffect } from 'react';
import { useCSVDownloader } from 'react-papaparse';
import { useQuery } from '@tanstack/react-query';
import { useContactsWorkspace } from './ContactsWorkspaceContext'
import Button, { ButtonPrimary } from '../Button/index';
import { DownloadIcon } from '@primer/octicons-react';
import Dialog from '../ui/Dialog'
import fetchContacts from '../../utils/fetchContactsAlt';

const ContactsExporter = () => {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button  type="button" onClick={() => setIsOpen(true)}> <span>Export</span><DownloadIcon /></Button>

      <Dialog isOpen={isOpen} setIsOpen={setIsOpen}>
        <Dialog.Header>Export contacts</Dialog.Header>
        <ExportContent setIsOpen={setIsOpen} />
      </Dialog>
    </>
  )
};

export default ContactsExporter;

const ExportContent = ({ setIsOpen }) => {
  console.log('export content loaded')
  const [exportRecords, setExportRecords] = useState([]);
  const { filters } = useContactsWorkspace();

  const {isSuccess, isLoading, data } = useQuery({
    queryKey: ['contacts-export', { filters }],
    queryFn: () => fetchContacts(filters, 1, 50000)
  });

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
      setExportRecords( filterExportItems(data.data) )
    }
  }, [data]);

  const { CSVDownloader } = useCSVDownloader();

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