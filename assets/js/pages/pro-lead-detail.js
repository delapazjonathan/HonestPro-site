document.addEventListener("DOMContentLoaded", async () => {
  const me = await window.HPGuards.requirePro();
  if (!me) return;

  // Keep using your existing pro-lead-detail.js UI logic after this point.
});


// Simple state handler for the Pro Lead Detail page

(function () {
  var leadHeader = document.querySelector('.lead-header');
  if (!leadHeader) return;

  var leadId = leadHeader.getAttribute('data-lead-id') || 'UNKNOWN';
  var statusTextEl = document.querySelector('[data-lead-status-text]');
  var statusPillEl = document.querySelector('[data-lead-status-pill]');
  var contactBlock = document.querySelector('[data-contact-block]');

  function setStatus(status) {
    // status: 'new' | 'active' | 'closed-won' | 'closed-lost'
    if (!statusTextEl || !statusPillEl || !leadHeader) return;

    leadHeader.setAttribute('data-lead-status', status);

    // Reset pill classes
    statusPillEl.classList.remove('status-new', 'status-active', 'status-closed');

    if (status === 'new') {
      statusPillEl.classList.add('status-new');
      statusPillEl.textContent = 'New lead';
      statusTextEl.textContent = 'New · Not contacted';
    } else if (status === 'active') {
      statusPillEl.classList.add('status-active');
      statusPillEl.textContent = 'In progress';
      statusTextEl.textContent = 'Active · Contacted';
    } else {
      statusPillEl.classList.add('status-closed');
      statusPillEl.textContent = status === 'closed-won' ? 'Won' : 'Closed';
      statusTextEl.textContent =
        status === 'closed-won'
          ? 'Closed · You won this job'
          : 'Closed · Not a fit';
    }

    console.log('[HonestPro] Lead', leadId, 'status set to:', status);
  }

  function revealContactInfo() {
    if (!contactBlock) return;

    var rows = contactBlock.querySelectorAll('.contact-row .meta-value');
    if (rows.length >= 2) {
      // Fake data for now – replace with real values when wired to backend
      rows[0].textContent = 'J. Martinez';
      rows[1].textContent = '(555) 123-4567 · customer@example.com';
    }

    if (statusTextEl) {
      statusTextEl.textContent = 'Active · Contacted';
    }
    if (statusPillEl) {
      statusPillEl.classList.remove('status-new', 'status-closed');
      statusPillEl.classList.add('status-active');
      statusPillEl.textContent = 'In progress';
    }

    console.log('[HonestPro] Lead', leadId, 'contact info revealed');
  }

  document.querySelectorAll('[data-action]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var action = this.getAttribute('data-action');

      if (action === 'contact') {
        revealContactInfo();
        setStatus('active');
      } else if (action === 'mark-won') {
        setStatus('closed-won');
      } else if (action === 'mark-lost') {
        setStatus('closed-lost');
      }

      console.log('[HonestPro] Action:', action, 'on lead', leadId);
    });
  });
})();
