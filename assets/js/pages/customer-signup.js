// assets/js/pages/customer-signup.js
(function () {
  function $(sel, root = document) { return root.querySelector(sel); }

  function setFormError(form, msg) {
    let el = $("#form-error", form);
    if (!el) {
      el = document.createElement("div");
      el.id = "form-error";
      el.style.display = "none";
      el.style.color = "#b91c1c";
      el.style.marginTop = "0.75rem";
      form.appendChild(el);
    }
    el.textContent = msg || "";
    el.style.display = msg ? "block" : "none";
  }

  document.addEventListener("DOMContentLoaded", () => {
    const form = $("form.request-form");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      setFormError(form, "");

      const email = $("#email", form)?.value?.trim();
      const password = $("#password", form)?.value?.trim();
      const confirm = $("#confirm-password", form)?.value?.trim();

      if (!email) return setFormError(form, "Please enter an email.");
      if (!password || password.length < 8) return setFormError(form, "Password must be at least 8 characters.");
      if (password !== confirm) return setFormError(form, "Passwords do not match.");

      const agreed = form.querySelector('input[name="agree_terms"]')?.checked;
      if (!agreed) return setFormError(form, "Please agree to the Terms and Privacy Policy.");

      try {
        // 1) Create account
        await window.HPAuth.signup(email, password);

        // 2) Log them in immediately (creates cookie)
        await window.HPAuth.login(email, password);

        // 3) Go to customer dashboard
        window.location.href = "customer-dashboard.html";
      } catch (err) {
        setFormError(form, err?.message || "Could not create account. Please try again.");
      }
    });
  });
})();

