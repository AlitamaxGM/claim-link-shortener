import { getStore } from '@netlify/blobs';

export default async (req, context) => {
  const store = getStore('links');
  const siteUrl = new URL(req.url).origin;

  const { blobs } = await store.list();

  const links = await Promise.all(
    blobs.map(async (b) => {
      const record = await store.get(b.key, { type: 'json' });
      if (!record) return null;
      return {
        code: record.code,
        shortUrl: `${siteUrl}/${record.code}`,
        originalUrl: record.originalUrl,
        clicks: record.clicks || 0,
        createdAt: record.createdAt || 0
      };
    })
  );

  return new Response(JSON.stringify({ links: links.filter(Boolean) }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
