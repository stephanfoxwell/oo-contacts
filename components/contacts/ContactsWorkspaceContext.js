import React from "react";

const ContactsWorkspaceContext = React.createContext();

function useContactsWorkspace() {

  const context = React.useContext(ContactsWorkspaceContext);

  if ( ! context ) {
    throw new Error(`useContactsWorkspace must be used within a ContactsWorkspaceProvider`);
  }

  const [contactsWorkspace, setContactsWorkspace] = context;

  const updateContactsWorkspace = ( update ) => {
    setContactsWorkspace({ ...contactsWorkspace, ...update });
  }

  const setTags = ( tags ) => {
    updateContactsWorkspace({tags: tags});
  }

  const setFilters = ( update ) => {
    updateContactsWorkspace({
      filters: {
        ...(contactsWorkspace?.filters || {}),
        ...update
      },
      pageIndex: 1
    });
  }

  const setContacts = ( contacts ) => {
    updateContactsWorkspace({ contacts: contacts });
  }

  const setOrganizations = ( organizations ) => {
    updateContactsWorkspace({ organizations: organizations });
  }

  const setPageIndex = ( index ) => {
    updateContactsWorkspace({ pageIndex: index });
  }

  const setPageStatus = ( status ) => {
    updateContactsWorkspace({ pageStatus: status });
  }

  const setInspectedContact = ( contact ) => {
    updateContactsWorkspace({ inspectedContact: contact });
  }

  const setCurrentRecords = ( records ) => {
    updateContactsWorkspace({ currentRecords: records });
  }

  const setSelectedRecords = ( records ) => {
    updateContactsWorkspace({ selectedRecords: records });
  }

  const isContactRestricted = ( contact ) => {
    return contact?.tags?.some( tag => contactsWorkspace?.tags?.find( t => t.id === tag ).is_restricted );
  }

  const toggleInspectedContacts = ( contact ) => {
    const updatedInspectedContacts = contactsWorkspace.inspectedContacts || [];
    const index = updatedInspectedContacts.findIndex( c => c.id === contact.id );
    if ( index > -1 ) {
      updatedInspectedContacts.splice(index, 1);
    }
    else {
      updatedInspectedContacts.push(contact);
    }
    updateContactsWorkspace({ inspectedContacts: updatedInspectedContacts });
  }

  const fields = [
    {
      name: 'first_name',
      label: 'First name',
      type: 'string',
      display: 'half'
    },
    {
      name: 'last_name',
      label: 'Last name',
      type: 'string',
      display: 'half'
    },
    {
      name: 'notes',
      label: 'Notes',
      type: 'text',
      rows: '5',
      hint: "Add links like so: [link text](http://example.com)"
    },
    {
      name: 'tags',
      label: 'Tags',
      type: 'string',
      multiple: true,
    },
    {
      name: 'email_1',
      label: 'Email 1',
      type: 'email',
      format: 'email'
    },
    {
      name: 'email_2',
      label: 'Email 2',
      type: 'email',
      format: 'email'
    },
    {
      name: 'email_3',
      label: 'Email 3',
      type: 'email',
      format: 'email'
    },
    {
      name: 'phone_1',
      label: 'Phone 1',
      type: 'tel',
      format: 'tel',
    },
    {
      name: 'phone_2',
      label: 'Phone 2',
      type: 'tel',
      format: 'tel',
    },
    {
      name: 'phone_3',
      label: 'Phone 3',
      type: 'tel',
      format: 'tel',
    },
    {
      label: 'Social',
      type: 'divider'
    },
    {
      name: 'social_x',
      label: 'X (Twitter)',
      type: 'social',
      display: 'half'
    },
    {
      name: 'social_facebook',
      label: 'Facebook',
      type: 'social',
      display: 'half'
    },
    {
      name: 'social_instagram',
      label: 'Instagram',
      type: 'social',
      display: 'half'
    },
    {
      name: 'social_linkedin',
      label: 'LinkedIn',
      type: 'social',
      display: 'half'
    },
    {
      name: 'social_mastodon',
      label: 'Mastodon',
      type: 'social',
      display: 'half'
    },
    {
      label: 'Other',
      type: 'divider'
    },
    {
      name: 'company',
      label: 'Company',
      type: 'string',
      display: 'half'
    },
    {
      name: 'position',
      label: 'Position',
      type: 'string',
      display: 'half'
    },
    {
      name: 'location',
      label: 'Location',
      type: 'string',
    }
  ];

  return {
    inspectedContacts: contactsWorkspace?.inspectedContacts,
    toggleInspectedContacts,
    tags: contactsWorkspace?.tags || [],
    setTags,
    selectedTags: contactsWorkspace?.selectedTags || [],
    filters: contactsWorkspace?.filters || {},
    setFilters,
    contacts: contactsWorkspace?.contacts || [],
    setContacts,
    organizations: contactsWorkspace?.organizations || [],
    setOrganizations,
    pageIndex: contactsWorkspace?.pageIndex || 1,
    setPageIndex,
    pageStatus: contactsWorkspace?.pageStatus,
    setPageStatus,
    inspectedContact: contactsWorkspace?.inspectedContact,
    setInspectedContact,
    currentRecords: contactsWorkspace?.currentRecords || [],
    setCurrentRecords,
    selectedRecords: contactsWorkspace?.selectedRecords || [],
    setSelectedRecords,
    contactsWorkspace,
    fields,
    isContactRestricted
  }
}

function ContactsWorkspaceProvider(props) {
  const [contactsWorkspace, setContactsWorkspace] = React.useState({inspectedContacts: [], filters: { type: 'individual'} })
  const value = React.useMemo(() => [contactsWorkspace, setContactsWorkspace], [contactsWorkspace])
  return <ContactsWorkspaceContext.Provider value={value} {...props} />
}

export {
  ContactsWorkspaceProvider,
  useContactsWorkspace
}