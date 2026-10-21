// Cookievalg for Google Analytics. Valget gemmes lokalt i browseren.
// "Ja, gerne" slår fuld måling til med cookies; "Nej tak" holder målingen cookieløs og fjerner
// eventuelle Analytics-cookies igen. Linket "Cookievalg" i bunden genåbner banneret.
(function () {
  var KEY = "lumihue-consent";
  var banner = document.getElementById("cookievalg");
  if (!banner) return;

  function readChoice() {
    try {
      return localStorage.getItem(KEY);
    } catch (error) {
      return null;
    }
  }

  function saveChoice(value) {
    try {
      localStorage.setItem(KEY, value);
    } catch (error) {}
  }

  function show() {
    banner.hidden = false;
    document.body.classList.add("consent-open");
  }

  function hide() {
    banner.hidden = true;
    document.body.classList.remove("consent-open");
  }

  function clearAnalyticsCookies() {
    var host = location.hostname;
    var parts = host.split(".");
    var domains = ["", host, "." + host];
    if (parts.length > 2) domains.push("." + parts.slice(-2).join("."));
    document.cookie.split(";").forEach(function (entry) {
      var name = entry.split("=")[0].trim();
      if (name.indexOf("_ga") !== 0) return;
      domains.forEach(function (domain) {
        document.cookie =
          name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" + (domain ? "; domain=" + domain : "");
      });
    });
  }

  function choose(value) {
    saveChoice(value);
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", { analytics_storage: value });
    }
    if (value === "denied") clearAnalyticsCookies();
    hide();
  }

  banner.querySelectorAll("[data-consent]").forEach(function (button) {
    button.addEventListener("click", function () {
      choose(button.getAttribute("data-consent"));
    });
  });

  document.querySelectorAll("[data-consent-open]").forEach(function (opener) {
    opener.addEventListener("click", function () {
      show();
      banner.querySelector(".consent-no").focus();
    });
  });

  banner.addEventListener("keydown", function (event) {
    if (event.key === "Escape") choose("denied");
  });

  var saved = readChoice();
  if (saved !== "granted" && saved !== "denied") show();
})();
