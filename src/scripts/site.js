/* AFROTON site behaviour: header, mobile menu, ticker, reveals, gallery tabs and lightbox.
   Everything works without it (links, forms and the shop are plain HTML); this only adds polish.
   Consent, newsletter and the ticket shop have their own scripts (afroton-consent.js, afroton-signup.js,
   ot-shop-injector.js). */
(function () {
  "use strict";
  var doc = document.documentElement;
  var calm = window.matchMedia("(prefers-reduced-motion: reduce)");

  // ------------------------------------------------------------ header: solid once the page scrolls
  var header = document.querySelector("[data-header]");
  if (header) {
    var onScroll = function () { header.classList.toggle("is-solid", window.scrollY > 40); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    // the browser may restore the scroll position after this runs without a scroll event
    window.addEventListener("load", onScroll);
    window.addEventListener("pageshow", onScroll);
  }

  // ------------------------------------------------------------ mobile menu
  var toggle = document.querySelector("[data-menu-toggle]");
  var menu = document.querySelector("[data-menu]");
  if (toggle && menu) {
    var setOpen = function (open, focusBack) {
      toggle.setAttribute("aria-expanded", String(open));
      menu.hidden = !open;
      menu.classList.toggle("is-open", open);
      doc.classList.toggle("menu-open", open);
      if (open) {
        var first = menu.querySelector("a");
        if (first) first.focus();
      } else if (focusBack) {
        toggle.focus();
      }
    };
    toggle.addEventListener("click", function () { setOpen(toggle.getAttribute("aria-expanded") !== "true"); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") setOpen(false, true);
      // keep Tab inside the open menu (the toggle counts as part of it)
      if (e.key === "Tab" && toggle.getAttribute("aria-expanded") === "true") {
        var items = [toggle].concat(Array.prototype.slice.call(menu.querySelectorAll("a, button")));
        var i = items.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
        else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
      }
    });
    window.matchMedia("(min-width: 1100px)").addEventListener("change", function (m) { if (m.matches) setOpen(false); });
  }

  // ------------------------------------------------------------ ticker pause
  Array.prototype.forEach.call(document.querySelectorAll("[data-ticker]"), function (t) {
    var btn = t.querySelector("[data-ticker-toggle]");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var paused = t.classList.toggle("is-paused");
      btn.setAttribute("aria-pressed", String(paused));
      btn.querySelector(".sr-only").textContent = paused ? "Play the moving banner" : "Pause the moving banner";
    });
  });

  // ------------------------------------------------------------ reveal on scroll
  // Only for what starts below the first screen, so nothing visible on load ever blinks. The observer's first
  // report tells which elements are off-screen; nothing is measured by hand, so there is no forced layout.
  var REVEAL = ".section-head, .feature-event, .past-card, .story__content, .strip__item, .platform__inner, .pillar, .stat, .timeline__item, .person, .follow__card, .cta-band";
  function setupReveals() {
    var seen = new WeakSet();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var el = en.target;
        if (!seen.has(el)) { // first report
          seen.add(el);
          if (en.isIntersecting) { io.unobserve(el); return; } // on screen at load: leave it alone
          el.style.transitionDelay = (el.getAttribute("data-i") % 4) * 70 + "ms";
          el.classList.add("reveal");
          return;
        }
        if (!en.isIntersecting) return;
        el.classList.add("is-in");
        io.unobserve(el);
        // hand the element back to its own hover transitions once it has arrived
        setTimeout(function () { el.classList.remove("reveal", "is-in"); el.style.transitionDelay = ""; el.removeAttribute("data-i"); }, 1200);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    Array.prototype.forEach.call(document.querySelectorAll(REVEAL), function (el) {
      el.setAttribute("data-i", Array.prototype.indexOf.call(el.parentNode.children, el));
      io.observe(el);
    });
  }
  // set up after the first render and in idle time: reveals must never cost the page its first paint
  if ("IntersectionObserver" in window && !calm.matches) {
    var idle = window.requestIdleCallback || function (fn) { return setTimeout(fn, 200); };
    if (document.readyState === "complete") idle(setupReveals);
    else window.addEventListener("load", function () { idle(setupReveals); });
  }

  // ------------------------------------------------------------ newsletter demo (static concept builds)
  // Static hosting has no /api/subscribe: the form checks the address and answers, and nothing is sent anywhere.
  Array.prototype.forEach.call(document.querySelectorAll("form[data-demo-signup]"), function (form) {
    var msg = form.querySelector("[role=status]");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = form.elements.email;
      if (!email.value.trim() || !email.checkValidity()) { msg.textContent = "That e-mail address doesn't look right."; return; }
      msg.innerHTML = 'Thanks! This is a design concept, so nothing was sent. For real Afroton news, follow <a href="https://www.instagram.com/afro.ton/" target="_blank" rel="noopener">@afro.ton</a>.';
      form.reset();
    });
  });

  // ------------------------------------------------------------ gallery: tabs per event
  var tablist = document.querySelector("[data-tabs]");
  if (tablist) {
    var tabs = Array.prototype.slice.call(tablist.querySelectorAll("[role=tab]"));
    // without JS every set is visible one after the other; with JS only the chosen one
    var select = function (tab, focus, keepHash) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
      });
      if (focus) tab.focus();
      if (!keepHash && history.replaceState) history.replaceState(null, "", "#" + tab.getAttribute("data-hash"));
    };
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t); });
      t.addEventListener("keydown", function (e) {
        var n = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? tabs.length - 1 : null;
        if (n === null) return;
        e.preventDefault();
        select(tabs[(n + tabs.length) % tabs.length], true);
      });
    });
    var fromHash = tabs.filter(function (t) { return "#" + t.getAttribute("data-hash") === location.hash; })[0];
    select(fromHash || tabs[0], false, true);
    if (fromHash) tablist.scrollIntoView({ block: "start" });
  }

  // ------------------------------------------------------------ gallery: lightbox
  var box = document.querySelector("[data-lightbox]");
  if (box && typeof box.showModal === "function") {
    var imgEl = box.querySelector("[data-lightbox-img]");
    var cap = box.querySelector("[data-lightbox-caption]");
    var count = box.querySelector("[data-lightbox-count]");
    var list = [], index = 0, opener = null;
    var show = function (i) {
      index = (i + list.length) % list.length;
      var a = list[index];
      imgEl.src = a.getAttribute("href");
      imgEl.alt = a.querySelector("img").alt;
      imgEl.width = +a.getAttribute("data-w");
      imgEl.height = +a.getAttribute("data-h");
      cap.textContent = imgEl.alt;
      count.textContent = (index + 1) + " / " + list.length;
    };
    document.addEventListener("click", function (e) {
      var a = e.target.closest("[data-lightbox-item]");
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      var panel = a.closest("[role=tabpanel]") || document;
      list = Array.prototype.slice.call(panel.querySelectorAll("[data-lightbox-item]"));
      opener = a;
      show(list.indexOf(a));
      box.showModal();
    });
    box.querySelector("[data-lightbox-prev]").addEventListener("click", function () { show(index - 1); });
    box.querySelector("[data-lightbox-next]").addEventListener("click", function () { show(index + 1); });
    box.querySelector("[data-lightbox-close]").addEventListener("click", function () { box.close(); });
    box.addEventListener("click", function (e) { if (e.target === box) box.close(); });
    box.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") show(index + 1);
      if (e.key === "ArrowLeft") show(index - 1);
    });
    box.addEventListener("close", function () { imgEl.removeAttribute("src"); if (opener) opener.focus(); });
  }
})();
