# Claim — a link shortener

A 3-page link shortener styled as a claim-ticket window: paste a long link, get
a short "ticket" back, and track how many times each one has been claimed.

**Pages**
- `/` — Home: paste a link, get a short one
- `/links.html` — My Links: every link created, with click counts
- `/:code` — not a real page — a serverless function that redirects to the original URL

**Storage:** Netlify Blobs (built into Netlify — no external database or signup needed).

## Deploy (GitHub → Netlify, like your other projects)

1. Push this whole folder to a new GitHub repo.
2. In Netlify: **Add new site → Import an existing project → GitHub** → pick the repo.
3. Build settings: leave **Build command** empty and **Publish directory** as `.`
   (already set in `netlify.toml`, so Netlify should pick this up automatically).
4. Deploy. Netlify will install `@netlify/blobs` automatically from `package.json`
   during the build — no extra environment variables or API keys needed.
5. Once live, test it: shorten a link on the homepage, then open the short link
   directly — it should redirect, and the click count on `/links.html` should go up.

## Notes

- Short codes are 6 characters, avoiding easily-confused characters (no `0/O`, `1/l/I`).
- Anyone with the site URL can see all links on `/links.html` — there's no login.
  If you want this private later, let me know and I can add a simple password gate.
- To change the look (colors, fonts, copy), everything is in `assets/style.css`.
