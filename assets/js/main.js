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

document.addEventListener("DOMContentLoaded", async () => {
  if (!window.HPSupabase) return;

  const { data } = await window.HPSupabase.auth.getUser();
  const user = data?.user;

  const authBtn = document.querySelector("[data-auth-button]");
  if (!authBtn) return;

  if (user) {
    authBtn.textContent = "Logout";
    authBtn.href = "/pages/logout.html";
  } else {
    authBtn.textContent = "Login";
    authBtn.href = "/pages/login.html";
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const authBtn = document.querySelector("[data-auth-button]");
  if (!authBtn) return;

  // If Supabase isn't loaded on this page, leave as-is
  if (!window.HPSupabase) return;

  const { data } = await window.HPSupabase.auth.getUser();
  const user = data?.user;

  if (user) {
    authBtn.textContent = "Logout";
    authBtn.href = "/pages/logout.html";
  } else {
    authBtn.textContent = "Login";
    authBtn.href = "/pages/login.html";
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const btn = document.querySelector("[data-auth-button]");
  if (!btn) return;

  // Only switch if Supabase is available on this page
  if (!window.HPSupabase) return;

  const { data } = await window.HPSupabase.auth.getUser();
  const user = data?.user;

  if (user) {
    btn.textContent = "Logout";
    btn.href = "/pages/logout.html";
  } else {
    btn.textContent = "Login";
    btn.href = "/pages/login.html";
  }
});



