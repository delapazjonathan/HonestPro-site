// assets/js/pages/customer-settings.js
document.addEventListener("DOMContentLoaded", async () => {
  const me = await window.HPGuards.requireCustomer();
  if (!me) return;

  // Later: populate settings fields from /me or /customers/me
});
