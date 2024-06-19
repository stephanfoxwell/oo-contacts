import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Error from 'next/error';
import { all } from '@/middlewares/index';
import { useCurrentUser } from '@/hooks/index';
import { extractContact } from '@/lib/api-helpers';
import { findContactById } from '@/db/index';
import { defaultProfilePicture } from '@/lib/default';

export default function UserPage({ contact }) {
  if (!contact) return <Error statusCode={404} />;
  const {
    firstName, lastName, email, notes, _id
  } = contact || {};
  /*
  const [currentUser] = useCurrentUser();
  const isCurrentUser = currentUser?._id === user._id;
  */
  return (
    <>
      <style jsx>
        {`
          h2 {
            text-align: left;
            margin-right: 0.5rem;
          }
          button {
            margin: 0 0.25rem;
          }
          img {
            width: 10rem;
            height: auto;
            border-radius: 50%;
            box-shadow: rgba(0, 0, 0, 0.05) 0 10px 20px 1px;
            margin-right: 1.5rem;
            background-color: #f3f3f3;
          }
          div {
            color: #777;
          }
          p {
            font-family: monospace;
            color: #444;
            margin: 0.25rem 0 0.75rem;
          }
          a {
            margin-left: 0.25rem;
          }
        `}
      </style>
      <Head>
        <title>{firstName}</title>
      </Head>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <section>
          <div>
            <h2>{firstName}</h2>
          </div>
          Email
          <p>
            <input type="email" name="email" value={email} />
          </p>
        </section>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  await all.run(context.req, context.res);
  const contact = extractContact(await findContactById(context.req.db, context.params.contactId));
  if (!contact) context.res.statusCode = 404;
  return { props: { contact } };
}
