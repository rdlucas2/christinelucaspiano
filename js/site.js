/* Christine Lucas Piano Studio: header menu + MyMusicStaff sign-in dialog. */
(function () {
  document.documentElement.classList.add("has-js");

  // Mobile menu
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  if (header && toggle) {
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // Header shadow once the page scrolls
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 4);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Sign-in dialog. The MyMusicStaff login widget is loaded the first time the
  // dialog opens: it sizes its iframe when it loads, so loading it while the
  // dialog is hidden leaves a 0px-tall (blank) frame.
  var MMS_LOGIN_SRC = "https://app.mymusicstaff.com/Widget/v2/Login.ashx";
  var dialog = document.getElementById("signin");
  var widget = document.getElementById("signin-widget");
  var loaded = false;

  function openSignin(e) {
    if (e) e.preventDefault();
    if (!dialog) return;
    if (header) header.classList.remove("nav-open");
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
    if (!loaded && widget) {
      loaded = true;
      var s = document.createElement("script");
      s.type = "text/javascript";
      s.src = MMS_LOGIN_SRC;
      widget.appendChild(s);
    }
  }

  function closeSignin() {
    if (!dialog) return;
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }

  document.querySelectorAll("[data-open-signin]").forEach(function (el) {
    el.addEventListener("click", openSignin);
  });
  document.querySelectorAll("[data-close-signin]").forEach(function (el) {
    el.addEventListener("click", closeSignin);
  });
  if (dialog) {
    // Click on the dimmed backdrop closes the dialog.
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) closeSignin();
    });
  }
})();
