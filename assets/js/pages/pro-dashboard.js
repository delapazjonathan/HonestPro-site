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
