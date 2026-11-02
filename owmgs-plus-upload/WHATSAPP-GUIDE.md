# OWMGS on WhatsApp — Guide

You will have **two WhatsApp numbers** working together:

| Number | What it is | Who answers |
|---|---|---|
| **0249021637** (your main number) | **WhatsApp Business app** on your phone (Part A) | **You.** It sends automatic greeting and away messages. |
| **A second number** (e.g. 0209067004 or a new SIM) | **WhatsApp chatbot** (Part B) | **The bot, 24/7.** It sends customers to you when they need a person. |

```
Customer → Chatbot number → menus: apps, design, resources, news, hours
                         → "Order this" / "Talk to a person"
                              → saved in admin page → WhatsApp tab + email to you
                              → customer gets a link to chat with YOU on 0249021637
```

> **Why two numbers?** A number connected to the chatbot (Meta's WhatsApp Cloud API) normally cannot be used in the WhatsApp app on a phone at the same time. Meta now offers **"coexistence"** (one number in both) in many countries, but support for Ghana is unclear, so two numbers is the safe choice.

---

# PART A — WhatsApp Business app (your main number)

Install **WhatsApp Business** from the Play Store or App Store and register **0249021637**. If the number is on normal WhatsApp now, the app moves your chats across.

Then open **⋮ (or Settings) → Business tools**.

### 1. Business profile
- **Name:** OWMGS – Owaacs Wood Media, Graphics & Software
- **Category:** Graphic Designer (also add: Software Company)
- **Description** (copy this):
  > We build apps for schools (report cards, lesson notes, quizzes, data systems) and design everything you print: posters, flyers, banners, T‑shirts, invitation cards, certificates and more. Teacher resources and GES news on our website.
- **Address, hours, email, website:** fill these in. For website, use **https://owmgs.com**.

### 2. Greeting message
*Business tools → Greeting message → ON → Send to: Everyone.* Copy this:

```
Hello! 👋 Welcome to *OWMGS* – Owaacs Wood Media, Graphics & Software.

How can we help you today? Reply with a number:
1️⃣ School apps & software
2️⃣ Posters, flyers, banners & T‑shirts
3️⃣ Invitation cards & certificates
4️⃣ Teacher resources (schemes, lesson notes)
5️⃣ Something else

🤖 For instant answers 24/7, chat with our assistant: https://wa.me/233XXXXXXXXX?text=Hi
🌐 Website: https://owmgs.com
```
*(Replace 233XXXXXXXXX with your chatbot number in international form: drop the first 0 and add 233. 0209067004 becomes 233209067004.)*

### 3. Away message
*Business tools → Away message → ON → Schedule: Outside of business hours.*

```
Thank you for contacting *OWMGS*! 🙏 We are closed right now and will reply as soon as we open.

Our hours: Monday – Saturday, 8:00 am – 6:00 pm.

Meanwhile, our assistant can show you our apps, designs, teacher resources and the latest GES news: https://wa.me/233XXXXXXXXX?text=Hi
```

### 4. Quick replies
*Business tools → Quick replies → +.* Type the **shortcut** in a chat, and WhatsApp offers the full message.

| Shortcut | Message |
|---|---|
| `/menu` | Here is what we do: 📱 School apps · 🎨 Posters, flyers, banners · 👕 T‑shirt designs · 💌 Invitation cards · 🏅 Certificates · 📚 Teacher resources. Which one do you need? |
| `/order` | Great! To prepare your design, please send: 1) What it is for 2) All the text to appear 3) Size and quantity 4) Date you need it 5) Photos or logo (if any). |
| `/apps` | Our school apps: Report Card Generator, Lesson Notes App, Quiz Apps, Attendance Tracker, Data Collection System and Certificate Generator. Which would you like a demo of? See them here: https://owmgs.com/#apps |
| `/price` | Our prices depend on size, quantity and design work. Send me the details and I will give you the exact price. *(Or write your price list here: Poster A3 – GH₵ ___, Flyer A5 (100 copies) – GH₵ ___ …)* |
| `/pay` | You can pay by Mobile Money: Number: ________ · Name: ________. Please send a screenshot after payment. Thank you! |
| `/draft` | Here is your draft 👆 Please check the spelling, names, dates and colours. Reply *OK* to approve or tell me what to change. |
| `/ready` | Good news! ✅ Your work is ready. You can pick it up at our office, or we can send the files on WhatsApp. |
| `/location` | We are at: ________ . Map: (paste your Google Maps link) |
| `/thanks` | Thank you for choosing OWMGS! 🙏 Please leave us a review on our website: https://owmgs.com/#comments |

*(Fill in the blanks: prices, MoMo number, address. I left them empty so nothing wrong goes to customers.)*

