// assets/js/pages/customer-dashboard.js
document.addEventListener("DOMContentLoaded", async () => {
  // Keep your existing guard if you want; for Supabase auth, we’ll check user directly.
  if (!window.HPSupabase) return;

  const { data: authData } = await window.HPSupabase.auth.getUser();
  const user = authData?.user;

  if (!user) {
    window.location.href = "/pages/login.html";
    return;
  }

  // Find your table container (adjust selector to match your dashboard HTML)
  const table = document.querySelector(".leads-table");
  if (!table) return;

  // Where to insert rows: after the header row
  const headerRow = table.querySelector(".leads-row-header");

  // Fetch requests
  const { data: rows, error } = await window.HPSupabase
    .from("customer_requests")
    .select("id, project_title, service_type, city, zip, status, created_at")
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  // Remove old body rows (if any)
  table.querySelectorAll(".leads-row-body").forEach((n) => n.remove());

  // Render
  rows.forEach((r) => {
    const a = document.createElement("a");
    a.className = "leads-row leads-row-body";
    a.href = `/pages/customer-request-detail.html?rid=${encodeURIComponent(r.id)}`;
    a.setAttribute("data-request-status", r.status);

    const created = new Date(r.created_at).toLocaleDateString();

    a.innerHTML = `
      <div class="leads-cell">
        <div>${escapeHtml(r.project_title || "(Untitled request)")}</div>
        <div class="leads-meta">${escapeHtml((r.service_type || "Service").toUpperCase())} • ${escapeHtml(r.city || "")}, ${escapeHtml(r.zip || "")}</div>
      </div>
      <div class="leads-cell">
        <span class="status-pill ${statusClass(r.status)}">${statusLabel(r.status)}</span>
      </div>
      <div class="leads-cell">
        <div>${created}</div>
        <div class="leads-meta">Request ID: ${escapeHtml(r.id.slice(0, 8))}…</div>
      </div>
    `;

    if (headerRow) headerRow.insertAdjacentElement("afterend", a);
    else table.appendChild(a);
  });

  function statusLabel(s) {
    if (s === "in-progress") return "In progress";
    if (s === "closed") return "Closed";
    return "Open";
  }

  function statusClass(s) {
    if (s === "in-progress") return "status-active";
    if (s === "closed") return "status-closed";
    return "status-new";
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
});
