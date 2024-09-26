import React, { useEffect } from "react";
import { useRouter } from "next/router";
import ContactsWorkspace from "../components/contacts/ContactsWorkspace";

import verifyAndRetrieveToken from "../middlewares/verifyAndRetrieveToken";

export async function getServerSideProps(context) {
  const { req, res } = context;

  // Call your server-side function here
  const data = await verifyAndRetrieveToken(req, res);

  return {
    props: { data }, // will be passed to the page component as props
  };
}

const ContactsPage = ({ data }) => {

  const router = useRouter();

  useEffect(() => {
    if ( data === false ) {
      router.push('/login');
    }
  }, [data]);

  return (
    <>Maintenance in progress...</>
  )
  
  return (
    <ContactsWorkspace />
  )
}

export default ContactsPage
