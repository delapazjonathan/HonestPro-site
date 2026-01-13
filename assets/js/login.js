// assets/js/pages/login.js
(function () {
  const form = document.getElementById("login-form");
  if (!form) return;

  const emailEl = document.getElementById("login-email");
  const passEl = document.getElementById("login-password");
  const errEl = document.getElementById("login-error");
  const submitBtn = document.getElementById("login-submit");

  function setError(msg) {
    errEl.textContent = msg;
    errEl.style.display = msg ? "block" : "none";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setError("");

    const email = (emailEl.value || "").trim();
    const password = passEl.value || "";

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Logging in…";

    try {
      // Expected response shape:
      // { user: { role: "customer"|"pro", ... }, redirectTo: "/dashboard/..." }
      const result = await window.HPAuth.login(email, password);

      // If backend returns redirectTo, use it. Otherwise fall back on role.
      const redirectTo =
        result?.redirectTo ||
        (result?.user?.role === "pro" ? "pro-dashboard.html" : "customer-dashboard.html");

      window.location.href = redirectTo;
    } catch (err) {
      const apiError = err?.data?.error || err.message || "Login failed.";
      if (apiError === "INVALID_CREDENTIALS") setError("Invalid email or password.");
      else if (apiError === "ACCOUNT_DISABLED") setError("This account is disabled.");
      else setError(apiError);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Log in";
    }
  });
})();
