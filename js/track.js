/* Click tracking for christinelucaspiano.com.
   Events go to GA4 (G-29872C30D8) through the Google tag GTM-M95SXW2H loaded
   in each page's <head>, which defines window.gtag. Mark phone_click,
   email_click, start_lessons_click and group_class_inquiry as key events in
   GA4 to count them. group_class_inquiry is the Google Ads conversion. */
(function () {
  function track(name, params) {
    if (typeof window.gtag === "function") window.gtag("event", name, params || {});
  }
  document.addEventListener("click", function (e) {
    var link = e.target.closest && e.target.closest("a[href]");
    if (!link) return;
    var href = link.getAttribute("href") || "";
    var page = location.pathname.replace(/^\/$/, "/index.html");
    var cta = link.getAttribute("data-group-class-cta");
    if (cta) {
      track("group_class_inquiry", { method: cta, page: page });
    }
    if (href.indexOf("tel:") === 0) {
      track("phone_click", { page: page });
    } else if (href.indexOf("mailto:") === 0) {
      track("email_click", { page: page });
    } else if (link.hasAttribute("data-start-lessons")) {
      track("start_lessons_click", { page: page });
    }
  });
})();
