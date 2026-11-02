/**
 * OWMGS WhatsApp chatbot  (runs on Cloudflare Pages, address: https://owmgs.com/api/whatsapp)
 * This file is  worker.js  (next to wrangler.jsonc). Your web pages live in the  public  folder.
 *   /api/whatsapp → the chatbot below;  private paths → blocked;  everything else → your pages, with safety headers.
 *
 * Meta's WhatsApp Cloud API sends every customer message here. The bot answers with menus:
 *   Apps & Software · Design & Printing · Teacher Resources · Latest news · Talk to a person
 * Apps, resources, news and contact details come LIVE from your Google Sheet (same as the website),
 * so when you change them in admin.html the bot changes too.
 *
 * Settings live in Cloudflare → Workers & Pages → owmgs-plus → Settings → Variables and Secrets (never in this file).
 * Add each one as type "Secret" (encrypted), then redeploy:
 *   WA_TOKEN        Meta access token (permanent "System user" token)
 *   WA_PHONE_ID     Phone number ID of the bot number (from Meta → WhatsApp → API Setup)
 *   WA_VERIFY_TOKEN Any secret phrase you invent; type the same phrase in Meta's webhook setup
 *   WA_APP_SECRET   Meta App secret (App settings → Basic). Used to check messages really come from Meta.
 *   API_URL         Your Apps Script Web App link (ends with /exec), the same one as in index.html
 *   BOT_SECRET      Any secret phrase you invent; the SAME phrase must be in Code.gs (BOT_SECRET)
 *   SITE_URL        Optional: your website, e.g. https://owmgs.netlify.app
 *   GRAPH_VERSION   Optional: Meta API version (default v23.0)
 */
let ENV = {};                                   // filled from Cloudflare on every request
const env = (k, d = "") => (ENV[k] ?? d);

/* ---------------- design services the bot can talk about ---------------- */
const DESIGN = [
  ["poster", "Posters", "A3 · A2 · A1", "Events, programmes, campaigns and school open days."],
  ["flyer", "Flyers & Handbills", "A5 · A4", "Admissions, church programmes and business promotions."],
  ["banner", "Banners", "6×3 ft · 8×4 ft · roll-up", "PVC and flex banners for gates, stages and shops."],
  ["tshirt", "T-shirt Designs", "Front · back · sleeve", "Graduation, sports day, church and club shirts."],
  ["invite", "Invitation Cards", "A6 · 5×7 in", "Weddings, funerals, birthdays and launches."],
  ["cert", "Certificates", "A4 landscape", "Awards, workshops, quiz and sports competitions."],
  ["card", "Business & ID Cards", "85×55 mm · CR80", "Staff ID, business cards and name tags."],
  ["social", "Social Media Flyers", "1080×1080 · 1080×1920", "WhatsApp status, Facebook and Instagram posts."],
  ["media", "Event Coverage", "Photo · video · live", "Live streaming, photography and video editing."],
];
const LEVELS = ["KG", "Basic 1–6", "JHS 1–3", "SHS"];
const norm = s => String(s || "").toLowerCase().replace(/[–—]/g, "-").replace(/\s+/g, " ").trim();
const cut = (s, n) => { s = String(s || "").replace(/\s+/g, " ").trim(); return s.length > n ? s.slice(0, n - 1) + "…" : s; };

