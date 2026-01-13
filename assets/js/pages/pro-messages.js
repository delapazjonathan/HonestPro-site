document.addEventListener("DOMContentLoaded", async () => {
  const me = await window.HPGuards.requirePro();
  if (!me) return;

  // Later: load threads from /messages?role=pro
});