### 5. Labels (to keep track of customers)
*Business tools → Labels.* Create: **New customer**, **Design order**, **App demo**, **Waiting for payment**, **Paid**, **Completed**. Long‑press a chat to label it.

### 6. Catalogue
*Business tools → Catalogue → Add new item.* For each service, add a **photo of your real work**, a name, a price (or "From GH₵ ___"), a short description and a link (e.g. `https://owmgs.com/#design`). Good items to add: Posters, Flyers, Banners, T‑shirt designs, Invitation cards, Certificates, Report Card App, Lesson Notes App.

### 7. Short link
*Business tools → Short link.* Turn on the default message ("Hello OWMGS, I need…"), then share the short link on your flyers and social media.

---

# PART B — The WhatsApp chatbot (second number)

### What the chatbot does
- Greets customers **by name**, with a menu: 📱 Apps · 🎨 Design & printing · 📚 Teacher resources · 📰 Latest news · 🕘 Hours & location · 🙋 Talk to a person.
- **Apps, teacher links, news and contact details come live from your admin page.** Change something there and the bot uses it within 5 minutes.
- **Order this**, **Request a demo** and **Talk to a person** do three things:
  - save the request in your **admin page → WhatsApp** tab
  - **email** you
  - send the customer a link to chat with **you** on your main number
- Customers can also type **1–6**, or words like "banner", "lesson notes" or "news". Typing **menu** shows the menu again.
- It answers photos and voice notes politely and sends the customer to you.

