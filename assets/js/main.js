document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('primary-nav');
  const toggle = document.querySelector('.nav-toggle');
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a[href]').forEach(link => {
    if (link.getAttribute('href') === current || (current.startsWith('appliance-repair-') && link.getAttribute('href') === 'areas.html')) link.setAttribute('aria-current','page');
  });
  const closeMenu = () => {
    if (!nav || !toggle) return;
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-label','Open navigation');
  };
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
    nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
    document.addEventListener('click', event => { if (!nav.contains(event.target) && !toggle.contains(event.target)) closeMenu(); });
  }
  const bookingUrl = (window.HONESTPRO_CONFIG?.housecallProBookingUrl || '').trim();
  if (/^https:\/\//i.test(bookingUrl)) {
    document.querySelectorAll('.js-book-online, .hcp-destination').forEach(link => {
      link.href = bookingUrl;
      link.target = '_blank'; link.rel = 'noopener noreferrer';
    });
    const bookingNote = document.getElementById('booking-note');
    if (bookingNote) bookingNote.textContent = "You will complete your booking through Housecall Pro. Available times and confirmation details are provided there.";
  }
  // Analytics-ready event hooks. No requests are sent unless the owner later installs a tag manager.
  // Booking clicks are NOT completed bookings; phone clicks are NOT connected calls.
  window.dataLayer = window.dataLayer || [];
  const sourcePage = current;
  const placementOf = link => {
    if (link.closest('.mobile-bottom-bar')) return 'mobile_bar';
    if (link.closest('.site-header')) return 'header';
    if (link.closest('.hero')) return 'hero';
    if (link.closest('.decision-strip')) return 'choice_strip';
    if (link.closest('.booking-grid')) return 'booking_page';
    if (link.closest('.booking-faq')) return 'booking_faq';
    if (link.closest('.site-footer')) return 'footer';
    return 'page_content';
  };
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    const isBooking = link.matches('.js-book-online, .hcp-destination') || /^https:\/\/book\.housecallpro\.com\//i.test(href);
    if (isBooking) {
      window.dataLayer.push({ event: 'hp_booking_link_click', source_page: sourcePage, placement: placementOf(link) });
    } else if (/^tel:/i.test(href)) {
      window.dataLayer.push({ event: 'hp_phone_link_click', source_page: sourcePage, placement: placementOf(link) });
    }
  });
  // A successful Formspree response sets a short-lived marker before redirect.
  // Count the event only on the actual resulting confirmation page, not on direct visits.
  const successPageToType = {
    'request-submitted.html': 'repair_request',
    'parts-request-received.html': 'parts_request',
    'message-received.html': 'general_inquiry'
  };
  try {
    const raw = sessionStorage.getItem('hp_verified_form');
    if (raw) {
      sessionStorage.removeItem('hp_verified_form');
      const record = JSON.parse(raw);
      if (record && record.page === current && Date.now() - record.at >= 0 && Date.now() - record.at < 180000 && successPageToType[current] === record.type) {
        window.dataLayer.push({ event: 'hp_form_success', form_type: record.type });
      }
    }
  } catch (_) { /* Restricted storage: the form still works. */ }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});
