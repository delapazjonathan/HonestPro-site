document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("service-request-form");
  const successBox = document.getElementById("form-success");

  if (!form) return;

  const endpoint = form.dataset.endpoint?.trim();
  const submitButton = form.querySelector('button[type="submit"]');

  const setMessage = (message, isError = false) => {
    if (!successBox) return;

    successBox.textContent = message;
    successBox.style.display = "block";
    successBox.style.marginTop = "1rem";
    successBox.style.padding = "0.85rem 1rem";
    successBox.style.borderRadius = "0.8rem";
    successBox.style.fontWeight = "600";
    successBox.style.background = isError ? "#fee2e2" : "#dcfce7";
    successBox.style.color = isError ? "#991b1b" : "#166534";
    successBox.style.border = isError
      ? "1px solid #fecaca"
      : "1px solid #bbf7d0";
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!endpoint || endpoint === "YOUR_FORM_ENDPOINT_HERE") {
      setMessage("Form endpoint is missing. Add your form endpoint first.", true);
      return;
    }

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }

    if (successBox) {
      successBox.textContent = "";
      successBox.style.display = "none";
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      form.reset();
      setMessage("Thanks — your service request was sent successfully.");

      setTimeout(() => {
        window.location.href = "request-submitted.html";
      }, 1200);
    } catch (error) {
      console.error("Service request submit error:", error);
      setMessage("Something went wrong sending your request. Please call or try again.", true);
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Submit request";
      }
    }
  });
});