// Guard: only customers can view this page
document.addEventListener("DOMContentLoaded", async () => {
  const me = await window.HPGuards.requireCustomer();
  if (!me) return; // redirected

  // Optional: personalize the page with user info
  // console.log("Logged in customer:", me.user.email);

  // Continue with existing dashboard logic here...
});


// Customer Dashboard: simple client-side filtering for requests table

(function () {
  var filterButtons = document.querySelectorAll('[data-request-filter]');
  var rows = document.querySelectorAll('.leads-row-body[data-request-status]');

  if (!filterButtons.length || !rows.length) return;

  function applyFilter(filter) {
    rows.forEach(function (row) {
      var status = row.getAttribute('data-request-status'); // 'open' | 'in-progress' | 'closed'
      if (filter === 'all' || status === filter) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = this.getAttribute('data-request-filter');

      filterButtons.forEach(function (b) {
        b.classList.toggle('filter-pill-active', b === btn);
      });

      applyFilter(filter);
      console.log('[HonestPro] Customer dashboard filter:', filter);
    });
  });

  // Default state: show all
  applyFilter('all');
})();
