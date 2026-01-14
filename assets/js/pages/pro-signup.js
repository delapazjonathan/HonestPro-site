// assets/js/pages/pro-signup.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form.request-form");
  if (!form) return;

  const setError = (msg) => {
    let box = form.querySelector(".form-error");
    if (!box) {
      box = document.createElement("div");
      box.className = "form-error";
      box.style.marginTop = "0.75rem";
      box.style.color = "#b91c1c";
      box.style.fontSize = "0.95rem";
      form.prepend(box);
    }
    box.textContent = msg || "";
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setError("");

    const email =
      (form.querySelector('[name="business_email"]')?.value || "").trim();
    const password =
      (form.querySelector('[name="password"]')?.value || "").trim();
    const confirm =
      (form.querySelector('[name="confirm_password"]')?.value || "").trim();

    if (!email) return setError("Business email is required.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("Passwords do not match.");

    const agreed = form.querySelector('input[name="agree_terms"]')?.checked;
    if (!agreed) return setError("Please agree to the Terms and Privacy Policy.");

    // Build profile payload (store in table after auth user exists)
    const profile = {
      business_name: (form.querySelector('[name="business_name"]')?.value || "").trim(),
      contact_name: (form.querySelector('[name="contact_name"]')?.value || "").trim(),
      business_email: email,
      business_phone: (form.querySelector('[name="business_phone"]')?.value || "").trim(),
      website: (form.querySelector('[name="website"]')?.value || "").trim(),
      base_zip: (form.querySelector('[name="base_zip"]')?.value || "").trim(),
      radius: Number(form.querySelector('[name="radius"]')?.value || 0) || null,
      job_type_residential: !!form.querySelector('[name="job_type_residential"]')?.checked,
      job_type_commercial: !!form.querySelector('[name="job_type_commercial"]')?.checked,
      licensed: !!form.querySelector('[name="licensed"]')?.checked,
      insured: !!form.querySelector('[name="insured"]')?.checked,
      created_at: new Date().toISOString(),
    };

    try {
      // 1) Create auth user with role=pro
      const { data, error } = await window.HPSupabase.auth.signUp({
        email,
        password,
        options: { data: { role: "pro" } },
      });
      if (error) throw error;

      const user = data?.user;
      if (!user) {
        // If email confirmations are ON, you may not get a session.
        // Still create profile after they confirm (we’ll handle that later).
        window.location.href = "/pages/login.html?check_email=1";
        return;
      }

      // 2) Insert pro profile row (tied to auth user id)
      const { error: profileErr } = await window.HPSupabase
        .from("pro_profiles")
        .insert([{ id: user.id, ...profile }]);

      if (profileErr) throw profileErr;

      // 3) Send them to pro dashboard (or early access thank-you)
      window.location.href = "/dashboard/pro-dashboard.html";
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
      console.error("[HonestPro] Pro signup error:", err);
    }
  });
});
