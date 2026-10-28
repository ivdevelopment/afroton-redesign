/* Newsletter sign-up (20/10/2026): every form on the page that posts to /api/subscribe gets the same behaviour here,
   the orange "stay tuned" card on the home page and the box under JOIN OUR COMMUNITY in the footer alike.
   The address goes to our own /api/subscribe, which hands it to the newsletter tool server-side and sends a
   confirmation mail first (double opt-in). No third-party code, no cookie, nothing before the visitor presses the button.
   The form's own status line (role="status") shows the answer. */
(function () {
  var opened = Date.now(); // the server takes anything sent within 2 s of page load for a bot
  var IG = '<a href="https://www.instagram.com/afro.ton/" target="_blank" rel="noopener">Instagram</a>';
  var TEXT = {
    ok: "Thanks! Check your inbox.",
    invalid: "That e-mail address doesn't look right.",
    "rate-limit": "Too many tries. Try again in a few minutes.",
    unconfigured: "Sign-ups open soon. Follow us on " + IG + " for now.",
    error: "Something went wrong. Try again later, or follow us on " + IG + "."
  };

  function wire(form) {
    if (form.afroSignup) return; // wired once, even if this file is loaded twice
    var msg = form.querySelector("[role=status]");
    var btn = form.querySelector("button[type=submit]");
    if (!msg || !btn || !form.elements.email || !form.elements.website) return;
    form.afroSignup = true;
    function show(key) { msg.innerHTML = TEXT[key] || TEXT.error; }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = form.elements.email.value.trim();
      if (!email || !form.elements.email.checkValidity()) { show("invalid"); return; }
      btn.disabled = true;
      msg.textContent = "";
      fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, website: form.elements.website.value, ts: opened })
      }).then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (b) {
          if (r.ok && b.ok) { show("ok"); form.reset(); return; }
          show(b.error === "invalid" || b.error === "unconfigured" || b.error === "rate-limit" ? b.error : "error");
        });
      }).catch(function () { show("error"); }).then(function () { btn.disabled = false; });
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll('form[action="/api/subscribe"]'), wire);
})();