/* ---------------- live content from Apps Script (cached 5 minutes) ---------------- */
let cache = { at: 0, data: null };
async function content() {
  if (cache.data && Date.now() - cache.at < 300000) return cache.data;
  const url = env("API_URL");
  if (!/^https:\/\/script\.google\.com\//.test(url)) return { settings: {}, apps: [], resources: [], posts: [] };
  try {
    const r = await fetch(url + "?action=content&t=" + Date.now(), { redirect: "follow" });
    const j = await r.json();
    if (j.ok) cache = { at: Date.now(), data: j };
  } catch (e) { console.log("content fetch failed", e.message); }
  return cache.data || { settings: {}, apps: [], resources: [], posts: [] };
}

/* tell the Sheet about an order / demo / talk-to-a-person request (shows in admin → WhatsApp, and emails you) */
async function logLead(lead) {
  const url = env("API_URL"), secret = env("BOT_SECRET");
  if (!/^https:\/\/script\.google\.com\//.test(url) || !secret) return;
  try {
    await fetch(url, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, redirect: "follow",
      body: JSON.stringify(Object.assign({ action: "botLead", secret }, lead)) });
  } catch (e) { console.log("lead log failed", e.message); }
}

/* ---------------- sending messages through Meta ---------------- */
async function send(to, payload) {
  const url = `https://graph.facebook.com/${env("GRAPH_VERSION", "v23.0")}/${env("WA_PHONE_ID")}/messages`;
  const r = await fetch(url, {
    method: "POST",
    headers: { Authorization: "Bearer " + env("WA_TOKEN"), "Content-Type": "application/json" },
    body: JSON.stringify(Object.assign({ messaging_product: "whatsapp", recipient_type: "individual", to }, payload)),
  });
  if (!r.ok) console.log("send failed", r.status, await r.text());
  return r.ok;
}
async function markRead(messageId) {   // shows blue ticks to the customer
  const url = `https://graph.facebook.com/${env("GRAPH_VERSION", "v23.0")}/${env("WA_PHONE_ID")}/messages`;
  await fetch(url, { method: "POST", headers: { Authorization: "Bearer " + env("WA_TOKEN"), "Content-Type": "application/json" },
    body: JSON.stringify({ messaging_product: "whatsapp", status: "read", message_id: messageId }) });
}
const textRaw = (to, body) => send(to, { type: "text", text: { body: String(body).slice(0, 4000), preview_url: true } });
function buttons(to, body, btns) {
  return send(to, { type: "interactive", interactive: { type: "button", body: { text: String(body).slice(0, 1000) },
    action: { buttons: btns.slice(0, 3).map(([id, title]) => ({ type: "reply", reply: { id, title: cut(title, 20) } })) } } });
}
function list(to, body, buttonText, sectionTitle, rows, header) {
  const msg = { type: "list", body: { text: String(body).slice(0, 1000) },
    action: { button: cut(buttonText, 20), sections: [{ title: cut(sectionTitle, 24),
      rows: rows.slice(0, 10).map(([id, title, desc]) => Object.assign({ id: String(id).slice(0, 200), title: cut(title, 24) }, desc ? { description: cut(desc, 72) } : {})) }] } };
  if (header) msg.header = { type: "text", text: cut(header, 60) };
  return send(to, { type: "interactive", interactive: msg });
}

/* ---------------- helpers ---------------- */
function humanLink(settings, note) {
  const d = String(settings.whatsapp || "0249021637").replace(/\D/g, "");
  const intl = d.startsWith("0") ? "233" + d.slice(1) : d;
  return `https://wa.me/${intl}?text=${encodeURIComponent(note || "Hello OWMGS, I was chatting with your assistant and I want to talk to a person.")}`;
}
const site = () => (env("SITE_URL") || "").replace(/\/$/, "");

/* ---------------- the conversation ---------------- */
async function menu(to, name) {
  const { settings } = await content();
  const hi = name ? `Hello ${cut(name, 30)}! 👋` : "Hello! 👋";
  const welcome = settings.bot_welcome || "Welcome to *OWMGS* (Owaacs Wood Media, Graphics & Software). We build apps for schools and design everything you print.";
  return list(to, `${hi}\n${welcome}\n\nTap *Menu* and choose what you need. You can type *menu* anytime.`, "Menu", "How can we help?", [
    ["apps", "📱 Apps & Software", "Report cards, lesson notes, quizzes, data tools"],
    ["design", "🎨 Design & Printing", "Posters, flyers, banners, T-shirts, cards"],
    ["res", "📚 Teacher Resources", "Schemes of work, lesson notes, materials"],
    ["news", "📰 Latest news", "GES, teacher unions and education news"],
    ["hours", "🕘 Hours & location", "When and where to find us"],
    ["human", "🙋 Talk to a person", "Chat with our team on WhatsApp"],
  ], "OWMGS");
}

async function showApps(to) {
  const { apps } = await content();
  if (!apps || !apps.length) return buttons(to, "Our school apps include report card generators, lesson notes apps, quiz apps and data collection systems. Tell us what your school needs and we will build it.", [["order:app:custom", "Request an app"], ["human", "Talk to a person"], ["menu", "Main menu"]]);
  return list(to, "Here are our apps. Pick one to see what it does.", "See apps", "OWMGS apps",
    apps.slice(0, 9).map(a => ["app:" + a.id, a.title, a.forWho || a.platform || ""]).concat([["order:app:custom", "✏️ Custom app", "We build an app for your school"]]));
}
async function showApp(to, id) {
  const { apps } = await content();
  const a = (apps || []).find(x => String(x.id) === id);
  if (!a) return showApps(to);
  const feats = String(a.features || "").split(/\n/).map(f => f.replace(/^[-•*]\s*/, "").trim()).filter(Boolean).slice(0, 8);
  let msg = `*${a.title}*\n`;
  if (a.platform) msg += `Platform: ${a.platform}\n`;
  if (a.forWho) msg += `For: ${a.forWho}\n`;
  if (feats.length) msg += "\n" + feats.map(f => "• " + f).join("\n") + "\n";
  if (/^https?:\/\//.test(a.link || "")) msg += `\n▶ Open the app: ${a.link}`;
  await textRaw(to, msg);
  return buttons(to, "What would you like to do?", [["order:demo:" + id, "Request a demo"], ["apps", "Other apps"], ["menu", "Main menu"]]);
}

function showDesign(to) {
  return list(to, "We design and print for schools, churches, businesses and events. Pick an item.", "See services", "Design & printing",
    DESIGN.map(([id, t, size]) => ["d:" + id, t, size]).concat([["human", "🙋 Something else", "Talk to our designer"]]));
}
function showDesignItem(to, id) {
  const d = DESIGN.find(x => x[0] === id);
  if (!d) return showDesign(to);
  return buttons(to, `*${d[1]}*\nSizes: ${d[2]}\n${d[3]}\n\nTo order, tap *Order this*. Then send us the text, date, quantity and any photos or logo.`,
    [["order:design:" + id, "Order this"], ["design", "Other designs"], ["menu", "Main menu"]]);
}

function showLevels(to) {
  return list(to, "Choose your level to see schemes of work, lesson notes and teaching materials.", "Choose level", "Teacher resources",
    LEVELS.map(l => ["lvl:" + l, l, ""]));
}
async function showLevel(to, level) {
  const { resources, settings } = await content();
  const mine = (resources || []).filter(r => norm(r.level) === norm(level) && /^https?:\/\//.test(r.link || ""));
  let msg = `*Teacher resources – ${level}*\n`;
  if (mine.length) {
    ["Scheme of Work", "Lesson Notes", "Teaching Materials"].forEach(t => {
      const g = mine.filter(r => norm(r.type) === norm(t)).slice(0, 8);
      if (g.length) msg += `\n*${t}*\n` + g.map(r => `• ${r.title}: ${r.link}`).join("\n") + "\n";
    });
  } else msg += "\nWe have not uploaded files for this level yet. Tap *Request* and we will send them to you.";
  if (/^https?:\/\//.test(settings.lesson_app_link || "")) msg += `\n📝 Lesson Notes Generator: ${settings.lesson_app_link}`;
  await textRaw(to, msg);
  return buttons(to, "Need something else?", [["order:res:" + level, "Request"], ["res", "Other levels"], ["menu", "Main menu"]]);
}

async function showNews(to) {
  const { posts } = await content();
  const latest = (posts || []).filter(p => p.title).slice(0, 4);
  if (!latest.length) return buttons(to, "No news posted yet. Check again soon.", [["menu", "Main menu"]]);
  const base = site();
  const msg = "*Latest from OWMGS*\n\n" + latest.map(p => {
    const link = /^https?:\/\//.test(p.link || "") ? p.link : (base ? `${base}/#p-${String(p.id).replace(/[^\w-]/g, "")}` : "");
    return `📰 *${cut(p.title, 120)}*${p.category ? ` (${p.category})` : ""}${link ? `\n${link}` : ""}`;
  }).join("\n\n");
  await textRaw(to, msg);
  return buttons(to, "Anything else?", [["menu", "Main menu"], ["human", "Talk to a person"]]);
}

async function showHours(to) {
  const { settings } = await content();
  let msg = "*OWMGS – hours & location*\n";
  msg += `\n🕘 ${settings.bot_hours || "Monday – Saturday, 8:00 am – 6:00 pm"}`;
  if (settings.location) msg += `\n📍 ${settings.location}`;
  if (/^https?:\/\//.test(settings.map_link || "")) msg += `\n🗺 ${settings.map_link}`;
  if (settings.email1) msg += `\n✉️ ${settings.email1}`;
  if (site()) msg += `\n🌐 ${site()}`;
  await textRaw(to, msg);
  return buttons(to, "Anything else?", [["menu", "Main menu"], ["human", "Talk to a person"]]);
}

async function handoff(to, name, what, details) {
  const { settings } = await content();
  const labels = { design: "Design order", demo: "App demo request", app: "Custom app request", res: "Teacher resource request", human: "Talk to a person" };
  let detail = details || "";
  if (what === "design") { const d = DESIGN.find(x => x[0] === details); detail = d ? d[1] : details; }
  if (what === "demo") { const { apps } = await content(); const a = (apps || []).find(x => String(x.id) === details); detail = a ? a.title : details; }
  await logLead({ number: to, name: name || "", type: labels[what] || "Request", details: detail });
  const note = what === "human" ? undefined : `Hello OWMGS, I want to continue my ${String(labels[what] || "request").toLowerCase()}${detail ? ": " + detail : ""}.`;
  return textRaw(to, `✅ Thank you${name ? ", " + cut(name, 30) : ""}! We have received your ${String(labels[what] || "request").toLowerCase()}${detail ? " (*" + detail + "*)" : ""}.\n\nOur team will message you soon. To chat with a person right now, tap here:\n${humanLink(settings, note)}\n\nType *menu* to see the main menu again.`);
}

/* decide what to do with one incoming message */
async function handle(msg, name) {
  const to = msg.from;
  let id = "";
  if (msg.type === "interactive") id = msg.interactive?.list_reply?.id || msg.interactive?.button_reply?.id || "";
  else if (msg.type === "button") id = msg.button?.payload || "";
  const t = norm(msg.text?.body);

  if (!id && msg.type === "text") {
    if (/^(1|apps?|software)\b/.test(t)) id = "apps";
    else if (/^(2|design|print|poster|flyer|banner|t-?shirt|invitation|card)/.test(t)) id = "design";
    else if (/^(3|resources?|scheme|lesson|notes?)\b/.test(t)) id = "res";
    else if (/^(4|news|ges)\b/.test(t)) id = "news";
    else if (/^(5|hours?|location|where|address)\b/.test(t)) id = "hours";
    else if (/^(6|human|person|agent|call|talk|help)\b/.test(t)) id = "human";
    else id = "menu";
  }
  if (!id) {
    // photos, voice notes, documents, stickers …
    await textRaw(to, "Thanks! 🙏 I'm the OWMGS assistant and I can only read text. To send pictures, logos or voice notes for an order, please chat with our team:\n" + humanLink((await content()).settings, "Hello OWMGS, I want to send you files for an order."));
    return menu(to, name);
  }
  if (id === "menu") return menu(to, name);
  if (id === "apps") return showApps(to);
  if (id.startsWith("app:")) return showApp(to, id.slice(4));
  if (id === "design") return showDesign(to);
  if (id.startsWith("d:")) return showDesignItem(to, id.slice(2));
  if (id === "res") return showLevels(to);
  if (id.startsWith("lvl:")) return showLevel(to, id.slice(4));
  if (id === "news") return showNews(to);
  if (id === "hours") return showHours(to);
  if (id === "human") return handoff(to, name, "human", "");
  if (id.startsWith("order:")) { const [, what, ...rest] = id.split(":"); return handoff(to, name, what, rest.join(":")); }
  return menu(to, name);
}

/* ---------------- security: is this really from Meta? ---------------- */
async function validSignature(raw, header, secret) {
  if (!secret || !header || !header.startsWith("sha256=")) return false;
  const hex = header.slice(7);
  if (!/^[0-9a-f]{64}$/i.test(hex)) return false;
  const sig = new Uint8Array(hex.match(/../g).map(h => parseInt(h, 16)));
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
  return crypto.subtle.verify("HMAC", key, sig, new TextEncoder().encode(raw));   // constant-time check
}

const seen = new Map();   // ignore repeats when Meta re-sends the same message
function already(id) {
  const now = Date.now();
  for (const [k, v] of seen) if (now - v > 3600000) seen.delete(k);
  if (seen.has(id)) return true;
  seen.set(id, now); return false;
}

/* ---------------- the web address Meta calls ---------------- */
async function onRequest(context) {
  const req = context.request;
  ENV = context.env || {};
  const url = new URL(req.url);

  // 1) Meta checks the address once when you set up the webhook
  if (req.method === "GET") {
    const ok = url.searchParams.get("hub.mode") === "subscribe" && env("WA_VERIFY_TOKEN") &&
      url.searchParams.get("hub.verify_token") === env("WA_VERIFY_TOKEN");
    if (ok) return new Response(url.searchParams.get("hub.challenge") || "", { status: 200 });
    return new Response(env("WA_VERIFY_TOKEN") ? "Forbidden" : "OWMGS bot: set WA_VERIFY_TOKEN in Cloudflare", { status: 403 });
  }
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  // 2) every customer message
  const raw = await req.text();
  if (!(await validSignature(raw, req.headers.get("x-hub-signature-256"), env("WA_APP_SECRET")))) {
    return new Response("Bad signature", { status: 401 });
  }
  let body;
  try { body = JSON.parse(raw); } catch (e) { return new Response("Bad JSON", { status: 400 }); }

  try {
    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        const v = change.value || {};
        const names = {};
        (v.contacts || []).forEach(c => { names[c.wa_id] = c.profile?.name || ""; });
        for (const m of v.messages || []) {          // delivery/read "statuses" are ignored
          if (!m.from || already(m.id)) continue;
          const p = markRead(m.id).catch(() => {}); if (context.waitUntil) context.waitUntil(p);
          await handle(m, names[m.from]);
        }
      }
    }
  } catch (e) { console.log("bot error", e.stack || e.message); }
  return new Response("OK", { status: 200 });   // always OK, so Meta does not re-send
}

/* ---------------- Cloudflare entry point: every visit to owmgs.com comes here first ---------------- */
const PRIVATE = /^\/(apps-script|netlify|functions|_worker\.js|.*\.gs$)(\/|$)/i;
const SAFETY = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "SAMEORIGIN",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "Strict-Transport-Security": "max-age=31536000",
};
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === "/api/whatsapp") {
      return onRequest({ request, env, waitUntil: p => ctx.waitUntil(p) });
    }
    if (PRIVATE.test(url.pathname)) return new Response("Not found", { status: 404 });
    let req = request;
    if (url.pathname.endsWith("/")) {                 // owmgs.com/  →  index.html
      const u = new URL(url); u.pathname += "index.html"; req = new Request(u, request);
    }
    const res = await env.ASSETS.fetch(req);
    const out = new Response(res.body, res);
    for (const [k, v] of Object.entries(SAFETY)) out.headers.set(k, v);
    if (url.pathname === "/admin.html" || url.pathname === "/admin") out.headers.set("X-Robots-Tag", "noindex, nofollow");
    if (url.pathname === "/config.js") out.headers.set("Cache-Control", "public, max-age=300");   // a new Apps Script link shows within 5 minutes
    return out;
  },
};
