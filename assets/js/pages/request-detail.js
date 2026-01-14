// Tabs for the request detail page
document
  .querySelectorAll('[data-tab-group="request-detail"] .hp-tab')
  .forEach(function (tab) {
    tab.addEventListener('click', function () {
      var tabName = this.getAttribute('data-tab');

      // Update tab buttons
      document
        .querySelectorAll('[data-tab-group="request-detail"] .hp-tab')
        .forEach(function (btn) {
          btn.classList.toggle('hp-tab--active', btn === tab);
        });

      // Update panels
      document
        .querySelectorAll('.hp-tab-panel')
        .forEach(function (panel) {
          var isActive = panel.getAttribute('data-panel') === tabName;
          panel.classList.toggle('hp-tab-panel--active', isActive);
        });
    });
  });

// Pro card selection highlighting
document.querySelectorAll('.hp-pro-card').forEach(function (card) {
  card.addEventListener('click', function (e) {
    // Ignore clicks on the buttons themselves
    if (e.target.matches('button')) return;

    document.querySelectorAll('.hp-pro-card').forEach(function (c) {
      c.classList.remove('hp-pro-card--selected');
    });

    this.classList.add('hp-pro-card--selected');

    var proId = this.getAttribute('data-pro-id');
    var page = document.querySelector('.hp-page--request-detail');
    if (page) {
      page.setAttribute('data-selected-pro-id', proId);
    }
  });
});

// Action button stubs (hire / decline / message / view-profile)
document.querySelectorAll('[data-action]').forEach(function (btn) {
  btn.addEventListener('click', function (e) {
    e.stopPropagation();

    var action = this.getAttribute('data-action');
    var proId = this.getAttribute('data-pro-id');
    var page = document.querySelector('.hp-page--request-detail');
    var requestId = page ? page.getAttribute('data-request-id') : null;

    console.log('[HonestPro] Action:', action, 'Pro:', proId, 'Request:', requestId);

    // Later:
    // if (action === 'hire') { ... }
    // if (action === 'decline') { ... }
    // if (action === 'message') { ... }
    // if (action === 'view-profile') { ... }
  });
});
