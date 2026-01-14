// assets/js/pages/customer-signup.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form.request-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // ✅ stops the POST that causes 405

    const email = document.getElementById("email")?.value?.trim();
    const password = document.getElementById("password")?.value || "";
    const confirm = document.getElementById("confirm-password")?.value || "";

    const agreed = form.querySelector('input[name="agree_terms"]')?.checked;

    if (!window.HPSupabase) return alert("Supabase is not configured.");
    if (!email) return alert("Please enter your email.");
    if (password.length < 8) return alert("Password must be at least 8 characters.");
    if (password !== confirm) return alert("Passwords do not match.");
    if (!agreed) return alert("Please agree to the Terms and Privacy Policy.");

    const { error } = await window.HPSupabase.auth.signUp({
      email,
      password,
      options: { data: { role: "customer" } },
    });

    if (error) {
      alert(error.message);
      return;
    }

    // If email confirmation is OFF, user is logged in immediately.
    // If it's ON, they'll need to confirm email first.
    window.location.href = "find-a-pro.html";
  });
});
