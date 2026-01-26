// assets/js/pages/pro-settings.js
document.addEventListener("DOMContentLoaded", async () => {
  if (!window.HPSupabase) return;

  const { data: authData } = await window.HPSupabase.auth.getUser();
  const user = authData?.user;

  // Must be logged in + pro
  if (!user) {
    window.location.href = "/pages/login.html";
    return;
  }
  if (user.user_metadata?.role !== "pro") {
    window.location.href = "/dashboard/customer-dashboard.html";
    return;
  }

  const form = document.querySelector("form");
  const msg = document.querySelector("[data-save-msg]") || null;

  const setMsg = (text, ok) => {
    if (!msg) return;
    msg.textContent = text || "";
    msg.style.color = ok ? "#166534" : "#b91c1c";
  };

  // 1) Load profile into form
  const { data: profile, error: loadErr } = await window.HPSupabase
    .from("pro_profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (loadErr) {
    console.error(loadErr);
  } else if (profile && form) {
    // Map common fields (add more as you want)
    const setVal = (name, val) => {
      const el = form.querySelector(`[name="${name}"]`);
      if (!el) return;
      if (el.type === "checkbox") el.checked = !!val;
      else el.value = val ?? "";
    };

    setVal("business_name", profile.business_name);
    setVal("contact_name", profile.contact_name);
    setVal("business_email", profile.business_email);
    setVal("business_phone", profile.business_phone);
    setVal("website", profile.website);
    setVal("base_zip", profile.base_zip);
    setVal("radius", profile.radius);
    setVal("about", profile.about);

    setVal("job_type_residential", profile.job_type_residential);
    setVal("job_type_commercial", profile.job_type_commercial);
    setVal("licensed", profile.licensed);
    setVal("insured", profile.insured);
  }

  // 2) Save profile on submit
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setMsg("", true);

    const getVal = (name) => (form.querySelector(`[name="${name}"]`)?.value || "").trim();
    const getCheck = (name) => !!form.querySelector(`[name="${name}"]`)?.checked;

    const payload = {
      business_name: getVal("business_name"),
      contact_name: getVal("contact_name"),
      business_email: getVal("business_email"),
      business_phone: getVal("business_phone"),
      website: getVal("website"),
      base_zip: getVal("base_zip"),
      radius: Number(getVal("radius") || 0) || null,
      about: getVal("about"),
      job_type_residential: getCheck("job_type_residential"),
      job_type_commercial: getCheck("job_type_commercial"),
      licensed: getCheck("licensed"),
      insured: getCheck("insured"),
      updated_at: new Date().toISOString(),
    };

    try {
      const { error: saveErr } = await window.HPSupabase
        .from("pro_profiles")
        .update(payload)
        .eq("id", user.id);

      if (saveErr) throw saveErr;
      setMsg("Saved ✅", true);
    } catch (err) {
      console.error(err);
      setMsg(err?.message || "Save failed.", false);
    }
  });
});
