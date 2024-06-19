import { nanoid } from 'nanoid';

export async function findTagById(db, tagId) {
  return db.collection('tags').findOne({
    _id: tagId,
  }).then((tag) => tag || null);
}

export async function findTagByName(db, name) {
  const regexp = new RegExp(`^${name}$`, 'gi')
  return db.collection('tags').findOne({
    name: { $regex: regexp },
  }).then((tag) => tag || false).catch(error => console.log(error));
}

export async function findTagsByName(db, names) {
  const regexpNames = names.map((item) => new RegExp(`^${item}$`, 'i'))
  return db.collection('tags').find({
    name: { $in: regexpNames }
  }).toArray().catch(error => console.log(error))
}
export async function findTagsById(db, ids) {
  return db.collection('tags').find({
    _id: { $in: ids }
  }).toArray().catch(error => console.log(error))
}

export async function getTags(db, options ) {

  let params = {}

  if ( options.name && options.name.length > 0 ) {
    const regexp = new RegExp(options.name,"gi")
    params.name = { $regex: regexp }
  }

  return await db
    .collection('tags')
    .find(params)
    .collation({'locale':'en'})
    .sort({ 'name': 1 })
    .limit(1000)
    .toArray();

}

export async function insertTag(db, { name, creatorId }) {
  const currentTag = await findTagByName(db, name)

  if ( currentTag ) {
    return currentTag
  }

  return db.collection('tags').insertOne({
    _id: nanoid(),
    name,
    creatorId,
    createdAt: new Date(),
  }).then(({ ops }) => ops[0]).catch(error => console.log(error));
}

export async function maybeInsertTagsAndReturnIds(db, tags) {
  for ( const tag in tags ) {
    if ( (typeof tags[tag] === 'string' || tags[tag] instanceof String) && tags[tag].trim() !== '' ) {
      await insertTag(db, {
        name: tags[tag]
      })
    }
  }
  const foundTags = await findTagsByName(db, tags)
  const tagIds = foundTags.map(tag => tag._id)
  return tagIds
}

export async function updateTagById(db, id, update) {

  update.lastModifiedAt = new Date()

  return db.collection('tags').findOneAndUpdate(
    { _id: id },
    { $set: update },
    { returnOriginal: false },
  ).then(({ value }) => value);
}