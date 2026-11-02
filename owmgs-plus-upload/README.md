# OWMGS website (owmgs.com) on Cloudflare Workers

- `public/`: the website (all pages, pictures, ads.txt, sitemap)
- `worker.js`: WhatsApp chatbot at /api/whatsapp + safety settings
- `wrangler.jsonc`: tells Cloudflare what to publish

To update the website, change files in `public/` and commit. Cloudflare publishes automatically.
Never put Code.gs (Apps Script) in this repository: it contains your admin password.
