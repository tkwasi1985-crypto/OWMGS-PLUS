# OWMGS Website — Setup Guide

Your website now has an **admin page**. You add pictures, videos, links and text with simple forms, with no code editing.

## How it works

```
You (admin.html)  →  Apps Script  →  Google Sheet (text and links)
                                  →  Google Drive (pictures, videos, files)
Visitors (index.html)  ←  reads everything live from the same Apps Script
```

## What's in this folder

| File | What it is |
|---|---|
| `index.html` | The public website |
| `admin.html` | Your admin page (password protected) |
| `logo.png` | Your logo |
| `apps/` | Optional folder for app screenshots (you can also upload them in the admin page) |
| `apps-script/Code.gs` | The backend code. You paste it into Google Apps Script. It does **not** go on the website. |
| `wrangler.jsonc`, `worker.js`, `public/_headers` | Cloudflare files: what to publish, the WhatsApp chatbot with blocking of private files, and safety settings. They come ready in **owmgs-plus-upload.zip**. |
| `config.js`, `ads.js`, `site.css` | Your Apps Script link (one place), the advert spaces, and the look of the extra pages |
| `about.html`, `privacy.html`, `terms.html`, `advertise.html`, `downloads.html`, `blog.html`, `articles/` | The extra pages and guide articles |
| `sitemap.xml`, `robots.txt`, `ads.txt` | Files for Google (search and AdSense) |
| `SETUP-GUIDE.md` | This guide |
| `icons/` | The OWMGS Metro-style icon set as separate SVG files (+ `_preview.png`). Use them in flyers, apps and slides. The website already has them built in, so you don't need to upload this folder. |
| `WHATSAPP-GUIDE.md` | WhatsApp Business app messages + chatbot setup |

You set it up **once** (about 30 minutes). After that, you only use the admin page.

---

## PART 1 — Make the Google Sheet

1. Go to **sheets.google.com** (signed in as tkwasi1985@gmail.com).
2. Click **Blank**. Name it **OWMGS Website**.

*(Already made "OWMGS Comments" earlier? You can use that same sheet. Your old comments are kept.)*

## PART 2 — Add the backend code

1. In the sheet, click **Extensions → Apps Script**.
2. **Delete all** the code you see there.
3. Open `apps-script/Code.gs` from this folder in Notepad. Copy **everything** and paste it in.
4. **Set your password.** Near the top, find:
   ```
   const ADMIN_PASSWORD   = 'change-this-password';
   ```
   Change it to your own password, keeping the quote marks. Example: `'Owmgs#2026kumasi'`. Use 8 or more characters and don't share it.
5. Click **Save** (the floppy disk icon).
6. Next to **Run**, choose **setup**, then click **Run**.
7. Allow the permissions: **Review permissions** → choose your account → **Advanced** → **Go to … (unsafe)** → **Allow**.
   (Google asks to use Sheets, Drive, Gmail, "external services" and "triggers". Drive is for your uploads, Gmail is for comment alerts, external services let the news robot read Google News, and triggers let it run every 3 hours.)
8. Go back to the sheet. You now have tabs called **Posts, Gallery, Apps, Resources, Comments, Settings**. Google Drive also has a new folder called **OWMGS Website Media**.

## PART 3 — Publish the backend

1. In Apps Script, click **Deploy → New deployment**.
2. Click the gear ⚙ → choose **Web app**.
3. Set:
   - Execute as: **Me**
   - Who has access: **Anyone**  ← very important
4. Click **Deploy**. Copy the **Web app URL**. It ends with **/exec**.

**Test it:** paste the URL into your browser. You should see text starting with `{"ok":true,`.

## PART 4 — Put the link in config.js (one place for the whole site)

Open **config.js** in Notepad. You'll see:
```
window.OWMGS_API = "PASTE_YOUR_APPS_SCRIPT_URL_HERE";
```
Replace `PASTE_YOUR_APPS_SCRIPT_URL_HERE` with your link. Keep the quote marks. Save.

