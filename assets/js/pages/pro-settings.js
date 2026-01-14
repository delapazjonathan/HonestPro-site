document.addEventListener("DOMContentLoaded", async () => {
  const me = await window.HPGuards.requirePro();
  if (!me) return;

  // Later: load/save pro profile via /pros/me
});
