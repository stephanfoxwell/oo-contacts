import { nanoid } from 'nanoid'
import { findTagsByName, maybeInsertTagsAndReturnIds, findTagsById } from './tag'

export async function findContactById(db, contactId) {
  return db.collection('contacts').findOne({
    _id: contactId,
  }).then((contact) => contact || null);
}
export async function findContactByEmail(db, email) {
  return db.collection('contacts').findOne({
    email: { $in : email },
  }).then((contact) => contact || null).catch((error) => console.log(error));
}

export async function getContacts(db, options ) {
  
  let params = {};

  const includeTagsOperator = options.includeTagsOperator === `and` ? '$all' : '$in'
  const excludeTagsOperator = options.excludeTagsOperator === `and` ? '$all' : '$in'

  if ( Array.isArray( options.includeTags ) && Array.isArray( options.excludeTags ) ) {
    params.tags = { 
      [includeTagsOperator] : options.includeTags,
      $not : {
        [excludeTagsOperator] : options.excludeTags
      }
    }
  }
  else if ( Array.isArray( options.includeTags ) ) {

    params.tags = { [includeTagsOperator] : options.includeTags }
  }
  else if ( Array.isArray( options.excludeTags ) ) {
    params.tags = { $not : { [excludeTagsOperator] : options.excludeTags } }
  }

  /*
  if ( options.tags && Array.isArray( options.tags ) ) {
    if ( options.tagsMatchOperator === 'exclude'  ) {
      
      if ( options.tagsOperator === `or`  ) {
        params.tags = { $not: { $in : options.tags } }
      }
      else if ( options.tagsOperator === `and` ) {
        params.tags = { $not: { $all : options.tags } }
      }
    }
    else {
      if ( options.tagsOperator === `or`  ) {
        params.tags = { $in : options.tags };
      }
      else if ( options.tagsOperator === `and` ) {
        params.tags = { $all : options.tags };
      }
    }
  }
  */

  let keywords = [];

  if ( options.firstName && options.firstName.length > 0 ) {
    const regexp = new RegExp(options.firstName,"gi")
    //params.firstName = { $regex : regexp }
    keywords.push({firstName: { $regex : regexp }});
  }
  if ( options.lastName && options.lastName.length > 0 ) {
    const regexp = new RegExp(options.lastName,"gi")
    //params.lastName = { $regex : regexp }
    keywords.push({lastName: { $regex : regexp }});
  }
  if ( options.email && options.email.length > 0 ) {
    const regexp = new RegExp(options.email,"gi")
    //params.email = { $regex : regexp }
    keywords.push({email: { $regex : regexp }});
  }
  if ( options.location && options.location.length > 0 ) {
    const regexp = new RegExp(options.location,"gi")
    //params.location = { $regex : regexp }
    keywords.push({location: { $regex : regexp }});
  }
  if ( options.notes && options.notes.length > 0 ) {
    const regexp = new RegExp(options.notes,"gi")
    //params.notes = { $regex : regexp }
    keywords.push({notes: { $regex : regexp }});
  }
  if ( options.company && options.company.length > 0 ) {
    const regexp = new RegExp(options.company,"gi")
    //params.company = { $regex : regexp }
    keywords.push({company: { $regex : regexp }});
  }
  if ( keywords.length > 0 ) {
    if ( options.keywordsOperator === `or`  ) {
      params.$or = keywords;
    }
    else if ( options.keywordsOperator === `and` ) {
      params.$and = keywords;
    }
  }
  
  const skip = options.page ? ((options.page - 1) * options.limit) : 0;
  const limit = options.limit || 100;

  const aggregate = limit > 1000 ? 
    [{
      '$sort': {
        'lastName': 1, 
        'firstName': 1,
        'email': 1
      }
    },
    {
      '$match': params
    }, {
      '$skip': skip
    }, {
      '$limit': limit
    }, {
      '$unwind': {
        'path': '$tags', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$lookup': {
        'from': 'tags', 
        'localField': 'tags', 
        'foreignField': '_id', 
        'as': 'tags'
      }
    }, {
      '$unwind': {
        'path': '$tags', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$group': {
        '_id': '$_id', 
        'root': {
          '$mergeObjects': '$$ROOT'
        }, 
        'tags': {
          '$push': '$tags'
        }
      }
    }, {
      '$replaceRoot': {
        'newRoot': {
          '$mergeObjects': [
            '$root', '$$ROOT'
          ]
        }
      }
    }, {
      '$project': {
        'root': 0
      }
    }]
    :
    [{
      '$sort': {
        'lastName': 1, 
        'firstName': 1,
        'email': 1
      }
    },
    {
      '$match': params
    }, {
      '$skip': skip
    }, {
      '$limit': limit
    }, {
      '$unwind': {
        'path': '$tags', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$lookup': {
        'from': 'tags', 
        'localField': 'tags', 
        'foreignField': '_id', 
        'as': 'tags'
      }
    }, {
      '$unwind': {
        'path': '$tags', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$group': {
        '_id': '$_id', 
        'root': {
          '$mergeObjects': '$$ROOT'
        }, 
        'tags': {
          '$push': '$tags'
        }
      }
    }, {
      '$replaceRoot': {
        'newRoot': {
          '$mergeObjects': [
            '$root', '$$ROOT'
          ]
        }
      }
    }, {
      '$project': {
        'root': 0
      }
    }, {
      '$sort': {
        'lastName': 1, 
        'firstName': 1,
        'email': 1
      }
    }]

  const contacts = await db
    .collection('contacts')
    .aggregate(
      aggregate,
      { 
        allowDiskUse: true,
        collation: { locale: 'en_US'}
      }
    ).toArray()
    /*
    .catch(error => console.log(error))
    .find(params)
    .skip(skip)
    .sort({ createdAt: -1 })
    .limit(limit)
    
    .toArray();*/

  const count = await db
    .collection('contacts')
    .find(params)
    .count();

  return {
    meta: {
      count: count,
      currentPage: options.page ? options.page : 1,
      currentPageRecordStart: skip + 1,
      currentPageRecordEnd: skip + contacts.length
    },
    items: contacts
  }
}

