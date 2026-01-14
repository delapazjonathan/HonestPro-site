// assets/js/pages/find-a-pro.js
document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("hp-request-form");
  if (!form) return;

  if (!window.HPSupabase) {
    alert("Supabase is not configured yet (missing HP_SUPABASE_URL / HP_SUPABASE_ANON_KEY).");
    return;
  }

  function getVal(id) {
    const el = document.getElementById(id);
    return el ? (el.value || "").trim() : "";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Require login (customer) for MVP
    const { data: authData } = await window.HPSupabase.auth.getUser();
    const user = authData?.user;

    if (!user) {
      // Send them to login (or you can open a modal later)
      window.location.href = "login.html";
      return;
    }

    const payload = {
      customer_id: user.id,
      service_type: getVal("serviceType"),
      project_title: getVal("projectTitle"),
      project_details: getVal("projectDetails"),
      property_type: getVal("propertyType"),
      budget_range: getVal("budgetRange"),
      zip: getVal("zip"),
      city: getVal("city"),
      timeline: getVal("timeline"),
      contact_method: getVal("contactMethod"),
      contact_time: getVal("contactTime"),
      status: "open",
    };

    // Basic validation
    if (!payload.service_type || !payload.project_title || !payload.zip || !payload.city) {
      alert("Please fill out the category, project title, ZIP, and city.");
      return;
    }

    try {
      const { data, error } = await window.HPSupabase
        .from("customer_requests")
        .insert(payload)
        .select("id")
        .single();

      if (error) throw error;

      // Redirect to thank-you page with request id
      window.location.href = `request-submitted.html?rid=${encodeURIComponent(data.id)}`;
    } catch (err) {
      console.error(err);
      alert("Could not submit request. Please try again.");
    }
  });
});
