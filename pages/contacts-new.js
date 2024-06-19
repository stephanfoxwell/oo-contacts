// pages/index.js
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { directus, readItems } from '../middlewares/directusClient';
import Login from '../components/Login';


const fetchItems = async () => {
  const result = await directus.request(readItems("contacts"));
  return result;
};

export default function Home() {
  const { data, error, isLoading } = useQuery({ queryKey: ['contacts'], queryFn: fetchItems });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div>
      <h1>Items</h1>
      <ul>
        {data.map((item) => (
          <li key={item.id}>{item.first_name}</li>
        ))}
      </ul>
    </div>
  );
}
