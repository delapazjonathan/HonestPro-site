// main.js
console.log("HonestPro site loaded");

// Add a small delay so animations feel smooth
document.addEventListener("DOMContentLoaded", function () {
  document.body.classList.add("is-loaded");

  // Mobile nav toggle
  var toggle = document.querySelector(".mobile-nav-toggle");
  var nav = document.querySelector(".site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("site-nav--open");
      toggle.classList.toggle("is-active", isOpen);
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const proCtas = document.querySelectorAll(
    'a[href*="pro-signup"], a[href*="pros"], a[data-role="pro-signup"]'
  );

  proCtas.forEach(link => {
    link.href = "/pages/pro-early-access.html";
  });
});
