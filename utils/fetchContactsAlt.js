import verifyAndRetrieveToken from '../middlewares/verifyAndRetrieveTokenAlt';

async function fetchContacts( filters, pageIndex = 1, limit = 100 ) {

  const domain = 'https://oo.directus.app';

  const baseUrl = `${domain}/items/contacts`;

  const token = await verifyAndRetrieveToken();


  if (!token) {
    return false;
  }

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

  const formattedFilters = [];

  if ( filters.first_name ) {
    const firstNamesFilters = [];
    if (  Array.isArray(filters.first_name) ) {
      const firstNames = filters.first_name;
      firstNames.forEach( name => firstNamesFilters.push(`{"first_name":{ "_icontains":"${name}"}}`));
      firstNames.forEach( name => firstNamesFilters.push(`{"first_name_normalized":{ "_icontains":"${name}"}}`));
    }
    else {
      firstNamesFilters.push(`{"first_name":{ "_icontains":"${filters.first_name}"}}`);
      firstNamesFilters.push(`{"first_name_normalized":{ "_icontains":"${filters.first_name}"}}`);
    }
    formattedFilters.push(`{ "_or": [${firstNamesFilters.join(',')}] }`);
  }

  if ( filters.last_name ) {
    const lastNamesFilters = [];
    if ( Array.isArray( filters.last_name ) ) {
      const lastNames = filters.last_name;
      lastNames.forEach( name => lastNamesFilters.push(`{"last_name":{ "_icontains":"${name}"}}`));
      lastNames.forEach( name => lastNamesFilters.push(`{"last_name_normalized":{ "_icontains":"${name}"}}`));
    }
    else {
      lastNamesFilters.push(`{"last_name":{ "_icontains":"${filters.last_name}"}}`);
      lastNamesFilters.push(`{"last_name_normalized":{ "_icontains":"${filters.last_name}"}}`);
    }
    formattedFilters.push(`{ "_or": [${lastNamesFilters.join(',')}] }`);
  }

  if ( filters.name ) {
    const nameFilters = [];
    if ( Array.isArray(filters.name) ) {
      const names = filters.name;
      names.forEach( name => nameFilters.push(`{"name":{ "_icontains":"${name}"}}`));
      names.forEach( name => nameFilters.push(`{"name_normalized":{ "_icontains":"${name}"}}`));
    }
    else {
      nameFilters.push(`{"name":{ "_icontains":"${filters.name}"}}`);
      nameFilters.push(`{"name_normalized":{ "_icontains":"${filters.name}"}}`);
    }
    formattedFilters.push(`{ "_or": [${nameFilters.join(',')}] }`);
  }

  if ( filters.email ) {
    const emailFilters = [];
    if ( Array.isArray(filters.email) ) {
      const emails = filters.email;
      emails.forEach( email => {
        emailFilters.push(`{"email_1_address":{ "_icontains":"${email}"}}`);
        emailFilters.push(`{"email_2_address":{ "_icontains":"${email}"}}`);
        emailFilters.push(`{"email_3_address":{ "_icontains":"${email}"}}`);
        emailFilters.push(`{"email_4_address":{ "_icontains":"${email}"}}`);
        emailFilters.push(`{"email_5_address":{ "_icontains":"${email}"}}`);
      });
    }
    else {
      emailFilters.push(`{"email_1_address":{ "_icontains":"${filters.email}"}}`);
      emailFilters.push(`{"email_2_address":{ "_icontains":"${filters.email}"}}`);
      emailFilters.push(`{"email_3_address":{ "_icontains":"${filters.email}"}}`);
      emailFilters.push(`{"email_4_address":{ "_icontains":"${filters.email}"}}`);
      emailFilters.push(`{"email_5_address":{ "_icontains":"${filters.email}"}}`);
    }
    formattedFilters.push(`{ "_or": [${emailFilters.join(',')}] }`);

  }
  
  if ( filters.phone ) {
    const phoneFilters = [];

    if ( Array.isArray(filters.phone) ) {
      const phones = filters.phone;
      phones.forEach( phone => {
        phoneFilters.push(`{"phone_1_number":{ "_icontains":"${phone}"}}`);
        phoneFilters.push(`{"phone_2_number":{ "_icontains":"${phone}"}}`);
        phoneFilters.push(`{"phone_3_number":{ "_icontains":"${phone}"}}`);
        phoneFilters.push(`{"phone_4_number":{ "_icontains":"${phone}"}}`);
        phoneFilters.push(`{"phone_5_number":{ "_icontains":"${phone}"}}`);
      });
    }
    else {
      phoneFilters.push(`{"phone_1_number":{ "_icontains":"${filters.phone}"}}`);
      phoneFilters.push(`{"phone_2_number":{ "_icontains":"${filters.phone}"}}`);
      phoneFilters.push(`{"phone_3_number":{ "_icontains":"${filters.phone}"}}`);
      phoneFilters.push(`{"phone_4_number":{ "_icontains":"${filters.phone}"}}`);
      phoneFilters.push(`{"phone_5_number":{ "_icontains":"${filters.phone}"}}`);
    }
    formattedFilters.push(`{ "_or": [${phoneFilters.join(',')}] }`);
  }

  if ( filters.company ) {
    if ( Array.isArray(filters.company) ) {
      const companies = filters.company;
      const companyFilters = [];
      companies.forEach( company => companyFilters.push(`{"company":{ "_icontains":"${company}"}}`));
      formattedFilters.push(`{ "_or": [${companyFilters.join(',')}] }`);
    }
    else {
      formattedFilters.push(`{"company":{ "_icontains":"${filters.company}"}}`);
    }
  }

  if ( filters.location ) {
    if ( Array.isArray(filters.location) ) {
      const locations = filters.location;
      const locationFilters = [];
      locations.forEach( location => locationFilters.push(`{"location":{ "_icontains":"${location}"}}`));
      formattedFilters.push(`{ "_or": [${locationFilters.join(',')}] }`);
    }
    else {
      formattedFilters.push(`{"location":{ "_icontains":"${filters.location}"}}`);
    }
  }

  if ( filters.notes ) {
    if ( Array.isArray(filters.notes) ) {
      const notes = filters.notes;
      const notesFilters = [];
      notes.forEach( note => notesFilters.push(`{"notes":{ "_icontains":"${note}"}}`));
      formattedFilters.push(`{ "_or": [${notesFilters.join(',')}] }`);
    }
    else {
      formattedFilters.push(`{"notes":{ "_icontains":"${filters.notes}"}}`);
    }
  }

  if ( filters.position ) {
    if ( Array.isArray(filters.position) ) {
      const positions = filters.position;
      const positionFilters = [];
      positions.forEach( position => positionFilters.push(`{"position":{ "_icontains":"${position}"}}`));
      formattedFilters.push(`{ "_or": [${positionFilters.join(',')}] }`);
    }
    else {
      formattedFilters.push(`{"position":{ "_icontains":"${filters.position}"}}`);
    }
  }

  if ( filters.social_x ) {
    formattedFilters.push(`{"social_x":{ "_icontains":"${filters.social_x}"}}`);
  }

  if ( filters.social_facebook ) {
    formattedFilters.push(`{"social_facebook":{ "_icontains":"${filters.social_facebook}"}}`);
  }

  if ( filters.social_instagram ) {
    formattedFilters.push(`{"social_instagram":{ "_icontains":"${filters.social_instagram}"}}`);
  }

  if ( filters.social_linkedin ) {
    formattedFilters.push(`{"social_linkedin":{ "_icontains":"${filters.social_linkedin}"}}`);
  }

  if ( filters.includeTags && filters.includeTags.length > 0) {
    //const includeTags = filters.includeTags.split(',');
    const includeTags = filters.includeTags;
    if ( filters.includeTagsOperator === "and" ) {
      const includeTagsAndFilters = [];
      includeTags.forEach( tag => includeTagsAndFilters.push(`{"tags":{ "contact_tags_id": { "id": { "_in": ["${tag}"] } } } }`));
      formattedFilters.push(`{ "_and": [${includeTagsAndFilters.join(',')}] }`);
    }
    else {
      const includeTagsOr = `"${includeTags.join('","')}"`;
      //formattedFilters.push(`{"tags.contact_tags_id.id":{ "_in":[${includeTags}]}}`);
      formattedFilters.push(`{"tags":{ "contact_tags_id": { "id": { "_in":[${includeTagsOr}] } } } }`);
      //const includeTagsFilters = includeTags.map( tag => `{"tags":{ "contact_tags_id": "_icontains":"${tag}"}}`);
      //formattedFilters.push(`{ "_and": [${includeTagsFilters.join(',')}] }`);
    }
  }

  if ( filters.excludeTags && filters.excludeTags.length > 0) {
    //const excludeTags = filters.excludeTags.split(',');
    const excludeTags = filters.excludeTags;
    if ( filters.excludeTagsOperator === "and" ) {
      const excludeTagsAndFilters = [];
      excludeTags.forEach( tag => excludeTagsAndFilters.push(`{"tags":{ "contact_tags_id": { "id": { "_nin": ["${tag}"] } } } }`));
      formattedFilters.push(`{ "_and": [${excludeTagsAndFilters.join(',')}] }`);
    }
    else {
      const excludeTagsOr = `"${excludeTags.join('","')}"`;
      //formattedFilters.push(`{"tags.contact_tags_id.id":{ "_nin":[${excludeTags}]}}`);
      formattedFilters.push(`{"tags":{ "_none": { "contact_tags_id": { "id": { "_in":[${excludeTagsOr}] } } } } }`);
      //const excludeTagsFilters = excludeTags.map( tag => `{"tags":{ "contact_tags_id": "_icontains":"${tag}"}}`);
      //formattedFilters.push(`{ "_and": [${excludeTagsFilters.join(',')}] }`);
    }
  }

  if ( filters.type ) {
    if ( filters.type.toLowerCase() === 'organization' ) {
      formattedFilters.push(`{"type":{ "_eq":"organization"}}`);
    }
    else if ( filters.type.toLowerCase() === 'individual' ) {
      formattedFilters.push(`{"type":{ "_eq":"individual"}}`);
    }
  }

  const urlFilters = `filter={ "_and": [ ${formattedFilters.map( filter => filter).join(',')} ] }`;

  const sortField = filters.sort_field ? filters.sort_field : 'last_name';
  const sortDirection = filters.sort_direction === 'desc' ? '-' : '';

  const urlSort = `sort=${sortDirection}${sortField}`;

  const urlMeta = `meta=*`;

  const requestedPage = pageIndex ? parseInt(pageIndex) : 1;
  const requestedLimit = limit ? parseInt(limit) : 100;

  const urlPage = `page=${requestedPage}`;
  const urlLimit = `limit=${requestedLimit}`;

  let url = `${baseUrl}?${urlFields}&${urlFilters}&${urlSort}&${urlMeta}&${urlPage}&${urlLimit}`;


  if ( filters.id ) {
    url = `${baseUrl}${filters.id}`;
  }

  console.log(url)

  const data = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    credentials: 'include'
  }).then(res => res.json());

  data.meta.page = requestedPage;
  data.meta.limit = requestedLimit;

  return data;

}

export default fetchContacts;