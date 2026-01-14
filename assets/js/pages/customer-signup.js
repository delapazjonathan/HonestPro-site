// assets/js/pages/customer-signup.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("customer-signup-form");
  if (!form) return;

  const emailEl = document.getElementById("signup-email");
  const passEl = document.getElementById("signup-password");
  const errEl = document.getElementById("signup-error");
  const submitBtn = document.getElementById("signup-submit");

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

    if (!email || password.length < 8) {
      setError("Use a valid email and a password of at least 8 characters.");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Creating…";

    try {
      const { data, error } = await window.HPSupabase.auth.signUp({
        email,
        password,
        options: {
          data: { role: "customer" } // we'll use this later for routing/guards
        }
      });

      if (error) throw error;

      // If email confirmations are ON, the user may need to verify first.
      window.location.href = "/pages/find-a-pro.html";
    } catch (err) {
      console.error(err);
      setError(err?.message || "Signup failed.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Create account";
    }
  });
});
