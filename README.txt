HonestPro Clean Site Package

What this folder contains
- A cleaned public-facing appliance repair site
- Old marketplace/auth files moved into archive/old-marketplace
- One shared stylesheet and two small scripts

Main files
- index.html
- services.html
- about.html
- contact.html
- request-submitted.html
- assets/css/styles.css
- assets/js/main.js
- assets/js/contact-form.js

How to connect the form
1. Open contact.html
2. Find: <form id="service-request-form" data-endpoint="">
3. Paste your real endpoint between the quotes.

Example endpoints
- Formspree endpoint
- A webhook endpoint
- A custom backend route

What happens if you leave it blank
- The form still validates on the front end
- The visitor is sent to request-submitted.html
- Their latest request is stored in sessionStorage for preview only
- No real submission is sent anywhere until you add an endpoint

Suggested next edits before launch
- Add your real phone number
- Add your email address
- Add service hours
- Add any service-call pricing language
- Add real reviews when available
- Add images to assets/images if desired

Recommended deployment structure
Upload the honestpro-clean folder contents exactly as-is to your hosting provider.
