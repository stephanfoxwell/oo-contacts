import React from "react"

const WorkspaceContext = React.createContext()

function useWorkspace() {
  const context = React.useContext(WorkspaceContext)
  if ( ! context ) {
    throw new Error(`useWorkspace must be used within an WorkspaceProvider`)
  }

  const [workspace, setWorkspace] = context

  const updateWorkspace = ( update ) => {
    setWorkspace({ ...workspace, ...update })
  }

  const setInspectorField = ( field ) => {
    updateWorkspace({ inspectField: field })
  }

  const setInspectorPage = ( page ) => {
    updateWorkspace({ inspectPage: page, assessmentPage: page._id, inspectorView: 'page' })
  }

  const setInspectorToField = ( field, pageId ) => {
    if ( pageId ) {
      updateWorkspace({ inspectField: field, assessmentPage: pageId, inspectorView: 'field' })
    }
    else {
      updateWorkspace({ inspectField: field, inspectorView: 'field' })
    }
  }

  const setAssessmentPage = ( pageId ) => {
    updateWorkspace({ assessmentPage: pageId })
  }

  const setTags = ( tags ) => {
    updateWorkspace({tags: tags})
  }

  const setFilters = ( update ) => {
    updateWorkspace({
      filters: {
        ...(workspace.filters || {}),
        ...update
      },
      pageIndex: 1
    })
  }
  const setContacts = ( contacts ) => {
    updateWorkspace({ contacts: contacts })
  }

  const setPageIndex = ( index ) => {
    updateWorkspace({ pageIndex: index })
  }

  const setPageStatus = ( status ) => {
    updateWorkspace({ pageStatus: status })
  }

  const setInspectedContact = ( contact ) => {
    updateWorkspace({ inspectedContact: contact })
  }

  const setCurrentRecords = ( records ) => {
    updateWorkspace({ currentRecords: records })
  }

  const setSelectedRecords = ( records ) => {
    updateWorkspace({ selectedRecords: records })
  }

  const fields = [
    {
      name: 'firstName',
      label: 'First name',
      type: 'string',
      display: 'half'
    },
    {
      name: 'lastName',
      label: 'Last name',
      type: 'string',
      display: 'half'
    },
    {
      name: 'notes',
      label: 'Notes',
      type: 'text',
      rows: '5'
    },
    {
      name: 'tags',
      label: 'Tags',
      type: 'string',
      multiple: true,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'string',
      multiple: true,
      format: 'email',
      display: 'half'
    },
    {
      name: 'phone',
      label: 'Phone',
      type: 'string',
      multiple: true,
      display: 'half',
      format: 'tel'
    },
    {
      name: 'isVerified',
      label: 'Verified',
      type: 'boolean',
      display: 'half',
      hint: 'Info is verified'
    },
    {
      label: 'Social',
      type: 'divider'
    },
    {
      name: 'twitter',
      label: 'Twitter',
      type: 'social',
      display: 'half'
    },
    {
      name: 'facebook',
      label: 'Facebook',
      type: 'social',
      display: 'half'
    },
    {
      name: 'instagram',
      label: 'Instagram',
      type: 'social',
      display: 'half'
    },
    {
      name: 'linkedin',
      label: 'LinkedIn',
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
    },
    {
      name: 'optOut',
      label: 'Opt-out',
      type: 'boolean'
    }
  ]

  return {
    tags: workspace?.tags || [],
    setTags,
    selectedTags: workspace?.selectedTags || [],
    filters: workspace?.filters || {},
    setFilters,
    contacts: workspace?.contacts || [],
    setContacts,
    pageIndex: workspace?.pageIndex || 1,
    setPageIndex,
    pageStatus: workspace?.pageStatus,
    setPageStatus,
    inspectedContact: workspace?.inspectedContact,
    setInspectedContact,
    currentRecords: workspace?.currentRecords || [],
    setCurrentRecords,
    selectedRecords: workspace?.selectedRecords || [],
    setSelectedRecords,
    workspace,
    fields
  }
}

function WorkspaceProvider(props) {
  const [workspace, setWorkspace] = React.useState()
  const value = React.useMemo(() => [workspace, setWorkspace], [workspace])
  return <WorkspaceContext.Provider value={value} {...props} />
}

export {
  WorkspaceProvider,
  useWorkspace
}