### What it costs
- **Meta:** Meta's official pricing page says replies sent **within 24 hours of a customer's message are free**. The bot only ever replies to customers. Some providers report pricing changes from October 2026, so check [Meta's pricing page](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing) before you start. Ghana is in the **"Rest of Africa"** rate group.
- **Cloudflare:** the bot runs on Cloudflare's free plan, which allows far more requests a day than a small business needs.

### What you need
- A **second phone number (SIM)** that is **not** on WhatsApp. If it is, delete that WhatsApp account first (in WhatsApp: Settings → Account → Delete account). You only need the SIM to receive one verification SMS or call.
- A **Facebook account** (yours).
- About **1 hour**.

> Meta changes its screens often. If a button name below is slightly different, look for the closest match.

### B1. Create the Meta app
1. Go to **developers.facebook.com** → **Log in** → **My Apps → Create app**.
2. Choose the use case **"Connect with customers through WhatsApp"**. If you're asked for an app type, choose **Business**.
3. Name it **OWMGS Bot**, add your email, and create or choose a **Business portfolio** called **OWMGS**.
4. When the app opens, find **WhatsApp → API Setup** (or **Quickstart**) on the left.

### B2. Add your bot number
1. In **API Setup**, under **Step 5: Add a phone number** (or **Add phone number**), enter:
   - **Display name:** OWMGS (Meta checks this name. It must match your business.)
   - **Category:** Professional services
   - **Phone number:** your second number, then verify it by SMS or call.
2. Choose the new number in the **From** box, then copy the **Phone number ID** (a long number). This is your **WA_PHONE_ID**.

### B3. Make a permanent access token
The token on the API Setup page expires after 24 hours, so make a permanent one:
1. Go to **business.facebook.com → Settings (⚙) → Users → System users → Add**. Name it `owmgs-bot`, role **Admin**.
2. Click **Assign assets**:
   - **Apps → OWMGS Bot →** turn on **Full control**
   - **WhatsApp accounts →** your account → turn on **Full control**
   - Then click **Save**.
3. Click **Generate new token**, choose app **OWMGS Bot**, set expiry to **Never**, and tick:
   - `whatsapp_business_messaging`
   - `whatsapp_business_management`
4. Click **Generate**, then **copy the token right away** (you only see it once). This is your **WA_TOKEN**. Keep it secret: anyone with it can send messages as your business.

### B4. Copy your App secret
In **developers.facebook.com → your app → App settings → Basic**, click **Show** next to **App secret** and copy it. This is your **WA_APP_SECRET**. The bot uses it to check that messages really come from Meta and not from a hacker.

### B5. Invent two secret phrases
Make up two long phrases with no spaces, for example:
- **WA_VERIFY_TOKEN:** `owmgs-verify-7Kq2`
- **BOT_SECRET:** `owmgs-bot-9xP4vL`

*(Use your own phrases, not these examples.)*

### B6. Put BOT_SECRET into Apps Script
1. Open Apps Script and paste the new **Code.gs**. Set **ADMIN_PASSWORD** again.
2. Find `const BOT_SECRET = 'change-this-bot-secret';` and put your BOT_SECRET phrase between the quotes.
3. Click **Save**, then **Deploy → Manage deployments → ✏ → Version: New version → Deploy**.

### B7. The bot is in `worker.js`
The chatbot lives in **`worker.js`** at the top of your GitHub repository (SETUP-GUIDE → PART 5). Nothing else to do here.

### B8. Put the secrets into Cloudflare
1. In **dash.cloudflare.com → Workers & Pages → owmgs-plus → Settings → Variables and Secrets → Add**.
2. Add each of these. Choose type **Secret** (encrypted), then type the Name and Value:

| Name | Value |
|---|---|
| `WA_TOKEN` | the permanent token from B3 |
| `WA_PHONE_ID` | the Phone number ID from B2 |
| `WA_APP_SECRET` | the App secret from B4 |
| `WA_VERIFY_TOKEN` | your verify phrase from B5 |
| `BOT_SECRET` | your bot secret from B5 (same as in Code.gs) |
| `API_URL` | your Apps Script link ending in `/exec` |
| `SITE_URL` | `https://owmgs.com` |

3. Click **Deploy** (Cloudflare asks after you add secrets). They stay saved when GitHub updates the site.
4. **Test:** open `https://owmgs.com/api/whatsapp` in your browser. You should see **Forbidden**, which is correct: the bot is there and refuses strangers.

### B9. Connect Meta to the bot
1. In **developers.facebook.com → your app → WhatsApp → Configuration**, find **Webhook** and click **Edit**.
2. Fill in:
   - **Callback URL:** `https://owmgs.com/api/whatsapp`
   - **Verify token:** your WA_VERIFY_TOKEN phrase
3. Click **Verify and save**. If it fails, check that the phrase is exactly the same in Cloudflare and Meta, and that you clicked Deploy after adding secrets (B8 step 3).
4. Under **Webhook fields**, find **messages**, click **Subscribe**.

### B10. Go live
1. In your app, switch **App mode** from Development to **Live** (top of the app dashboard). Meta may ask for a **Privacy Policy URL**. Use **`https://owmgs.com/privacy.html`**.
2. From your own phone, send **Hi** to the bot number. You should get the menu within a few seconds.
3. In your **admin page → Settings → 💬 WhatsApp chatbot**:
   - **Chatbot WhatsApp number:** your bot number. The green bubble on your website now opens the bot.
   - **Welcome message** and **Opening hours:** write your own, or leave them empty to use the standard ones.
   - Tap **Save settings**.

Meta may also ask you to **verify your business** (upload a business registration or utility bill) before the bot can message many new people a day. Replying to customers who message you first still works while you wait.

---

# Using the chatbot every day

- **Admin page → WhatsApp tab** lists every request: name, number, what they want (e.g. "Design order – Banners") and the date.
  - **Chat ↗** opens WhatsApp to message that customer from your phone.
  - **Mark done** marks it handled. **Reopen** brings it back.
- You also get an **email** for each request.
- To change what the bot says about apps, resources, news, hours or location, change them in the admin page. The bot updates within **5 minutes**.

### Fixing problems

| Problem | Fix |
|---|---|
| "Verify and save" fails in Meta | The verify phrase must be exactly the same in Cloudflare and Meta. Click Deploy after adding secrets. Check `https://owmgs.com/api/whatsapp` shows "Forbidden". |
| Bot doesn't reply | In Meta → Configuration, check **messages** is subscribed. In Cloudflare → **owmgs-plus → Observability** (logs), look for "send failed". A **401** there means the WA_TOKEN is wrong or expired; make a new one (B3). |
| Bot replies, but WhatsApp tab stays empty | BOT_SECRET differs between Cloudflare and Code.gs, or Code.gs wasn't deployed as a New version. |
| Bot shows old apps or news | Wait 5 minutes, since it saves a copy for 5 minutes. Check API_URL in Cloudflare. |
| "Bad signature" in Cloudflare logs | WA_APP_SECRET is wrong. Copy it again from App settings → Basic. |

---

# ℹ️ Cloudflare usage

Your normal pages are served free on Cloudflare Pages. Only messages to the chatbot address (`/api/whatsapp`) run code, and Cloudflare's free plan allows a large number of these every day. Check **Workers & Pages → owmgs-plus → Metrics** now and then.

Changes made in your **admin page** never need an upload, because they go to the Google Sheet.

**Sources:**
[Meta: Pricing on the WhatsApp Business Platform](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing) ·
[EngageLab: WhatsApp pricing 2026](https://www.engagelab.com/blog/whatsapp-pricing-2026-service-message-cost) ·
[ChakraHQ: WhatsApp coexistence](https://chakrahq.com/article/whatsapp-coexistence-live-eu-uk-europe-whatsapp-business-for-api-live/) ·
[Apps Script webhook redirect problem](https://my-blog-b1c7.onrender.com/blog/gas-telegram-webhook-302-error/)
