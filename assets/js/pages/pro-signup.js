// ./assets/js/pages/pro-signup.js

(function () {
  // ---- helpers
  const $ = (sel, root = document) => root.querySelector(sel);

  function setFormError(form, message) {
    // If you already have a shared UI pattern, swap this out.
    let box = form.querySelector(".form-error");
    if (!box) {
      box = document.createElement("div");
      box.className = "form-error";
      box.style.marginTop = "0.75rem";
      box.style.color = "#b91c1c";
      box.style.fontSize = "0.95rem";
      form.prepend(box);
    }
    box.textContent = message || "";
  }

  // Convert FormData -> plain object
  // - checkbox: include boolean
  // - multiple values (same name): array
  function formDataToObject(form) {
    const fd = new FormData(form);
    const obj = {};

    // First collect normal fields
    for (const [key, value] of fd.entries()) {
      if (obj[key] === undefined) obj[key] = value;
      else if (Array.isArray(obj[key])) obj[key].push(value);
      else obj[key] = [obj[key], value];
    }

    // Then force checkbox booleans for any checkbox with a name
    form.querySelectorAll('input[type="checkbox"][name]').forEach((cb) => {
      // If checkbox shares a name with others, the FormData approach (arrays) might be desired.
      // But on this page most checkboxes have unique names (licensed/insured/job_type_*).
      if (!cb.name) return;

      // If it already became an array (multi-checkbox same name), leave it alone.
      if (Array.isArray(obj[cb.name])) return;

      // Otherwise store boolean
      obj[cb.name] = cb.checked;
    });

    return obj;
  }

  // ---- guard (requires auth.js)
  // Assumes auth.js exposes something like:
  //   window.Auth.getSession() -> { token, role } or null
  // If your auth helpers are named differently, tell me what you used and I’ll match it.
  function guardIfLoggedIn() {
    const session = window.Auth?.getSession?.();
    if (!session?.token) return;

    if (session.role === "pro") window.location.href = "pro-dashboard.html";
    else window.location.href = "customer-dashboard.html";
  }

  // ---- main
  document.addEventListener("DOMContentLoaded", () => {
    guardIfLoggedIn();

    const form = $("form.request-form");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      setFormError(form, "");

      const password = $('#password', form)?.value?.trim() || "";
      const confirm = $('#confirm-password', form)?.value?.trim() || "";

      if (password.length < 8) {
        setFormError(form, "Password must be at least 8 characters.");
        return;
      }
      if (password !== confirm) {
        setFormError(form, "Passwords do not match.");
        return;
      }

      const agreed = form.querySelector('input[name="agree_terms"]')?.checked;
      if (!agreed) {
        setFormError(form, "Please agree to the Terms and Privacy Policy.");
        return;
      }

      const payload = formDataToObject(form);

      try {
        // Assumes api.js exposes window.API.request(method, path, body)
        // If yours is named differently, swap this call.
        const res = await window.API.request("POST", "/auth/pro/apply", payload);

        // Common patterns:
        // - If pro applications create an account immediately: res could include token/role
        // - If it’s just an application: res could be { ok: true }
        if (res?.token) {
          window.Auth?.setSession?.({ token: res.token, role: "pro" });
          window.location.href = "pro-dashboard.html";
          return;
        }

        // Otherwise: treat as “application submitted”
        window.location.href = "login.html?applied=1";
      } catch (err) {
        const msg =
          err?.message ||
          err?.error ||
          "Something went wrong submitting your application. Please try again.";
        setFormError(form, msg);
      }
    });
  });
})();
