import nc from 'next-connect';
import { all } from '@/middlewares/index';
import { getTags, insertTag, updateTagById } from '@/db/index';

const handler = nc();

handler.use(all);

const maxAge = 1 * 24 * 60 * 60;

handler.get(async (req, res) => {
  if (!req.user) {
    return res.status(401).send('unauthenticated');
  }
  
  const tags = await getTags(
    req.db,
    {
      name: req.query.name ? req.query.name : undefined,
    }
  );

  res.send(tags);
});

handler.post(async (req, res) => {
  if (!req.user) {
    return res.status(401).send('unauthenticated');
  }

  if (!req.body.name) return res.status(400).send('Tags must have a name');

  const tag = await insertTag(req.db, {
    name: req.body.name,
    creatorId: req.user._id,
  });

  return res.json({ tag });
});

handler.patch(async (req, res) => {
  if (!req.user) {
    return res.status(401).send('unauthenticated')
  }

  if (!req.body._id) return res.status(400).send('No tag id')

  const payload = {
    ...req.body,
    lastModifiedBy: req.user._id
  }
  
  const tag = await updateTagById(req.db, req.body._id, payload)

  return res.json({ tag })
});

export default handler;
