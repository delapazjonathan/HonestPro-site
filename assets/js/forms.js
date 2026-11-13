/* Contact, parts, and inquiry forms. Uses the owner's existing Formspree endpoint. */
document.addEventListener('DOMContentLoaded', () => {
  const allowedSuccessPages = new Set([
    'request-submitted.html',
    'parts-request-received.html',
    'message-received.html'
  ]);

  document.querySelectorAll('form[data-ajax-form]').forEach(form => {
    const submit = form.querySelector('[type="submit"]');
    const feedback = form.querySelector('.form-feedback');
    if (!submit || !feedback) return;
    let sending = false;

    const showError = message => {
      feedback.textContent = message;
      feedback.classList.add('form-error');
      feedback.hidden = false;
      feedback.scrollIntoView({block: 'nearest', behavior: 'smooth'});
    };

    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (sending || !form.reportValidity()) return;
      if (form.querySelector('input[name="_gotcha"]')?.value) return;

      const submitHtml = submit.innerHTML;
      sending = true;
      submit.disabled = true;
      submit.setAttribute('aria-busy', 'true');
      submit.textContent = 'Sending your request...';
      feedback.hidden = true;
      feedback.classList.remove('form-error');

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: {Accept: 'application/json'}
        });

        if (!response.ok) {
          let message = 'We could not send your request. Please try again, or call (512) 663-2860.';
          if (response.status === 429) {
            message = 'Too many requests have been sent recently. Please try again later or call (512) 663-2860.';
          }
          throw new Error(message);
        }

        const page = form.dataset.successPage || 'request-submitted.html';
        const destination = allowedSuccessPages.has(page) ? page : 'request-submitted.html';
        const typeByPage = {
          'request-submitted.html': 'repair_request',
          'parts-request-received.html': 'parts_request',
          'message-received.html': 'general_inquiry'
        };
        const type = typeByPage[destination];
        try {
          sessionStorage.setItem('hp_verified_form', JSON.stringify({page: destination, type, at: Date.now()}));
        } catch (_) {
          // If storage is blocked, preserve the submission experience.
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({event: 'hp_form_success', form_type: type});
        }
        window.location.assign(destination);
      } catch (error) {
        console.error('HonestPro form submission error:', error);
        showError(error.message?.startsWith('We could not') || error.message?.startsWith('Too many')
          ? error.message
          : 'The request could not be sent. Please check your connection and try again, or call (512) 663-2860.');
      } finally {
        sending = false;
        submit.disabled = false;
        submit.removeAttribute('aria-busy');
        submit.innerHTML = submitHtml;
      }
    });
  });
});
