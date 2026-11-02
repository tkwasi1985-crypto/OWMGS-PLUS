/* OWMGS ad spaces
 * Put <div class="owmgs-ad" data-slot="top"></div> anywhere on a page (slots: top, middle, bottom, article).
 * For each space this script shows, in order:
 *   1. a paid banner you added in the admin page (Ads tab)        → your own advertisers
 *   2. Google AdSense, when a slot number is set in Settings       → after Google approves the site
 *   3. ad network code (e.g. Adsterra) from the Ads tab            → shown in a sealed box
 *   4. an "Advertise here" box that leads to advertise.html
 * Needs config.js loaded first (window.OWMGS_API).
 */
(function () {
  "use strict";
  var API = (window.OWMGS_API || "");
  var ME = document.currentScript && document.currentScript.src || "";
  var ADVERTISE = ME ? ME.replace(/ads\.js(\?.*)?$/, "advertise.html") : "advertise.html";   /* works from any folder */
  var READY = /^https:\/\/script\.google\.com\//.test(API);
  var slots = [].slice.call(document.querySelectorAll(".owmgs-ad[data-slot]"));
  if (!slots.length) return;

  var css = document.createElement("style");
  css.textContent =
    ".owmgs-ad{margin:28px auto;max-width:980px;padding-inline:16px;text-align:center}" +
    ".owmgs-ad .ad-lab{display:block;font:600 11px/1.2 system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase;opacity:.55;margin-bottom:6px;text-align:left}" +
    ".owmgs-ad a.ad-ban{display:block;line-height:0;border-radius:10px;overflow:hidden;border:1px solid rgba(127,140,160,.25)}" +
    ".owmgs-ad a.ad-ban img{width:100%;height:auto;max-height:320px;object-fit:cover;display:block}" +
    ".owmgs-ad iframe{width:100%;border:0;display:block;margin:0 auto;background:transparent}" +
    ".owmgs-ad a.ad-house{display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;text-decoration:none;" +
    "padding:18px 20px;border:2px dashed rgba(240,125,26,.6);border-radius:12px;color:inherit;background:rgba(240,125,26,.06);text-align:left}" +
    ".owmgs-ad a.ad-house b{font:800 18px/1.25 system-ui,sans-serif}.owmgs-ad a.ad-house small{display:block;opacity:.75;font:500 14px/1.4 system-ui,sans-serif;margin-top:3px}" +
    ".owmgs-ad a.ad-house span.go{background:#f07d1a;color:#1b0e02;font:800 14px system-ui,sans-serif;padding:10px 16px;border-radius:999px;white-space:nowrap}" +
    ".owmgs-ad ins.adsbygoogle{display:block;min-height:90px}";
  document.head.appendChild(css);

  function beacon(action, id) {
    if (!READY) return;
    try {
      var body = JSON.stringify({ action: action, id: id });
      if (!(navigator.sendBeacon && navigator.sendBeacon(API, new Blob([body], { type: "text/plain" }))))
        fetch(API, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain" }, body: body });
    } catch (e) {}
  }
  function safeUrl(u) { u = String(u || "").trim(); return /^https?:\/\//i.test(u) ? u : ""; }
  function label(el) { var s = document.createElement("span"); s.className = "ad-lab"; s.textContent = "Advertisement"; el.appendChild(s); }
  function heightFor(slot) { return slot === "middle" || slot === "article" ? 280 : (innerWidth < 600 ? 110 : 100); }

  function showBanner(el, ad) {
    var img = safeUrl(ad.image); if (!img) return false;
    el.innerHTML = ""; label(el);
    var a = document.createElement("a"); a.className = "ad-ban";
    var link = safeUrl(ad.link);
    if (link) { a.href = link; a.target = "_blank"; a.rel = "sponsored noopener"; }
    var im = document.createElement("img"); im.alt = ad.alt || "Advert"; im.loading = "lazy"; im.src = img;
    im.onerror = function () { var m = img.match(/lh3\.googleusercontent\.com\/d\/([\w-]+)/); if (m && !im.dataset.fb) { im.dataset.fb = 1; im.src = "https://drive.google.com/thumbnail?id=" + m[1] + "&sz=w1600"; } };
    a.appendChild(im); el.appendChild(a);
    a.addEventListener("click", function () { beacon("adClick", ad.id); });
    if ("IntersectionObserver" in window) {
      var seen = false, io = new IntersectionObserver(function (es) {
        if (!seen && es[0].isIntersecting) { seen = true; beacon("adView", ad.id); io.disconnect(); }
      }, { threshold: 0.5 });
      io.observe(a);
    } else beacon("adView", ad.id);
    return true;
  }

  var adsenseLoaded = false;
  function showAdSense(el, client, slotId) {
    if (!client || !/^\d{5,}$/.test(String(slotId || ""))) return false;
    el.innerHTML = ""; label(el);
    var ins = document.createElement("ins"); ins.className = "adsbygoogle";
    ins.setAttribute("data-ad-client", client); ins.setAttribute("data-ad-slot", slotId);
    ins.setAttribute("data-ad-format", "auto"); ins.setAttribute("data-full-width-responsive", "true");
    el.appendChild(ins);
    if (!adsenseLoaded && !document.querySelector('script[src*="adsbygoogle.js"]')) {
      var s = document.createElement("script"); s.async = true; s.crossOrigin = "anonymous";
      s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + encodeURIComponent(client);
      document.head.appendChild(s);
    }
    adsenseLoaded = true;
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
    return true;
  }

  /* Ad network code runs inside a sealed frame: it can show its advert and open a new tab when clicked,
     but it cannot take over or redirect your page, read your visitors' data, or change your site. */
  function showNetwork(el, ad, slot) {
    if (!ad.code) return false;
    el.innerHTML = ""; label(el);
    var f = document.createElement("iframe");
    f.setAttribute("sandbox", "allow-scripts allow-popups allow-popups-to-escape-sandbox");
    f.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
    f.setAttribute("scrolling", "no"); f.title = "Advertisement"; f.loading = "lazy";
    f.style.height = heightFor(slot) + "px";
    f.srcdoc = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<style>html,body{margin:0;padding:0;display:flex;justify-content:center;align-items:center;min-height:100%;overflow:hidden;background:transparent}</style></head><body>' +
      ad.code + "</body></html>";
    el.appendChild(f);
    beacon("adView", ad.id);
    return true;
  }

  function showHouse(el) {
    if (el.getAttribute("data-house") === "no") { el.hidden = true; return; }
    el.innerHTML = '<a class="ad-house" href="' + ADVERTISE + '"><div><b>Your business could be here</b>' +
      "<small>Reach teachers, schools, churches and businesses across Ghana. Advertise on owmgs.com.</small></div>" +
      '<span class="go">Advertise with us →</span></a>';
  }

  function pick(list) { return list.length ? list[Math.floor(Math.random() * list.length)] : null; }

  function fill(data) {
    var ads = (data && data.ads) || [], gs = (data && data.adsense) || {};
    var client = gs.client || window.OWMGS_ADSENSE || "";
    var usedBanner = {};
    slots.forEach(function (el) {
      var slot = el.getAttribute("data-slot");
      var mine = ads.filter(function (a) { return a.slot === slot || a.slot === "all"; });
      var banners = mine.filter(function (a) { return a.kind === "banner" && safeUrl(a.image) && !usedBanner[a.id]; });
      var b = pick(banners.filter(function (a) { return a.slot === slot; })) || pick(banners);
      if (b && showBanner(el, b)) { usedBanner[b.id] = 1; return; }
      if (showAdSense(el, client, gs[slot])) return;
      var n = pick(mine.filter(function (a) { return a.kind === "network" && a.code; }));
      if (n && showNetwork(el, n, slot)) return;
      showHouse(el);
    });
  }

  slots.forEach(showHouse);   // show the "Advertise here" box straight away; real adverts replace it when they arrive
  if (!READY) return;
  fetch(API + "?action=ads&t=" + Math.floor(Date.now() / 300000), { cache: "default" })
    .then(function (r) { return r.json(); })
    .then(function (j) { if (j && j.ok) fill(j); })
    .catch(function () {});
})();
