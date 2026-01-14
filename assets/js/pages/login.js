// assets/js/pages/login.js  (Supabase version)
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

    if (!window.HPSupabase) {
      setError("Supabase is not configured on this page.");
      return;
    }

    const email = (emailEl.value || "").trim();
    const password = passEl.value || "";

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Logging in…";

    try {
      const { data, error } = await window.HPSupabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      // For now, send everyone to Find-a-Pro or Customer Dashboard
      // (We’ll add role routing after we store roles.)
      window.location.href = "/pages/find-a-pro.html";
    } catch (err) {
      console.error(err);
      setError(err?.message || "Login failed.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Log in";
    }
  });
})();

