import nextConnect from 'next-connect';
import { getCookie } from 'cookies-next';
import all from '../../middlewares/all';

import verifyAndRetrieveToken from '../../middlewares/verifyAndRetrieveToken';

const handler = nextConnect();

handler.use(all);

const domain = 'https://oo.directus.app';

const baseUrl = `${domain}/items/contacts`;

handler.get(async (req, res) => {

  const token = await verifyAndRetrieveToken(req, res);

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  /*
  console.log('tokenValidated', tokenValidated)

  if (!tokenValidated) {
    
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const token = getCookie('access_token', { req, res });
  */
  

  const fields = [
    'id',
    'first_name',
    'last_name',
    'email_1_address',
    'email_2_address',
    'email_3_address',
    'email_4_address',
    'email_5_address',
    'email_1_label',
    'email_2_label',
    'email_3_label',
    'email_4_label',
    'email_5_label',
    'phone_1_number',
    'phone_2_number',
    'phone_3_number',
    'phone_4_number',
    'phone_5_number',
    'phone_1_label',
    'phone_2_label',
    'phone_3_label',
    'phone_4_label',
    'phone_5_label',
    'company',
    'location',
    'name',
    'notes',
    'position',
    'organization.id',
    'organization.name',
    'social_bluesky',
    'social_facebook',
    'social_instagram',
    'social_linkedin',
    'social_mastodon',
    'social_substack',
    'social_threads',
    'social_x',
    'social_youtube',
    'tags.contact_tags_id',
    'type'
  ];

  const urlFields = fields.map( field => `fields[]=${field}`).join('&');

  const filters = [];

  if ( req.query.id ) {
    if ( req.query.id.includes(",") ) {
      const ids = req.query.id.split(',');
      const idFilters = [];
      ids.forEach( id => idFilters.push(`{"id":{ "_in":"${id}"}}`));
      filters.push(`{ "_or": [${idFilters.join(',')}] }`);
    }
    else {
      filters.push(`{"id":{ "_eq":"${req.query.id}"}}`);
    }
  }

  if ( req.query.first_name ) {
    const firstNamesFilters = [];
    if ( req.query.first_name.includes(",") ) {
      const firstNames = req.query.first_name.split(',');
      firstNames.forEach( name => firstNamesFilters.push(`{"first_name":{ "_icontains":"${name}"}}`));
      firstNames.forEach( name => firstNamesFilters.push(`{"first_name_normalized":{ "_icontains":"${name}"}}`));
    }
    else {
      firstNamesFilters.push(`{"first_name":{ "_icontains":"${req.query.first_name}"}}`);
      firstNamesFilters.push(`{"first_name_normalized":{ "_icontains":"${req.query.first_name}"}}`);
    }
    filters.push(`{ "_or": [${firstNamesFilters.join(',')}] }`);
  }

  if ( req.query.last_name ) {
    const lastNamesFilters = [];
    if ( req.query.last_name.includes(",") ) {
      const lastNames = req.query.last_name.split(',');
      lastNames.forEach( name => lastNamesFilters.push(`{"last_name":{ "_icontains":"${name}"}}`));
      lastNames.forEach( name => lastNamesFilters.push(`{"last_name_normalized":{ "_icontains":"${name}"}}`));
    }
    else {
      lastNamesFilters.push(`{"last_name":{ "_icontains":"${req.query.last_name}"}}`);
      lastNamesFilters.push(`{"last_name_normalized":{ "_icontains":"${req.query.last_name}"}}`);
    }
    filters.push(`{ "_or": [${lastNamesFilters.join(',')}] }`);
  }

  if ( req.query.name ) {
    const nameFilters = [];
    if ( req.query.name.includes(",") ) {
      const names = req.query.name.split(',');
      names.forEach( name => nameFilters.push(`{"name":{ "_icontains":"${name}"}}`));
      names.forEach( name => nameFilters.push(`{"name_normalized":{ "_icontains":"${name}"}}`));
    }
    else {
      nameFilters.push(`{"name":{ "_icontains":"${req.query.name}"}}`);
      nameFilters.push(`{"name_normalized":{ "_icontains":"${req.query.name}"}}`);
    }
    filters.push(`{ "_or": [${nameFilters.join(',')}] }`);
  }

  if ( req.query.email ) {
    const emailFilters = [];
    if ( req.query.email.includes(",") ) {
      const emails = req.query.email.split(',');
      emails.forEach( email => {
        emailFilters.push(`{"email_1_address":{ "_icontains":"${email}"}}`);
        emailFilters.push(`{"email_2_address":{ "_icontains":"${email}"}}`);
        emailFilters.push(`{"email_3_address":{ "_icontains":"${email}"}}`);
        emailFilters.push(`{"email_4_address":{ "_icontains":"${email}"}}`);
        emailFilters.push(`{"email_5_address":{ "_icontains":"${email}"}}`);
      });
    }
    else {
      emailFilters.push(`{"email_1_address":{ "_icontains":"${req.query.email}"}}`);
      emailFilters.push(`{"email_2_address":{ "_icontains":"${req.query.email}"}}`);
      emailFilters.push(`{"email_3_address":{ "_icontains":"${req.query.email}"}}`);
      emailFilters.push(`{"email_4_address":{ "_icontains":"${req.query.email}"}}`);
      emailFilters.push(`{"email_5_address":{ "_icontains":"${req.query.email}"}}`);
    }
    filters.push(`{ "_or": [${emailFilters.join(',')}] }`);

  }
  
  if ( req.query.phone ) {
    const phoneFilters = [];

    if ( req.query.phone.includes(",") ) {
      const phones = req.query.phone.split(',');
      phones.forEach( phone => {
        phoneFilters.push(`{"phone_1_number":{ "_icontains":"${phone}"}}`);
        phoneFilters.push(`{"phone_2_number":{ "_icontains":"${phone}"}}`);
        phoneFilters.push(`{"phone_3_number":{ "_icontains":"${phone}"}}`);
        phoneFilters.push(`{"phone_4_number":{ "_icontains":"${phone}"}}`);
        phoneFilters.push(`{"phone_5_number":{ "_icontains":"${phone}"}}`);
      });
    }
    else {
      phoneFilters.push(`{"phone_1_number":{ "_icontains":"${req.query.phone}"}}`);
      phoneFilters.push(`{"phone_2_number":{ "_icontains":"${req.query.phone}"}}`);
      phoneFilters.push(`{"phone_3_number":{ "_icontains":"${req.query.phone}"}}`);
      phoneFilters.push(`{"phone_4_number":{ "_icontains":"${req.query.phone}"}}`);
      phoneFilters.push(`{"phone_5_number":{ "_icontains":"${req.query.phone}"}}`);
    }
    filters.push(`{ "_or": [${phoneFilters.join(',')}] }`);
  }

  if ( req.query.company ) {
    if ( req.query.company.includes(",") ) {
      const companies = req.query.company.split(',');
      const companyFilters = [];
      companies.forEach( company => companyFilters.push(`{"company":{ "_icontains":"${company}"}}`));
      filters.push(`{ "_or": [${companyFilters.join(',')}] }`);
    }
    else {
      filters.push(`{"company":{ "_icontains":"${req.query.company}"}}`);
    }
  }

  if ( req.query.location ) {
    if ( req.query.location.includes(",") ) {
      const locations = req.query.location.split(',');
      const locationFilters = [];
      locations.forEach( location => locationFilters.push(`{"location":{ "_icontains":"${location}"}}`));
      filters.push(`{ "_or": [${locationFilters.join(',')}] }`);
    }
    else {
      filters.push(`{"location":{ "_icontains":"${req.query.location}"}}`);
    }
  }

  if ( req.query.notes ) {
    if ( req.query.notes.includes(",") ) {
      const notes = req.query.notes.split(',');
      const notesFilters = [];
      notes.forEach( note => notesFilters.push(`{"notes":{ "_icontains":"${note}"}}`));
      filters.push(`{ "_or": [${notesFilters.join(',')}] }`);
    }
    else {
      filters.push(`{"notes":{ "_icontains":"${req.query.notes}"}}`);
    }
  }

  if ( req.query.position ) {
    if ( req.query.position.includes(",") ) {
      const positions = req.query.position.split(',');
      const positionFilters = [];
      positions.forEach( position => positionFilters.push(`{"position":{ "_icontains":"${position}"}}`));
      filters.push(`{ "_or": [${positionFilters.join(',')}] }`);
    }
    else {
      filters.push(`{"position":{ "_icontains":"${req.query.position}"}}`);
    }
  }

  if ( req.query.social_x ) {
    filters.push(`{"social_x":{ "_icontains":"${req.query.social_x}"}}`);
  }

  if ( req.query.social_facebook ) {
    filters.push(`{"social_facebook":{ "_icontains":"${req.query.social_facebook}"}}`);
  }

  if ( req.query.social_instagram ) {
    filters.push(`{"social_instagram":{ "_icontains":"${req.query.social_instagram}"}}`);
  }

  if ( req.query.social_linkedin ) {
    filters.push(`{"social_linkedin":{ "_icontains":"${req.query.social_linkedin}"}}`);
  }

  if ( req.query.includeTags ) {
    const includeTags = req.query.includeTags.split(',');
    if ( req.query.includeTagsOperator === "and" ) {
      const includeTagsAndFilters = [];
      includeTags.forEach( tag => includeTagsAndFilters.push(`{"tags":{ "contact_tags_id": { "id": { "_in": ["${tag}"] } } } }`));
      filters.push(`{ "_and": [${includeTagsAndFilters.join(',')}] }`);
    }
    else {
      const includeTagsOr = `"${includeTags.join('","')}"`;
      //filters.push(`{"tags.contact_tags_id.id":{ "_in":[${includeTags}]}}`);
      filters.push(`{"tags":{ "contact_tags_id": { "id": { "_in":[${includeTagsOr}] } } } }`);
      //const includeTagsFilters = includeTags.map( tag => `{"tags":{ "contact_tags_id": "_icontains":"${tag}"}}`);
      //filters.push(`{ "_and": [${includeTagsFilters.join(',')}] }`);
    }
  }

  if ( req.query.excludeTags ) {
    const excludeTags = req.query.excludeTags.split(',');
    if ( req.query.excludeTagsOperator === "and" ) {
      const excludeTagsAndFilters = [];
      excludeTags.forEach( tag => excludeTagsAndFilters.push(`{"tags":{ "contact_tags_id": { "id": { "_nin": ["${tag}"] } } } }`));
      filters.push(`{ "_and": [${excludeTagsAndFilters.join(',')}] }`);
    }
    else {
      const excludeTagsOr = `"${excludeTags.join('","')}"`;
      //filters.push(`{"tags.contact_tags_id.id":{ "_nin":[${excludeTags}]}}`);
      filters.push(`{"tags":{ "_none": { "contact_tags_id": { "id": { "_in":[${excludeTagsOr}] } } } } }`);
      //const excludeTagsFilters = excludeTags.map( tag => `{"tags":{ "contact_tags_id": "_icontains":"${tag}"}}`);
      //filters.push(`{ "_and": [${excludeTagsFilters.join(',')}] }`);
    }
  }

  if ( req.query.type ) {
    if ( req.query.type.toLowerCase() === 'organization' ) {
      filters.push(`{"type":{ "_eq":"organization"}}`);
    }
    else if ( req.query.type.toLowerCase() === 'individual' ) {
      filters.push(`{"type":{ "_eq":"individual"}}`);
    }
  }

  const urlFilters = `filter={ "_and": [ ${filters.map( filter => filter).join(',')} ] }`;

  const sortField = req.query.sort_field ? req.query.sort_field : 'last_name';
  const sortDirection = req.query.sort_direction === 'desc' ? '-' : '';

  const urlSort = `sort=${sortDirection}${sortField}`;

  const urlMeta = `meta=*`;

  const requestedPage = req.query.page ? parseInt(req.query.page) : 1;
  const requestedLimit = req.query.limit ? parseInt(req.query.limit) : 100;

  const urlPage = `page=${requestedPage}`;
  const urlLimit = `limit=${requestedLimit}`;

  const url = `${baseUrl}?${urlFields}&${urlFilters}&${urlSort}&${urlMeta}&${urlPage}&${urlLimit}`;

  const data = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    credentials: 'include'
  }).then(res => res.json());

  data.meta.page = requestedPage;
  data.meta.limit = requestedLimit;

  res.json(data);
});

handler.post(async (req, res) => {

  const token = await verifyAndRetrieveToken(req, res);

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const payload = req.body;

  const request_method = req.body.id ? 'PATCH' : 'POST';

  let url = baseUrl;
  if ( req.body.id ) {
    url = `${baseUrl}/${req.body.id}`;
  } 

  const response = await fetch(url, {
    method: request_method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  }).then(res => res.json());

  return res.send(response);
  /*
  const contact = await insertContact(req.db, payload);
  
  if ( contact.error ) {
    console.log('merge attempt')
    const merge = await mergeContactByEmail( req.db, payload);

    return res.json(merge[0]);
  }
  
  return res.json(contact[0]);
  */

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
  
  return
})


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