The home page, admin page, blog, downloads page and all advert spaces read the link from this one file. (Older versions had the link inside index.html and admin.html. You don't need to paste it there any more.)

## PART 5 — Put the website on Cloudflare (Worker connected to GitHub)

Your site runs as the Cloudflare Worker **owmgs-plus**, connected to the GitHub repository **tkwasi1985-crypto/OWMGS-PLUS**. Every time you change files on GitHub, Cloudflare publishes the website by itself.

### What the repository must look like
Use the files from **owmgs-plus-upload.zip**. They must sit at the **top** of the repository, not inside another folder:
```
OWMGS-PLUS/                  (top of the repository)
├── wrangler.jsonc           ← tells Cloudflare what to publish
├── worker.js                ← WhatsApp chatbot + safety settings
├── README.md
└── public/                  ← the website itself
    ├── index.html  admin.html  about.html  privacy.html  terms.html
    ├── advertise.html  downloads.html  blog.html  articles/
    ├── config.js  ads.js  site.css  logo.png  _headers
    └── sitemap.xml  robots.txt  ads.txt
```
> 🔒 Never upload `Code.gs` or the `apps-script` folder. It has your admin password.

### Upload (on github.com)
1. Open the repository. If there is an old folder (for example `owmgsplus-website (9)`), open it → click **⋯** (top right) → **Delete directory** → **Commit changes**.
2. Unzip **owmgs-plus-upload.zip** on your computer.
3. In the repository click **Add file → Upload files**. Open the unzipped folder and drag **everything inside it** (`wrangler.jsonc`, `worker.js`, `README.md` and the **public** folder) onto the page. Don't drag the outer folder itself.
4. **Commit changes.**
5. In **dash.cloudflare.com → Workers & Pages → owmgs-plus → Deployments**, a new build starts. After about a minute it should show a green ✓.

### Connect owmgs.com (first time only)
**owmgs-plus → Settings → Domains & Routes → Add → Custom domain** → type `owmgs.com` → **Add domain**. Do the same for `www.owmgs.com`. If Cloudflare says the domain is already in use, remove it from the old project or Worker first.

### Changing the website later
Edit or upload files inside the **public** folder on GitHub and commit. Cloudflare publishes in about a minute. Daily changes (posts, ads, apps) are made in your **admin page** and need no upload.

**Check:** open `https://owmgs.com/ads.txt` (one line from Google) and `https://owmgs.com/apps-script/Code.gs` (it must say **Not found**).

---

# Using your admin page

Open **owmgs.com/admin.html** (bookmark it on your phone). Enter your password.

| Tab | What you do there | Where it shows on the website |
|---|---|---|
| **News & Blog** | Post GES updates, union news, education news or blog posts. Add a picture, video and link. | The section you choose (News by default) |
| **Our Work** | Show posters, flyers, banners, T‑shirts, invitation cards, videos | "Recent work" under Design & Print |
| **Apps** | Your apps: name, features, link, screenshot | Apps & Software section |
| **Teacher Links** | Schemes of work, lesson notes, materials | Teacher Resource Center |
| **Comments** | Hide or delete visitor comments | Comments section |
| **Settings** | Phone numbers, emails, address, map link, social media, homepage heading, announcement bar | All over the site |

### Adding something
1. Choose the tab → **+ Add new**.
2. Fill in the boxes.
   - **Picture:** tap **Upload picture** and choose from your phone or computer. It is made smaller automatically.
   - **Video:** paste a **YouTube** link (best), or upload a short video file (under 25 MB, about 1 minute).
   - **Link or file:** paste a link, or upload a PDF, Word or Excel file.
3. Tap **Publish**. Refresh your website and it's there.

### Choosing where a post appears (and pointing visitors to it)

When you add a post in **News & Blog**:

- **Where to show it on the website:** pick Homepage (top of site), News & Updates, Apps & Software, Design & Print, Teacher Resources or Contact. The post appears at the **top of that section**.
- **Visitors are pointed to it automatically.** For 14 days, the menu shows a red **NEW** on that section, and the ☰ button gets a red dot. Tapping it scrolls to the post and shows a bouncing **👇 Tap here** above its button.
- **Orange top bar:** tick *Also show in the orange bar at the top*. The bar then says **🔔 NEW: your title — Tap here ›** and takes people straight to the post.
- **Button takes visitors to:** pick a specific **app** (e.g. "App: Report Card Generator") or a section (Teacher Resources, Contact…). On the website the post gets an orange **👉 button**. When a visitor taps it, the page scrolls to that exact item, outlines it, and shows **👇 Tap here** on the button to press. To send people to another website instead, leave it on "A web link" and type the link below it.
- **Picture:** the post shows the picture you upload. If you don't upload one and the button points to an app, the post uses **that app's screenshot** automatically.
- **Share link:** after you publish, tap **🔗 Copy link to share** (or **🔗 Link** in the list) and paste it in WhatsApp or Facebook. The link opens your site right at that post, with the pointer.

**After you publish**, the green panel shows the post's picture and does a **live check**:
- **✓ Checked: the public website feed has this post** means the backend is fine. If the site still doesn't show it, the problem is `API_URL` in `index.html` (not the same link as admin.html) or an old copy on your phone.
- **⚠ Saved in your Google Sheet, but the public feed does not include it** means you changed Code.gs without publishing it. Do **Deploy → Manage deployments → ✏ → New version → Deploy**.

**Post not showing? Check these in order:**
1. Open your Apps Script link (ending in `/exec`) in a browser. Is your post's title in the text? If not, the post didn't save, or *Show on website* is off.
2. Is the `API_URL` in `index.html` **exactly the same** as in `admin.html`?
3. Is the newest website on Cloudflare? In **Workers & Pages → owmgs-plus → Deployments**, check that the latest build has a green ✓.
4. Refresh the website. On a phone, close the tab and open the site again.

### 🤖 Auto news (the news robot)

Every **3 hours** the robot searches Google News for education stories and adds up to **5 new ones** to News & Blog. Each robot post has the **headline, source, date** and a **"Read full story on …"** button that opens the original website. It never posts the same story twice, and it skips stories older than 3 days.

**Choose the mode:** admin page → **Settings → 🤖 Auto news**:

| Mode | What happens |
|---|---|
| **Drafts for approval** (recommended) | New stories arrive in **News & Blog** marked **🤖 AUTO · WAITING**. They are hidden from visitors until you approve them. |
| **Fully automatic** | New stories go live on the website straight away. |
| **Off** | The robot does nothing. |

**Approving drafts:** open **News & Blog**. A blue box says how many stories are waiting. On each one:
- **Read source ↗** opens the original story so you can check it.
- **Approve ✓** puts it on the website.
- **Edit** changes the headline or adds a picture before approving.
- **Delete** removes it if you don't want it.

**Topics:** in Settings you can type your own topics, separated by commas (e.g. `Ghana Education Service, GNAT, BECE Ghana, Sekyere Central education`). Leave the box empty to use the standard topics. Tap **Save settings** after changing.

**Check for news now:** tap **🤖 Check for news now** (in News & Blog or Settings) to search straight away instead of waiting. If the mode is Off, this still brings stories as drafts for you to look at.

**Good to know:**
- The robot only copies headlines and links, never whole articles. Copying full articles would break copyright and could get your site banned from Google Ads.
- The robot cannot tell if a story is true. In **Fully automatic** mode, a wrong headline from a news site can appear on your site. Drafts mode lets you check first.
- Robot posts have no picture. To add one, tap **Edit** before approving.

### 💬 Website chat helper

The **orange chat bubble** (bottom right of your website) answers visitors instantly, day and night.
- Visitors tap a button (📱 Apps, 🎨 Posters…, 📚 Lesson notes, 💰 Prices, 📰 GES news, 📍 Location & hours) or **type a question**. The chat finds the answer by its keywords.
- **👉 Show me** scrolls the website to the right place and points at it.
- **🙋 Talk to a person on WhatsApp** opens WhatsApp to **you**, with the visitor's question already typed.
- **🤖 Our WhatsApp assistant** appears only if you filled in the chatbot number in Settings.
- The welcome message and opening hours come from **Settings → 💬 WhatsApp chatbot** (*Welcome message*, *Opening hours*), so the website chat and the WhatsApp chatbot say the same thing.

**Editing the answers:** admin page → **Chat** tab.
1. The first time, tap **➕ Add the 6 starter answers**.
2. Tap **Edit** on any answer and change it. For example, put your real prices in **💰 Prices**.
3. **+ Add new** for other common questions (payment, delivery, how long a design takes…). Give each one keywords people would type, like `momo, pay, payment, mobile money`.
4. In answers you can write `{location}`, `{hours}`, `{whatsapp}`, `{phone2}` or `{email}`. They are filled in from Settings automatically.

Until you add answers in the Chat tab, the website uses the 6 built-in ones.

### Changing or removing something
- **Edit:** change the boxes, then **Save changes**.
- **Hide:** removes it from the website but keeps it in your admin page. Tap **Show** to bring it back.
- **Delete:** tap it twice. It's gone for good.

### Tips
- **Videos:** upload to your YouTube channel, then paste the link. YouTube videos load faster for visitors and use less data.
- **Teacher files:** you can link a whole Google Drive **folder** (Share → Anyone with the link → Copy link). Add new files to the folder each term and the website link keeps working.
- **Coloured words in the heading:** in Settings → Big heading, put stars around words, like `We build *apps* for schools`.
- **Approve comments first:** in Code.gs change `AUTO_SHOW_COMMENTS = 'YES'` to `'NO'`. New comments then wait until you tap **Show** in the Comments tab. After that change, do the step below.

---

## UPDATING from an older version (adding the news robot)

If your site already works and you are adding the news robot:
1. Paste the new **Code.gs** into Apps Script. Set your **ADMIN_PASSWORD** again (the new file has the placeholder). Click **Save**.
2. Choose **setup** → click **Run**. Google asks for **new permissions** (external services and triggers), so click **Allow**. This step also starts the 3‑hour timer. Without it the robot cannot work.
3. **Deploy → Manage deployments → ✏ → Version: New version → Deploy.**
4. Upload the whole website to Cloudflare again (PART 5).
5. In the admin page, go to **Settings → 🤖 Auto news**, choose a mode, tap **Save settings**, then tap **🤖 Check for news now** to test it.

**To check the timer is running:** in Apps Script, click the **clock icon (Triggers)** on the left. You should see **autoNewsRun – Time-based – Every 3 hours**.

## 💰 Adverts: selling ad space + Google AdSense

Your website now has **four advert spaces**: top, middle and bottom of the home page, plus one inside each blog guide (and one on the Downloads page). Each space shows, in this order:

1. **A banner you sold** to a business (admin page → **Ads** tab)
2. **Google AdSense**, once Google approves you and you add the ad unit numbers in Settings
3. **Ad network code** (for example Adsterra) from the Ads tab
4. Otherwise, an **"Your business could be here: Advertise with us"** box that leads businesses to your new **Advertise** page

### Selling a banner to a business
1. Agree the space, dates and price with them on WhatsApp.
2. Admin page → **Ads** → **+ Add new**.
3. Type the business name, choose **Where to show it**, leave Type as **Picture banner**, upload their banner (best 1200×300 px), and add their link (website, Facebook or WhatsApp).
4. Set the **End date**. The advert stops by itself after that day.
5. **Publish.** The list shows its **views** and **clicks**, so you can send them to the advertiser. (Clicks appear at once; views are added every 3 hours. The numbers are close, not exact.)

Put your prices in **Settings → Google AdSense, adverts & downloads → Advertising rates**, and they show on the Advertise page.

### Using an ad network (Adsterra or similar)
1. Sign up as a **publisher**, add owmgs.com, and create a **Banner** ad (sizes 320×100, 728×90 or 300×250).
2. Copy their code. Admin → **Ads** → **+ Add new** → Type **Ad network code** → paste it → choose a space → Publish.
3. ⚠️ **Never use pop-under, push or "direct link" ads.** They show scams and adult content to your teachers.
The code runs in a **sealed box**: it can show its advert, but it cannot redirect your visitors or change your website. Some networks may show nothing in a sealed box. If that happens, try another network rather than removing the protection.

### Applying to Google AdSense again
These were fixed or added for you:
- ✅ **Privacy Policy**, **Terms of Use** and **About** pages (linked at the bottom of every page)
- ✅ **5 original guide articles** in the Blog & Guides section
- ✅ **ads.txt**, **sitemap.xml** and **robots.txt**
- ✅ Google's code on every page
- ✅ The Live Studio .exe moved to its own **Downloads** page with safety notes

Before you apply again, you should:
1. **Write more articles:** aim for **15–20 original posts** of 500+ words in your own words (teacher tips, how-to guides, school technology). Add them in admin → **News & Blog** (category **Blog**), or ask me to write more guide pages.
2. **Fill the empty sections:** add real items in **Teacher Links**, at least 3 **Apps**, and a few **Our Work** designs.
3. **Fix the social links** in Settings: put your real Facebook, TikTok and YouTube page links, or leave them empty.
4. **Wait 2–4 weeks** after uploading, so Google sees the new pages. In **Google Search Console** (search.google.com/search-console), add owmgs.com and submit `https://owmgs.com/sitemap.xml`.
5. In AdSense, open **Sites → owmgs.com → Request review**.

After approval, in AdSense go to **Ads → By ad unit → Display ads**, create one unit for each space, and paste each **data-ad-slot number** into admin → **Settings → Google AdSense**. You can also switch on **Auto ads** in AdSense: it works with the code already on your pages.

## UPDATING (adding adverts, new pages and Google code)

1. **Code.gs:** paste the new version into Apps Script, set your **ADMIN_PASSWORD** and **BOT_SECRET** again, **Save**, then **Deploy → Manage deployments → ✏ → New version → Deploy**. (No need to run setup again: the Ads tab creates itself.)
2. **config.js:** paste your Apps Script link (see PART 4).
3. **Upload to GitHub** as in PART 5 (the contents of **owmgs-plus-upload.zip**). Don't upload the `apps-script` folder.
4. Admin → **Settings → Google AdSense, adverts & downloads**: paste your **Live Studio download link**, then **Save**.
5. Check: open **owmgs.com/ads.txt**. You should see one line starting with `google.com, pub-8597918905226970`.

## UPDATING (adding the website chat helper)

1. Paste the new **Code.gs** into Apps Script, set your **ADMIN_PASSWORD** again, **Save**.
2. **Deploy → Manage deployments → ✏ → New version → Deploy.** (No need to run setup again for this update.)
3. Upload the whole website to Cloudflare again (PART 5).
4. Admin page → **Chat** → **➕ Add the 6 starter answers**, then edit them.

## IMPORTANT — after changing Code.gs

Whenever you change anything in the Apps Script code (password, settings), you must publish it again:

**Deploy → Manage deployments → ✏ pencil → Version: New version → Deploy**

The link stays the same, so you don't need to change the HTML files.

---

## WhatsApp

Setting up the WhatsApp Business app and the WhatsApp chatbot is explained in **WHATSAPP-GUIDE.md**. Requests from the chatbot appear in your admin page under the **WhatsApp** tab.

> ℹ️ **Cloudflare free plan:** normal pages are served free. Only the WhatsApp chatbot address (`/api/whatsapp`) uses Cloudflare's daily free allowance for code, which is far more than a small business needs. Check usage in **Workers & Pages → owmgs-plus → Metrics**.

## Fixing problems

| Problem | Fix |
|---|---|
| Admin says "Setup needed: paste your Apps Script link" | You didn't paste the link in `admin.html` (Part 4). |
| Admin says "Change ADMIN_PASSWORD…" | Change the password in Code.gs, then publish a **New version**. |
| "Wrong password" | Check capital letters. The password is the one in Code.gs. |
| "Too many wrong tries" | Wait 15 minutes. |
| Website says "Live content could not load" | Check that the link in `index.html` is correct and ends in `/exec`, and that the deployment has **Who has access: Anyone**. |
| Changes don't show | Refresh the website. On a phone, pull down to refresh. |
| A picture doesn't show | In Google Drive, open the **OWMGS Website Media** folder and check the file is still there. Don't delete files from that folder while they are used on the site. |
| "No new stories right now" every time | Your topics may be too narrow. Try broader ones like `Ghana education`. Also check the mode is not Off. |
| "Could not reach Google News" | Try again later. Google sometimes limits searches. |
| Robot never runs by itself | In Apps Script, open **Triggers** (clock icon). If **autoNewsRun** is missing, run **setup** again. |
| Changed Code.gs but nothing changed | You forgot **New version** (see the IMPORTANT section). |

## Still to do on the website itself

- **Google AdSense:** your Google code is already on every page, with `ads.txt`. Follow **"Applying to Google AdSense again"** above.

## Good to know

- **Copy protection:** the site blocks right-click and text copying. No website can stop screenshots or phone photos.
- **Your admin page is private by password.** The admin page itself can be opened by anyone who knows the address, but nothing can be changed without the password.
- **Free limits:** about 100 email alerts a day, and 15 GB of Google Drive space shared with your Gmail. That's thousands of pictures.
