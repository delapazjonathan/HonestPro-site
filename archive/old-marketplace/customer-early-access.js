document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("customerEarlyAccessForm");
  const msg = document.getElementById("formMsg");
  if (!form) return;

  // Prevent repeat submits (simple polish)
  if (localStorage.getItem("hp_customer_early_access_submitted") === "1") {
    msg.textContent = "You’re already on the list ✅";
    msg.style.color = "#166534";
    return;
  }

  const setMsg = (text, ok) => {
    msg.textContent = text;
    msg.style.color = ok ? "#166534" : "#b91c1c";
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setMsg("", true);

    const name = (form.querySelector('[name="name"]')?.value || "").trim();
    const email = (form.querySelector('[name="email"]')?.value || "").trim();
    const zip = (form.querySelector('[name="zip"]')?.value || "").trim();

    if (!email) {
      setMsg("Email is required.", false);
      return;
    }

    try {
      const { error } = await window.HPSupabase
        .from("customer_early_access")
        .insert([{ name, email, zip }]);

      if (error) throw error;

      localStorage.setItem("hp_customer_early_access_submitted", "1");
      form.reset();
      setMsg("You’re on the list ✅ We’ll notify you when customer requests go live.", true);
    } catch (err) {
      console.error("[HonestPro] customer early access error:", err);
      setMsg(err?.message || "Something went wrong. Please try again.", false);
    }
  });
});
