import React from "react";
import ContactsWorkspace from "../components/contacts/ContactsWorkspace";

const ContactsPage = () => {

  /*
  const [user] = useCurrentUser()

  if (!user) {
    return (
      <StyledEmpty>
        <Link href="/login">
          <Button as="a">Sign in</Button>
        </Link>
      </StyledEmpty>
    )
  }*/

  return (
    <ContactsWorkspace />
  )
}

export default ContactsPage
