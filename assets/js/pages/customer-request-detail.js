// assets/js/pages/customer-request-detail.js
document.addEventListener("DOMContentLoaded", async () => {
  const me = await window.HPGuards.requireCustomer();
  if (!me) return;

  // Request detail UI (tabs, pro card selection) will work after this point.
});
