import { getStore } from '@netlify/blobs';

const CODE_CHARS = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/l/I

function randomCode(length = 6) {
  let out = '';
  for (let i = 0; i < length; i++) {
    out += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return out;
}

function isValidUrl(value) {
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export default async (req, context) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400 });
  }

  const originalUrl = (body.url || '').trim();

  if (!isValidUrl(originalUrl)) {
    return new Response(JSON.stringify({ error: 'That doesn\'t look like a valid http(s) link.' }), { status: 400 });
  }

  const store = getStore('links');
  const siteUrl = new URL(req.url).origin;

  let code;
  for (let attempt = 0; attempt < 5; attempt++) {
    code = randomCode();
    const existing = await store.get(code);
    if (!existing) break;
    code = null;
  }

  if (!code) {
    return new Response(JSON.stringify({ error: 'Could not generate a unique code, try again.' }), { status: 500 });
  }

  const record = {
    code,
    originalUrl,
    clicks: 0,
    createdAt: Date.now()
  };

  await store.setJSON(code, record);

  return new Response(JSON.stringify({
    code,
    shortUrl: `${siteUrl}/${code}`,
    originalUrl
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
