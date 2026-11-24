/* Group class sign-up form (group-class.html).
   Posts to the Google Apps Script web app described in apps-script/README.md,
   then sends the visitor to thanks.html, which records the conversion. */
(function () {
  // Paste the Apps Script "Web app URL" (ends in /exec) here.
  var SIGNUP_ENDPOINT = "https://script.google.com/macros/s/AKfycbziXtjOWonAI5P_4jXWBuQNLZhS4OTN4HrpZ10M8k20w2XkL9_LjQGuucmOETPaCes57g/exec";
  var FALLBACK_EMAIL = "contact@christinelucaspiano.com";

  var form = document.getElementById("signup-form");
  if (!form) return;
  var button = form.querySelector('button[type="submit"]');
  var status = document.getElementById("signup-status");

  function value(name) {
    var el = form.elements[name];
    return el ? String(el.value || "").trim() : "";
  }

  function done() {
    try { sessionStorage.setItem("group_class_signup", "1"); } catch (e) {}
    window.location.href = "thanks.html";
  }

  function mailtoFallback() {
    var body = [
      "Hi Christine, I'd like to sign up for the adult group piano class.",
      "",
      "Name: " + value("name"),
      "Email: " + value("email"),
      "Phone: " + value("phone"),
      "Experience: " + value("experience"),
      "",
      value("message")
    ].join("\n");
    window.location.href = "mailto:" + FALLBACK_EMAIL +
      "?subject=" + encodeURIComponent("Adult Group Class sign-up") +
      "&body=" + encodeURIComponent(body);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    if (!SIGNUP_ENDPOINT) { mailtoFallback(); return; }

    button.disabled = true;
    button.textContent = "Sending…";
    if (status) status.textContent = "";

    var data = new URLSearchParams();
    ["name", "email", "phone", "experience", "message", "class", "website"].forEach(function (n) {
      data.append(n, value(n));
    });
    data.append("page", location.pathname);

    // Apps Script web apps don't send CORS headers, so the response can't be
    // read; a network-level success is treated as delivered.
    fetch(SIGNUP_ENDPOINT, { method: "POST", mode: "no-cors", body: data })
      .then(done)
      .catch(function () {
        button.disabled = false;
        button.textContent = "Sign Me Up";
        if (status) {
          status.innerHTML = "Sorry, that didn't go through. Please try again, or " +
            '<a href="mailto:' + FALLBACK_EMAIL + '?Subject=Adult%20Group%20Class">email me</a>.';
        }
      });
  });
})();
