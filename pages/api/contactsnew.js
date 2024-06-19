// pages/api/contacts.js
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db('contacts'); // replace with your database name

    const contacts = await db.collection('contacts').find({}).toArray();

    res.status(200).json(contacts);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to load data' });
  }
}
