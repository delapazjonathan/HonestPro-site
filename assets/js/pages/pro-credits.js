document.addEventListener("DOMContentLoaded", async () => {
  const me = await window.HPGuards.requirePro();
  if (!me) return;

  // Later: load credit balance + history via /credits endpoints
});
