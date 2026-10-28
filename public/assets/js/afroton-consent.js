/* afroton.eu - cookie consent (15/10/2026). The site's consent record explains it.
 *
 * Built on the earlier banner (21/09), with three changes: Google's Consent Mode v2 with all four signals
 * denied by default, no Meta Pixel, and nothing handed to the Weeztix shop (it asks its own question in its frame).
 *
 * What it does, in order:
 *  1. Reads the visitor's choice (localStorage "afroton-consent": {v, stats, media, t}), remembered 6 months,
 *     the period the Belgian Data Protection Authority calls reasonable. No (valid) choice -> the banner shows.
 *  2. Nothing that needs consent runs before a yes:
 *     - statistics  -> the Google tag (Consent Mode v2, BASIC: the tag is not even requested before this yes);
 *     - external media -> the YouTube and Spotify players (the pages ship them held back).
 *     A placeholder's own button loads that one player only, for that page view.
 *  3. Withdrawing deletes the Google Analytics cookies we can reach and reloads the page, so whatever was loaded is
 *     gone from the next page on (a loaded script cannot be unloaded).
 *  The ad labels in the address (fbclid, utm_*) are not touched: Weeztix's own injector reads them on /tickets/.
 *
 * Banner version 4 (20/10/2026): the "marketing" purpose and the former newsletter pop-up script are
 * gone. Afroton's newsletter is Brevo now, and the home card signs people up server-side (/api/subscribe), no script.
 *
 * Branch server-tracking (18/10/2026, on 1.6.1 since 21/10; the server-tracking record explains it): a third purpose, "Advertising", that exists
 * ONLY when the page's config says ads:true (the banner markup sets it when Cloudflare has PUBLIC_META_PIXEL_ID at build time).
 * Without it, every line below behaves as the live site: banner version 4, two purposes, the same stored choice.
 * With it, and only after an Advertising yes:
 *     - PageView on every page, ViewContent on the pages that hold the ticket shop, TicketClick on ticket links, each
 *       POSTed to our own /api/hello with a fresh event id; our server forwards them to Meta (no Meta script here);
 *     - our server sets _fbp/_fbc on this host; the ad labels of the landing address are kept for this tab only
 *       (sessionStorage) and added to ticket links, so the Weeztix shop still sees the click id after a detour;
 *     - Purchase is never sent from here: Weeztix reports paid orders to Meta itself.
 *   Withdrawing the Advertising yes deletes _fbp, _fbc and the kept labels and reloads, like the other purposes.
 */
