// assets/js/pro-dashboard.js
document.addEventListener("DOMContentLoaded", async () => {
  // HARD GUARD: must have Supabase
  if (!window.HPSupabase) {
    console.error("[HonestPro] HPSupabase missing on pro dashboard.");
    window.location.href = "/pages/login.html";
    return;
  }

  // HARD GUARD: must be logged in
  const { data, error } = await window.HPSupabase.auth.getUser();
  const user = data?.user;

  if (error || !user) {
    window.location.href = "/pages/login.html";
    return;
  }

  // HARD GUARD: must be pro
  const role = user.user_metadata?.role;
  if (role !== "pro") {
    window.location.href = "/pages/login.html";
    return;
  }

  try {
    await loadCreditsUI(user.id);
  } catch (e) {
    console.error("[HonestPro] Credits UI error:", e);
  }

  // Lead table filtering
  initLeadFiltering();
});

async function ensureWallet(proId) {
  const { data: wallet, error } = await window.HPSupabase
    .from("pro_wallets")
    .select("pro_id, balance, reserved")
    .eq("pro_id", proId)
    .maybeSingle();

  if (error) throw error;

  if (!wallet) {
    const { data: created, error: insErr } = await window.HPSupabase
      .from("pro_wallets")
      .insert([{ pro_id: proId, balance: 0, reserved: 0 }])
      .select("pro_id, balance, reserved")
      .single();

    if (insErr) throw insErr;
    return created;
  }

  return wallet;
}

async function loadCreditsUI(proId) {
  const wallet = await ensureWallet(proId);

  const balanceEl = document.querySelector("[data-pro-balance]");
  if (balanceEl) balanceEl.textContent = String(wallet.balance);

  const { data: ledger, error } = await window.HPSupabase
    .from("credit_ledger")
    .select("delta, reason, note, created_at")
    .eq("pro_id", proId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) throw error;

  const ledgerEl = document.querySelector("[data-credit-ledger]");
  if (ledgerEl) {
    ledgerEl.innerHTML = (ledger || [])
      .map((row) => {
        const sign = row.delta > 0 ? "+" : "";
        return `<div class="ledger-item">
          <div><strong>${sign}${row.delta}</strong> credits</div>
          <div>${row.reason}${row.note ? " — " + row.note : ""}</div>
          <div class="muted">${new Date(row.created_at).toLocaleString()}</div>
        </div>`;
      })
      .join("");
  }
}

function initLeadFiltering() {
  const filterButtons = document.querySelectorAll(".filter-pill");
  const rows = document.querySelectorAll(".leads-row-body");

  if (!filterButtons.length || !rows.length) return;

  function applyFilter(filter) {
    rows.forEach((row) => {
      const status = row.getAttribute("data-lead-status");
      row.style.display = filter === "all" || status === filter ? "" : "none";
    });
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const filter = this.getAttribute("data-filter");
      filterButtons.forEach((b) =>
        b.classList.toggle("filter-pill-active", b === btn)
      );
      applyFilter(filter);
    });
  });

  applyFilter("all");
}
