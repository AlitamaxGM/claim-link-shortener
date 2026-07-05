import { getStore } from '@netlify/blobs';

export default async (req, context) => {
  const url = new URL(req.url);
  const code = context.params.code || url.searchParams.get('code');

  if (!code) {
    return new Response('Missing code', { status: 400 });
  }

  const store = getStore('links');
  const record = await store.get(code, { type: 'json' });

  if (!record) {
    return new Response(
      `<!doctype html><html><head><meta charset="utf-8"><title>Ticket not found</title>
      <style>body{font-family:sans-serif;background:#14171A;color:#ECEAE3;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;text-align:center}
      a{color:#2EC4B6}</style></head>
      <body><div><h1>This ticket doesn't exist</h1><p>The link may have been mistyped or never created. <a href="/">Create a new one</a>.</p></div></body></html>`,
      { status: 404, headers: { 'Content-Type': 'text/html' } }
    );
  }

  record.clicks = (record.clicks || 0) + 1;
  await store.setJSON(code, record);

  return new Response(null, {
    status: 302,
    headers: { Location: record.originalUrl }
  });
};

export const config = {
  path: '/:code'
};
