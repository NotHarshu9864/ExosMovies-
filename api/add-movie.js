import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { title, thumbnail, video, type, token } = req.body;

  // Simple security token
  if (token !== 'EXOS_ADMIN_123') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!title || !thumbnail || !video || !type) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const filePath = path.join(process.cwd(), 'data/movies.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  data.movies.push({
    id: Date.now().toString(),
    title,
    thumbnail,
    video,
    type
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  res.json({ success: true });
}