(function () {
  const form = document.getElementById("early-pro-form");
  if (!form) return;

  const errEl = document.getElementById("form-error");
  const okEl = document.getElementById("form-success");
  const submitBtn = document.getElementById("submit-btn");

  function setError(msg) {
    errEl.textContent = msg || "";
    errEl.style.display = msg ? "block" : "none";
  }

  function setSuccess(msg) {
    okEl.textContent = msg || "";
    okEl.style.display = msg ? "block" : "none";
  }

  function formToObject(formEl) {
    const fd = new FormData(formEl);
    const obj = {};
    for (const [k, v] of fd.entries()) obj[k] = (v || "").toString();
    return obj;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const payload = formToObject(form);
    if (!payload.email || !payload.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting…";

    try {
      const res = await fetch("/api/early-pro-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const code = data?.error || "SUBMIT_FAILED";
        if (code === "EMAIL_REQUIRED") setError("Email is required.");
        else setError("Something went wrong. Please try again.");
        return;
      }

          // Hide the form
        form.style.display = "none";

        // Show thank you message
        const successEl = document.getElementById("early-pro-success");
        if (successEl) {
        successEl.style.display = "block";
      }

      setSuccess("You’re on the list! We’ll email you when early access opens in your area.");
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Join early access";
    }
  });
})();
