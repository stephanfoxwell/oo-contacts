// pages/index.js
import { useEffect, useState } from 'react';

export default function Home({ initialContacts }) {
  const [contacts, setContacts] = useState(initialContacts);

  const downloadJsonFile = () => {
    const dataStr = JSON.stringify(contacts, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'contacts.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h1>{contacts.length} Contacts</h1>
      <button onClick={downloadJsonFile}>Download JSON</button>
    </div>
  );
}

export async function getServerSideProps() {
  const res = await fetch('http://localhost:3000/api/contactsnew'); // Adjust according to your server setup
  const initialContacts = await res.json();

  return {
    props: {
      initialContacts,
    },
  };
}
