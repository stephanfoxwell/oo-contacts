import verifyAndRetrieveToken from '../middlewares/verifyAndRetrieveTokenAlt';

async function fetchTags() { 


  const domain = 'https://oo.directus.app';

  const baseUrl = `${domain}/items/contact_tags`;

  const token = await verifyAndRetrieveToken();

  if (!token) {
    return false;
  }

  const fields = [
    'id',
    'name',
    'description',
    'color',
    'count(contacts)',
    'is_closed',
    'is_restricted',
    'users.directus_users_id'
  ];

  const urlFields = fields.map( field => `fields[]=${field}`).join('&');

  const url = `${baseUrl}?sort=name&limit=-1&${urlFields}`;
  
  const data = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    credentials: 'include'
  }).then(res => res.json());

  return data;
}

export default fetchTags;