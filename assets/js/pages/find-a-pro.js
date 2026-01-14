// TEMP: Customer early access lock
window.location.replace("/pages/customer-early-access.html");


// assets/js/pages/find-a-pro.js
document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("hp-request-form");
  if (!form) return;

  if (!window.HPSupabase) {
    alert("Supabase is not configured yet.");
    return;
  }

  // ✅ OPTION 1: Require login BEFORE they can use the page
  const { data: authData } = await window.HPSupabase.auth.getUser();
  const user = authData?.user;

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  function getVal(id) {
    const el = document.getElementById(id);
    return el ? (el.value || "").trim() : "";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

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

      window.location.href = `request-submitted.html?rid=${encodeURIComponent(data.id)}`;
    } catch (err) {
      console.error(err);
      alert("Could not submit request. Please try again.");
    }
  });
});

