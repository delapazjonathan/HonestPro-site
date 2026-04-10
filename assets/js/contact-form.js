document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("service-request-form");
  const success = document.getElementById("form-success");
  if (!form) return;

  const endpoint = form.dataset.endpoint || "";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    success.classList.remove("is-visible");

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    if (!payload.name || !payload.phone || !payload.city || !payload.appliance_type) {
      success.textContent = "Please fill in the required fields before submitting.";
      success.style.background = "#fef2f2";
      success.style.color = "#991b1b";
      success.style.borderColor = "#fecaca";
      success.classList.add("is-visible");
      return;
    }

    if (!endpoint) {
      sessionStorage.setItem("honestpro_last_request", JSON.stringify(payload));
      window.location.href = "request-submitted.html";
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      sessionStorage.setItem("honestpro_last_request", JSON.stringify(payload));
      window.location.href = "request-submitted.html";
    } catch (error) {
      success.textContent = "Your form looks good, but the submission endpoint is not connected yet. Add your Formspree, webhook, or booking endpoint to data-endpoint on the form.";
      success.style.background = "#fff7ed";
      success.style.color = "#9a3412";
      success.style.borderColor = "#fed7aa";
      success.classList.add("is-visible");
      console.error("HonestPro form submit error:", error);
    }
  });
});