(function () {
  "use strict";

  var KEY = "afroton-consent";
  var VERSION = 4;                          // banner version (the consent record keeps the history); another version = ask again
  var MAX_AGE = 183 * 24 * 60 * 60 * 1000;  // 6 months
  var CATS = ["stats", "media"];

  var cfg = {};
  try {
    var cfgEl = document.getElementById("afroton-consent-config");
    cfg = JSON.parse(cfgEl ? cfgEl.textContent : "{}") || {};
  } catch (e) { cfg = {}; }
  var TAG = typeof cfg.tag === "string" ? cfg.tag : "";
  var ADS = cfg.ads === true;   // server-tracking switched on at build time (by the banner markup); off = the live site as it is
  var SHOP = cfg.shop === true; // this page holds the Weeztix ticket shop (/tickets/, /workshops/)
  if (ADS) { VERSION = 5; CATS = CATS.concat(["ads"]); } // a new purpose: everyone is asked again

  // ---------------------------------------------------------------- the stored choice
  function readChoice() {
    var raw = null;
    try { raw = localStorage.getItem(KEY); } catch (e) { return null; }
    if (!raw) return null;
    try {
      var o = JSON.parse(raw);
      if (!o || o.v !== VERSION || typeof o.t !== "number") return null; // older banner (1.3.x / tracking-meta / v3): ask again
      if (Date.now() - o.t > MAX_AGE) return null;                        // older than 6 months: ask again
      return { stats: o.stats === true, media: o.media === true, ads: ADS && o.ads === true, t: o.t };
    } catch (e) { return null; }
  }
  function writeChoice(c) {
    var o = { v: VERSION, stats: !!c.stats, media: !!c.media };
    if (ADS) o.ads = !!c.ads; // off: the stored choice keeps the live site's exact shape
    o.t = Date.now();
    try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {}
  }

  // ---------------------------------------------------------------- Google tag, Consent Mode v2 (basic)
  function loadGoogle() {
    if (window.__afrotonGA || !TAG) return;
    window.__afrotonGA = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    var gtag = window.gtag;
    // every signal denied first; then only what the visitor allowed. There is no advertising purpose on this site
    // (the tag has no Google Ads destination, measured 15/10), so the three ad signals stay denied for everyone.
    gtag("consent", "default", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied" });
    gtag("set", "ads_data_redaction", true);
    gtag("consent", "update", { analytics_storage: "granted" });
    // live's Site Kit snippet, the same statements in the same order (developer_id is Site Kit's own marker)
    gtag("set", "linker", { domains: ["www.afroton.eu"] });
    gtag("js", new Date());
    gtag("set", "developer_id.dZTNiMT", true);
    gtag("config", TAG);
    window._googlesitekit = window._googlesitekit || {};
    window._googlesitekit.throttledEvents = [];
    window._googlesitekit.gtagEvent = function (name, data) {
      var key = JSON.stringify({ name: name, data: data });
      if (window._googlesitekit.throttledEvents[key]) return;
      window._googlesitekit.throttledEvents[key] = true;
      setTimeout(function () { delete window._googlesitekit.throttledEvents[key]; }, 5);
      var d = {}; for (var k in data) d[k] = data[k]; d.event_source = "site-kit";
      gtag("event", name, d);
    };
    var s = document.createElement("script");
    s.async = true;
    s.id = "google_gtagjs-js";
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(TAG);
    document.head.appendChild(s);
  }

  // ---------------------------------------------------------------- advertising: server-side, Meta (branch server-tracking)
  // Nothing in this block runs unless ADS (the build switch) AND the visitor's Advertising yes.
  var LABELS_KEY = "afroton-ad-labels";
  var LABEL_KEYS = ["fbclid", "utm_source", "utm_medium", "utm_campaign", "utm_term"]; // Weeztix knows utm_term, not utm_content
  var TICKET_PATHS = ["/tickets/", "/workshops/"];
  var SHOP_HOSTS = ["shop.weeztix.com"];
  function eventId() {
    try { if (window.crypto && crypto.randomUUID) return crypto.randomUUID(); } catch (e) {}
    var s = ""; for (var i = 0; i < 32; i++) s += Math.floor(Math.random() * 16).toString(16);
    return s.slice(0, 8) + "-" + s.slice(8, 12) + "-" + s.slice(12, 16) + "-" + s.slice(16, 20) + "-" + s.slice(20);
  }
  function sendAd(name, extra) {
    if (!ADS || !current || current.ads !== true) return; // the gate, checked at the moment of sending
    var body = { event: name, event_id: eventId(), url: location.href, consent: { ads: true } };
    if (extra && extra.link) body.link = String(extra.link).slice(0, 100);
    try {
      fetch("/api/hello", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), keepalive: true, credentials: "same-origin" }).catch(function () {});
    } catch (e) {}
  }
  function keptLabels() {
    var o = {};
    try { o = JSON.parse(sessionStorage.getItem(LABELS_KEY) || "{}") || {}; } catch (e) { o = {}; }
    return o;
  }
  function keepLabels() { // the labels of the address the visitor landed on, for this tab only
    var here = new URLSearchParams(location.search), o = keptLabels(), fresh = false;
    LABEL_KEYS.forEach(function (k) { if (here.get(k)) fresh = true; });
    if (!fresh) return;
    o = {};
    LABEL_KEYS.forEach(function (k) { var v = here.get(k); if (v) o[k] = v.slice(0, 500); });
    try { sessionStorage.setItem(LABELS_KEY, JSON.stringify(o)); } catch (e) {}
  }
  function startAds() {
    if (!ADS || window.__afrotonAds) return;
    window.__afrotonAds = true;
    keepLabels();
    sendAd("PageView");
    if (SHOP) sendAd("ViewContent");
  }
  function isTicketLink(u) {
    if (SHOP_HOSTS.indexOf(u.hostname) !== -1) return true;
    if (u.origin !== location.origin) return false;
    var p = u.pathname.charAt(u.pathname.length - 1) === "/" ? u.pathname : u.pathname + "/";
    return TICKET_PATHS.indexOf(p) !== -1;
  }
  function onTicketClick(ev) {
    if (!ADS || !current || current.ads !== true) return;
    var a = ev.target && ev.target.closest ? ev.target.closest("a[href]") : null;
    if (!a) return;
    var u;
    try { u = new URL(a.href, location.href); } catch (e) { return; }
    if ((u.protocol !== "http:" && u.protocol !== "https:") || !isTicketLink(u)) return;
    if (u.origin === location.origin) { // carry the landing labels to the shop page; never overwrite what the link has
      var kept = keptLabels(), changed = false;
      LABEL_KEYS.forEach(function (k) { if (kept[k] && !u.searchParams.has(k)) { u.searchParams.set(k, kept[k]); changed = true; } });
      if (changed) a.href = u.href;
    }
    sendAd("TicketClick", { link: u.origin === location.origin ? u.pathname : u.hostname });
  }
  function dropAdsData() {
    dropCookie("_fbp");
    dropCookie("_fbc");
    try { sessionStorage.removeItem(LABELS_KEY); } catch (e) {}
  }

  // ---------------------------------------------------------------- external media (the pages hold them back)
  function release(el, autoplay) {
    if (!el || el.getAttribute("data-afroton-released")) return;
    var media = {};
    try { media = JSON.parse(el.getAttribute("data-afroton-media") || "{}"); } catch (e) { return; }
    el.setAttribute("data-afroton-released", "1");
    var tpl = el.querySelector("template");
    if (tpl) { // an <iframe> from a text/HTML widget (Spotify): put it back in place of the placeholder
      el.innerHTML = tpl.innerHTML;
      return;
    }
    if (!media.hold) return;
    var s = {};
    try { s = JSON.parse(el.getAttribute("data-settings") || "{}"); } catch (e) {}
    for (var k in media.hold) s[k] = media.hold[k];
    if (autoplay && s.youtube_url !== undefined) s.autoplay = "yes";
    el.setAttribute("data-settings", JSON.stringify(s));
    // Elementor has not started yet (this file runs before its deferred scripts): it will read the attribute itself.
    // It has started: hand it the new settings and run the element's handlers again.
    var $ = window.jQuery, ef = window.elementorFrontend;
    if ($ && ef && ef.elementsHandler && ef.elementsHandler.runReadyTrigger) {
      $(el).data("settings", s);
      try { ef.elementsHandler.runReadyTrigger($(el)); } catch (e) {}
    }
  }
  function releaseAll() {
    var els = document.querySelectorAll("[data-afroton-media]");
    for (var i = 0; i < els.length; i++) release(els[i], false);
  }

  function applyChoice(c) {
    if (!c) return;
    if (c.stats) loadGoogle();
    if (c.media) releaseAll();
    if (ADS && c.ads) startAds();
  }

  // ---------------------------------------------------------------- withdrawing
  function dropCookie(name) {
    var host = location.hostname, parts = host.split("."), domains = ["", host, "." + host];
    for (var i = 1; i < parts.length - 1; i++) domains.push("." + parts.slice(i).join("."));
    for (var d = 0; d < domains.length; d++) {
      document.cookie = name + "=; Max-Age=0; path=/" + (domains[d] ? "; domain=" + domains[d] : "");
    }
  }
  function dropStatsCookies() {
    (document.cookie || "").split(";").forEach(function (p) {
      var n = p.split("=")[0].trim();
      if (n === "_ga" || n.indexOf("_ga_") === 0 || n === "_gid" || n === "_gat" || n.indexOf("_gat_") === 0) dropCookie(n);
    });
  }

  // ---------------------------------------------------------------- the banner
  var box = document.querySelector("[data-consent]");
  var options = box ? box.querySelector("[data-consent-options]") : null;
  function field(name) { return box ? box.querySelector('[data-consent-opt="' + name + '"]') : null; }
  function showBanner(withOptions) {
    if (!box) return;
    var c = current || {};
    CATS.forEach(function (n) { var f = field(n); if (f) f.checked = c[n] === true; });
    if (options) options.hidden = !withOptions;
    var settingsBtn = box.querySelector("[data-consent-choose]");
    if (settingsBtn) settingsBtn.hidden = !!withOptions;
    box.hidden = false;
    var title = box.querySelector("#consent-title");
    if (withOptions && title) { try { title.focus({ preventScroll: true }); } catch (e) {} }
  }
  function hideBanner() { if (box) box.hidden = true; }

  function decide(next) {
    var prev = current;
    writeChoice(next);
    current = readChoice() || { stats: !!next.stats, media: !!next.media, ads: ADS && !!next.ads };
    hideBanner();
    var withdrew = !!prev && CATS.some(function (n) { return prev[n] === true && !next[n]; });
    if (withdrew) {
      if (prev.stats && !next.stats) {
        if (typeof window.gtag === "function") window.gtag("consent", "update", { analytics_storage: "denied" });
        dropStatsCookies();
      }
      if (ADS && prev.ads && !next.ads) dropAdsData();
      location.reload(); // what was loaded stays loaded until the page starts again: start it again
      return;
    }
    applyChoice(current);
  }

  var current = readChoice();
  applyChoice(current);
  if (!current) showBanner(false);

  if (box) {
    box.addEventListener("click", function (ev) {
      var t = ev.target;
      if (!t || !t.closest) return;
      if (t.closest("[data-consent-accept]")) decide({ stats: true, media: true, ads: ADS });
      else if (t.closest("[data-consent-refuse]")) decide({ stats: false, media: false, ads: false });
      else if (t.closest("[data-consent-choose]")) showBanner(true);
      else if (t.closest("[data-consent-save]")) decide({ stats: !!(field("stats") || {}).checked, media: !!(field("media") || {}).checked, ads: ADS && !!(field("ads") || {}).checked });
    });
  }
  // "Cookie settings": in the footer of every page, on /privacy/ and in every placeholder. Without JS it goes to /privacy/#cookies.
  document.addEventListener("click", function (ev) {
    var t = ev.target;
    if (!t || !t.closest) return;
    var open = t.closest("[data-consent-open]");
    if (open && box) { ev.preventDefault(); showBanner(true); return; }
    var load = t.closest("[data-afroton-load]");
    if (load) {
      var el = load.closest("[data-afroton-media]");
      if (el) release(el, true); // this one player, this page view; the banner choice stays as it was
    }
  });
  // capture phase: the labels are on the link before the browser follows it
  if (ADS) document.addEventListener("click", onTicketClick, true);
  window.afrotonConsentReset = function () { showBanner(true); };
})();
