document.addEventListener("DOMContentLoaded", async () => {
  const { data } = await window.HPSupabase.auth.getUser();
  const user = data?.user;

  if (!user) {
    window.location.href = "/pages/login.html";
    return;
  }

  const role = user.user_metadata?.role;
  if (role !== "pro") {
    window.location.href = "/pages/login.html";
    return;
  }

  // Continue with existing dashboard logic...
});

async function ensureWallet(proId) {
  // Try to fetch wallet
  const { data: wallet, error } = await window.HPSupabase
    .from("pro_wallets")
    .select("pro_id, balance, reserved")
    .eq("pro_id", proId)
    .maybeSingle();

  if (error) throw error;

  // If missing, create it (0 balance). This is allowed by the insert policy.
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

  // Example: show balance somewhere
  const balanceEl = document.querySelector("[data-pro-balance]");
  if (balanceEl) balanceEl.textContent = String(wallet.balance);

  // Ledger (history)
  const { data: ledger, error } = await window.HPSupabase
    .from("credit_ledger")
    .select("delta, reason, note, created_at")
    .eq("pro_id", proId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) throw error;

  // Render ledger if you have a container
  const ledgerEl = document.querySelector("[data-credit-ledger]");
  if (ledgerEl) {
    ledgerEl.innerHTML = (ledger || []).map(row => {
      const sign = row.delta > 0 ? "+" : "";
      return `<div class="ledger-item">
        <div><strong>${sign}${row.delta}</strong> credits</div>
        <div>${row.reason}${row.note ? " — " + row.note : ""}</div>
        <div class="muted">${new Date(row.created_at).toLocaleString()}</div>
      </div>`;
    }).join("");
  }
}

await loadCreditsUI(user.id);



// Pro Dashboard: simple client-side filtering for leads table

(function () {
  var filterButtons = document.querySelectorAll('.filter-pill');
  var rows = document.querySelectorAll('.leads-row-body');

  if (!filterButtons.length || !rows.length) return;

  function applyFilter(filter) {
    rows.forEach(function (row) {
      var status = row.getAttribute('data-lead-status'); // 'new' | 'active' | 'closed'
      if (filter === 'all' || status === filter) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = this.getAttribute('data-filter');

      // Toggle active pill class
      filterButtons.forEach(function (b) {
        b.classList.toggle('filter-pill-active', b === btn);
      });

      applyFilter(filter);
      console.log('[HonestPro] Pro dashboard filter:', filter);
    });
  });

  // Default: show all
  applyFilter('all');
})();
