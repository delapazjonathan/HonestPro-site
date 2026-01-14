// assets/js/pages/customer-messages.js
document.addEventListener("DOMContentLoaded", async () => {
  const me = await window.HPGuards.requireCustomer();
  if (!me) return;

  // Later: load threads from /messages?role=customer
});
