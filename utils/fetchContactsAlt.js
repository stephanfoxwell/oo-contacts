import verifyAndRetrieveToken from '../middlewares/verifyAndRetrieveTokenAlt';

async function fetchContacts( filters, pageIndex = 1, limit = 100 ) {

  const domain = 'https://oo.directus.app';

  const baseUrl = `${domain}/items/contacts`;

  const token = await verifyAndRetrieveToken();


  if (!token) {
    return [];
  }

  const fields = [
    'id',
    'date_created',
    'date_updated',
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
    'type',
    'user_created.first_name',
    'user_created.last_name',
    'user_updated.first_name',
    'user_updated.last_name',
  ];

  const urlFields = fields.map( field => `fields[]=${field}`).join('&');

  const formattedFilters = [];

  const keywordFilters = [];

  formattedFilters.push(`{"status":{ "_eq":"published"}}`)

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
    keywordFilters.push(`{ "_or": [${firstNamesFilters.join(',')}] }`);
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
    keywordFilters.push(`{ "_or": [${lastNamesFilters.join(',')}] }`);
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
    keywordFilters.push(`{ "_or": [${nameFilters.join(',')}] }`);
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
    keywordFilters.push(`{ "_or": [${emailFilters.join(',')}] }`);

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
    keywordFilters.push(`{ "_or": [${phoneFilters.join(',')}] }`);
  }

  if ( filters.company ) {
    if ( Array.isArray(filters.company) ) {
      const companies = filters.company;
      const companyFilters = [];
      companies.forEach( company => companyFilters.push(`{"company":{ "_icontains":"${company}"}}`));
      keywordFilters.push(`{ "_or": [${companyFilters.join(',')}] }`);
    }
    else {
      keywordFilters.push(`{"company":{ "_icontains":"${filters.company}"}}`);
    }
  }

  if ( filters.location ) {
    if ( Array.isArray(filters.location) ) {
      const locations = filters.location;
      const locationFilters = [];
      locations.forEach( location => locationFilters.push(`{"location":{ "_icontains":"${location}"}}`));
      keywordFilters.push(`{ "_or": [${locationFilters.join(',')}] }`);
    }
    else {
      keywordFilters.push(`{"location":{ "_icontains":"${filters.location}"}}`);
    }
  }

  if ( filters.notes ) {
    if ( Array.isArray(filters.notes) ) {
      const notes = filters.notes;
      const notesFilters = [];
      notes.forEach( note => notesFilters.push(`{"notes":{ "_icontains":"${note}"}}`));
      keywordFilters.push(`{ "_or": [${notesFilters.join(',')}] }`);
    }
    else {
      keywordFilters.push(`{"notes":{ "_icontains":"${filters.notes}"}}`);
    }
  }

  if ( filters.position ) {
    if ( Array.isArray(filters.position) ) {
      const positions = filters.position;
      const positionFilters = [];
      positions.forEach( position => positionFilters.push(`{"position":{ "_icontains":"${position}"}}`));
      keywordFilters.push(`{ "_or": [${positionFilters.join(',')}] }`);
    }
    else {
      keywordFilters.push(`{"position":{ "_icontains":"${filters.position}"}}`);
    }
  }

  if ( filters.keywordsOperator === 'and' ) {
    formattedFilters.push(`{ "_and": [${keywordFilters.join(',')}] }`);
  }
  else {
    formattedFilters.push(`{ "_or": [${keywordFilters.join(',')}] }`);
  }
    


  if ( filters.includeTags && filters.includeTags.length > 0) {
    const includeTags = filters.includeTags;
    const tagsFilters = [];
    if ( filters.includeTagsOperator === "and" ) {
      includeTags.forEach( tag_id => tagsFilters.push(`{"tag_ids":{"_icontains":"${tag_id}"}}`));
      formattedFilters.push(`{ "_and": [${tagsFilters.join(',')}] }`);
    }
    else {
      includeTags.forEach( tag_id => tagsFilters.push(`{"tag_ids":{"_icontains":"${tag_id}"}}`));
      formattedFilters.push(`{ "_or": [${tagsFilters.join(',')}] }`);
    }
  }
  /*
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
    */
 // TODO: examine this logic to match include tags
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

  //console.log(formattedFilters)

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
    url = `${baseUrl}/${filters.id}?${urlFields}`;
  }

  //console.log(url)

  const data = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    credentials: 'include'
  }).then(res => res.json());

  if ( ! filters.id ) {
    data.meta.page = requestedPage;
    data.meta.limit = requestedLimit;
  }

  return data;

}

export default fetchContacts;