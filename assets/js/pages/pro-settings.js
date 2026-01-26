// assets/js/pages/pro-settings.js?v=2
document.addEventListener("DOMContentLoaded", async () => {
  if (!window.HPSupabase) {
    console.error("[HonestPro] Supabase client not found (HPSupabase).");
    return;
  }

  const form = document.querySelector("form.request-form");
  if (!form) return;

  // Status message UI
  let msg = document.getElementById("pro-settings-msg");
  if (!msg) {
    msg = document.createElement("div");
    msg.id = "pro-settings-msg";
    msg.style.marginTop = "0.75rem";
    msg.style.fontSize = "0.95rem";
    form.querySelector(".form-footer")?.appendChild(msg);
  }

  const setMsg = (text, ok = true) => {
    if (!msg) return;
    msg.textContent = text || "";
    msg.style.color = ok ? "#166534" : "#b91c1c";
  };

  // Auth check (must be logged in + pro)
  const { data: authData, error: authErr } = await window.HPSupabase.auth.getUser();
  if (authErr) {
    console.error(authErr);
    window.location.href = "/pages/login.html";
    return;
  }

  const user = authData?.user;
  if (!user) {
    window.location.href = "/pages/login.html";
    return;
  }

  if (user.user_metadata?.role !== "pro") {
    // Not a pro → send somewhere safe
    window.location.href = "/dashboard/customer-dashboard.html";
    return;
  }

  const setVal = (name, val) => {
    const el = form.querySelector(`[name="${name}"]`);
    if (!el) return;
    if (el.type === "checkbox") el.checked = !!val;
    else el.value = val ?? "";
  };

  const getVal = (name) => (form.querySelector(`[name="${name}"]`)?.value || "").trim();
  const getCheck = (name) => !!form.querySelector(`[name="${name}"]`)?.checked;
  const getRadio = (name) => form.querySelector(`input[name="${name}"]:checked`)?.value || null;

  // 1) Load profile into form
  try {
    const { data: profile, error: loadErr } = await window.HPSupabase
      .from("pro_profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (loadErr) throw loadErr;

    if (profile) {
      setVal("business_name", profile.business_name);
      setVal("contact_name", profile.contact_name);
      setVal("business_email", profile.business_email);
      setVal("business_phone", profile.business_phone);
      setVal("website", profile.website);
      setVal("about", profile.about);
      setVal("base_zip", profile.base_zip);
      setVal("radius", profile.radius);

      setVal("job_type_residential", profile.job_type_residential);
      setVal("job_type_commercial", profile.job_type_commercial);

      // Optional if your table has these (your pro-signup payload includes them)
      setVal("licensed", profile.licensed);
      setVal("insured", profile.insured);

      // Optional preference fields (only if you add columns later)
      // setVal("lead_volume", profile.lead_volume);
      // setVal("lead_contact", profile.lead_contact);
    }
  } catch (e) {
    console.error("[HonestPro] Failed to load pro profile:", e);
    setMsg(e?.message || "Couldn’t load your profile.", false);
  }

  // 2) Save profile (prevents 405)
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setMsg("Saving…");

    const payload = {
      business_name: getVal("business_name"),
      contact_name: getVal("contact_name"),
      business_email: getVal("business_email"),
      business_phone: getVal("business_phone"),
      website: getVal("website"),
      about: getVal("about"),
      base_zip: getVal("base_zip"),
      radius: Number(getVal("radius") || 0) || null,

      job_type_residential: getCheck("job_type_residential"),
      job_type_commercial: getCheck("job_type_commercial"),

      // If your form adds these later:
      // lead_volume: getVal("lead_volume"),
      // lead_contact: getRadio("lead_contact"),

      updated_at: new Date().toISOString(),
    };

    try {
      const { error: saveErr } = await window.HPSupabase
        .from("pro_profiles")
        .update(payload)
        .eq("id", user.id);

      if (saveErr) throw saveErr;

      setMsg("Saved ✅");
    } catch (err) {
      console.error("[HonestPro] Save failed:", err);
      setMsg(err?.message || "Save failed.", false);
    }
  });
});