const filterTwitter = (twitter) => {
  if ( twitter.match(/twitter.com\//) ) {
    const split = twitter.split('twitter.com/')
    return split[1].replace(/\/$/, '').trim()
  }
  return twitter.replace(/\/$/, '').trim()
}
const filterInstagram = (instagram) => {
  if ( instagram.match(/instagram.com\//) ) {
    const split = instagram.split('instagram.com/')
    return split[1].replace(/\/$/, '').trim()
  }
  return instagram.replace(/\/$/, '').trim()
}

export async function insertContact(db, payload) {
  console.log('try to add')

  if ( await findContactByEmail(db, payload.email) ) {
    return {error: `duplicate`};
  }

  const filteredTags = payload?.tags ? payload?.tags?.map((tag) => tag.name ? tag.name : tag ) : []

  if ( filteredTags.length > 0 ) {
    const tagIds = await maybeInsertTagsAndReturnIds(db, filteredTags)
    payload.tags = tagIds
  }

  payload.twitter = filterTwitter(payload.twitter || '')
  payload.instagram = filterInstagram(payload.instagram || '')

  if ( ! payload.createdAt ) {
    payload.createdAt = new Date()
    payload.lastModifiedAt = new Date()
  }
  
  return db.collection('contacts').insertOne({
    _id: nanoid(),
    ...payload,
  })
  .then(({ ops }) => {
    console.log('added')
    /*const tags = payload.tags
    if ( Array.isArray( tags ) ) {
      let formattedTags = [];
      for ( const tag in tags ) {
        if ( tags[tag].trim() !== "" ) {
          formattedTags.push({ 
            _id: nanoid(),
            name: tags[tag].trim().toLowerCase(),
            creatorId: payload.creatorId,
            createdAt: new Date(),
          });
        }
      }
      db.collection('tags')
      .insertMany(formattedTags, {ordered: false})
      .then(() => {})
      .catch((error) => { console.log(error)} );
    }*/
    return ops;
  })
  .catch((error) => {
    console.log('error');
    error && console.log(error);
    if ( error && error.keyValue.email ) {
      return {error: `duplicate`};
    }
  });
}

export async function mergeContactByEmail(db, update) {

  const contact = await findContactByEmail(db, update.email)

  if ( contact && contact._id ) {
    console.log('contact found')
    const currentTags = await findTagsById(db, (contact.tags || []) )
    const mergedTags = [...new Set([
      ...currentTags,
      ...(update.tags || [])
    ])].filter(function (el) {
      return el != ``;
    })

    const filteredTags = mergedTags ? mergedTags?.map((tag) => tag.name ? tag.name : tag ) : []
    
    let filteredTagIds = []
    if ( filteredTags.length > 0 ) {
      filteredTagIds = await maybeInsertTagsAndReturnIds(db, filteredTags)
    }

    const mergedNotes = ( update.notes && update.notes !== `` && update.notes !== contact.notes) ? `${( contact.notes !== `` ? `${contact.notes} \r\n` : `` )}${update.notes}` : contact.notes;
    
    const maybeMerge = ( key ) => {
      return ((contact[key] && contact[key] !== '') ? contact[key] : ( update[key] || '' ))
    }

    const mergeSets = key => {
       return [...new Set([
        ...(contact[key] || []),
        ...(update[key] ||[])
      ])].filter(function (el) {
        return el != ``;
      })
    }

    const newValues = {
      firstName: maybeMerge('firstName'), 
      lastName: maybeMerge('lastName'),
      email: mergeSets('email'),
      phone: mergeSets('phone'),
      twitter: filterTwitter( maybeMerge('twitter') ),
      instagram: filterInstagram( maybeMerge('instagram') ),
      linkedin: maybeMerge('linkedin'),
      facebook: maybeMerge('facebook'),
      notes: mergedNotes,
      position: maybeMerge('position'),
      company: maybeMerge('company'),
      tags: filteredTagIds,
      optOut: maybeMerge('optOut'),
      location: maybeMerge('location'),
      lastModifiedBy: update.lastModifiedBy
    }

    return db.collection('contacts').findOneAndUpdate(
      { _id: contact._id },
      { $set: newValues },
      { returnOriginal: false },
    ).then(({ value }) => {
      return value
    })
  }
}

export async function updateContactById(db, id, update) {

  update.lastModifiedAt = new Date()

  const filteredTags = update?.tags ? update?.tags?.map((tag) => tag.name ? tag.name : tag ) : []

  if ( filteredTags.length > 0 ) {
    const tagIds = await maybeInsertTagsAndReturnIds(db, filteredTags)
    update.tags = tagIds
  }
  if ( update.twitter ) {
    update.twitter = filterTwitter(update.twitter)
  }
  if ( update.instagram ) {
    update.instagram = filterInstagram(update.instagram)
  }

  return db.collection('contacts').findOneAndUpdate(
    { _id: id },
    { $set: update },
    { returnOriginal: false },
  ).then(({ value }) => {
    return value
    /*if ( Array.isArray( update.tags ) ) {
      let formattedTags = [];
      for ( const tag in update.tags ) {
        if ( update.tags[tag].trim() !== "" ) {
          formattedTags.push({ 
            _id: nanoid(),
            name: update.tags[tag].trim().toLowerCase(),
            creatorId: update.creatorId,
            createdAt: new Date(),
          });
        }
      }
      db.collection('tags')
        .insertMany(formattedTags, {ordered: false})
        .then(() => {})
        .catch((error) => console.log(error) );
    }*/
  });
}

export async function deleteContactById(db, id) {
  return db.collection('contacts').deleteOne({ _id: id });
}