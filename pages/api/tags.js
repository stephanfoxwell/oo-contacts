import nextConnect from 'next-connect';
import { getCookie } from 'cookies-next';
import all from '../../middlewares/all';

import verifyAndRetrieveToken from '../../middlewares/verifyAndRetrieveToken';

const handler = nextConnect();

handler.use(all);

const baseUrl = 'https://oo.directus.app/items/contact_tags';

handler.get(async (req, res) => {

  const token = await verifyAndRetrieveToken(req, res);

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
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

  const filters = [];

  if ( req.query.name ) {
    filters.push(`{"name":{ "_icontains":"${req.query.name}"}}`);
  }

  if ( req.query.description ) {
    filters.push(`{"description":{ "_icontains":"${req.query.description}"}}`);
  }

  const urlFilters = filters.map( filter => `filter=${filter}`).join('&');

  const url = `${baseUrl}?sort=name&limit=-1&${urlFields}&${urlFilters}`;
  
  const data = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    credentials: 'include'
  }).then(res => res.json());

  res.json(data);
});


handler.patch(async (req, res) => {

  const token = await verifyAndRetrieveToken(req, res);

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if ( ! req.body.id) {
    return res.status(400).send('No contact id');
  }

  const payload = {
    ...req.body,
  };

  const url = `${baseUrl}/${req.body.id}`;

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  }).then(res => res.json());

  

  res.send(response);

  return;
});


export default handler;


/*
import nc from 'next-connect';
import { all } from '@/middlewares/index';
import { getContacts, insertContact, mergeContactByEmail, updateContactById, deleteContactById } from '@/db/index';


const handler = nc();

handler.use(all);

const maxAge = 1 * 24 * 60 * 60;

handler.get(async (req, res) => {
  if (!req.user) {
    return res.status(401).send('unauthenticated');
  }
  const params = {
    page: req.query.page ? parseInt(req.query.page, 10) : undefined,
    limit: req.query.limit ? parseInt(req.query.limit, 10) : 100,
    firstName: req.query.firstName ? req.query.firstName : undefined,
    lastName: req.query.lastName ? req.query.lastName : undefined,
    email: req.query.email ? req.query.email : undefined,
    tags: req.query.tags ? decodeURIComponent(req.query.tags).split(',') : undefined,
    location: req.query.location ? req.query.location : undefined,
    notes: req.query.notes ? req.query.notes : undefined,
    company: req.query.company ? req.query.company : undefined,
    keywordsOperator: req.query.keywordsOperator ? req.query.keywordsOperator : `or`,
    includeTagsOperator: req.query.includeTagsOperator ? req.query.includeTagsOperator : `or`,
    includeTags: req.query.includeTags ? decodeURIComponent(req.query.includeTags).split(',') : undefined,
    excludeTagsOperator: req.query.excludeTagsOperator ? req.query.excludeTagsOperator : `or`,
    excludeTags: req.query.excludeTags ? decodeURIComponent(req.query.excludeTags).split(',') : undefined,
  }
  const contacts = await getContacts(
    req.db,
    params
  );
  

  if (req.query.from && posts.length > 0) {
    // This is safe to cache because from defines
    //  a concrete range of posts
    res.setHeader('cache-control', `public, max-age=${maxAge}`);
  }

  res.send(contacts);
});

handler.post(async (req, res) => {
  if (!req.user) {
    return res.status(401).send('unauthenticated');
  }

  //if (!req.body.content) return res.status(400).send('You must write something');

  const payload = req.body
  
  if ( ! payload.creatorId ) {
    payload.creatorId = req.user._id
    payload.lastModifiedBy = req.user._id
  }

  const contact = await insertContact(req.db, payload);
  
  if ( contact.error ) {
    console.log('merge attempt')
    const merge = await mergeContactByEmail( req.db, payload);

    return res.json(merge[0]);
  }
  
  return res.json(contact[0]);

});

handler.patch(async (req, res) => {
  if (!req.user) {
    return res.status(401).send('unauthenticated')
  }

  if (!req.body._id) return res.status(400).send('No contact id')

  const payload = {
    ...req.body,
    lastModifiedBy: req.user._id
  }
  
  const contact = await updateContactById(req.db, req.body._id, payload)

  res.send(contact)
  
  return
})

handler.delete(async (req, res) => {
  if (!req.user) {
    return res.status(401).send('unauthenticated');
  }

  if (!req.body._id) return res.status(400).send('No contact id');
  
  const contact = await deleteContactById(req.db, req.body._id);

  return res.json({ contact });
});

export default handler;

*/