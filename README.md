# HonestPro Appliance Repair — Visual Refresh

This is a substantially redesigned static site based on the supplied HonestPro pages and gold-and-black tree logo.

## Open / deploy

Open `index.html` in a browser, or upload ALL files and directories unchanged to your web host. Every page loads `assets/css/styles.css` and `assets/js/...` using the same relative paths. The mobile layout, menu, links, and forms have been implemented.

## What is live vs. needs your setup

- **Repair requests, parts-only requests, and general inquiries:** Each form uses the Formspree endpoint `https://formspree.io/f/mwvwgejn` found in your existing contact page. Verify in Formspree that the endpoint is active and permitted to accept submissions from your website. Test a form after deployment. The forms do NOT take payments or place parts orders.
- **Housecall Pro booking:** CONNECTED. Booking CTAs lead directly to the official Housecall Pro online booking link: https://book.housecallpro.com/book/HonestPro-Appliance-Repair/21787abdf25347fb9df33c3a46a5ab32?v2=true. The dedicated `book.html` page also links to scheduling and includes a call option. Links open Housecall Pro in a new tab. The booking URL is retained in `assets/js/config.js` and written directly into the booking anchors so they work even if JavaScript is disabled. This is a **link integration**, not an iframe embed or an API integration. Confirm the Housecall Pro booking page is enabled and test booking on your live domain.

- **Housecall Pro reviews:** CONNECTED. The Housecall Pro iframe provided by the owner is included on the homepage and on `reviews.html` and uses a responsive-width container. Reviews are loaded directly from Housecall Pro, not copied into static HTML. Confirm the widget displays properly on the publicly hosted site (some browsers or privacy extensions can block third-party iframes). No ratings, reviews, or review totals have been fabricated.
- **Pricing:** CONFIRMED by owner: $89 diagnostic fee, waived if customer proceeds with repair; flat-rate labor $110–$210 depending on repair complexity, with parts charged separately. Pricing and homepage updated.
- **Warranty:** CONFIRMED by owner: standard 90-day parts-and-labor warranty limited to the specific issue/repair performed. Unrelated future appliance faults are separate and chargeable. Warranty page now explains this with an evaporator fan / ice maker example.
- **Photography:** The homepage currently uses a self-contained local kitchen illustration. When you have genuine HonestPro field photos, replace the illustration with your own photographs for stronger trust.
- **SEO:** Includes unique titles/descriptions, headings, social-preview descriptions, and basic local-business schema. Once you supply the live domain, configure canonical URLs, the sitemap, Open Graph image, Google Search Console and analytics.

## Deployment checklist

1. Review the confirmed $89 diagnostic fee, $110–$210 flat-rate labor, 90-day repair-limited warranty wording, and the 10+ years / factory-trained / insured claims. Verify any special invoice-specific terms before publishing.
2. Test the main repair form, parts form, and inquiry form with your real inbox.
3. Test the Housecall Pro booking buttons on desktop and mobile, and verify available appointment settings inside Housecall Pro. A provider-issued embed can be added later if desired.
4. Open the homepage and `reviews.html` on mobile and desktop and confirm that the Housecall Pro reviews widget actually displays. Test with and without content-blocking extensions.
5. Replace general imagery with photos of your service work (with permission), and optionally add your Google Business Profile review link.
6. Replace all old site files together—do not mix old `assets/` references and new root-file references.

## Assets and licensing

- Logo: user-provided design; no font files used.
- Decorative kitchen SVG: made for this design.
- No external stock photo dependencies are included.

## Parts + inquiry forms (this update)

- The parts-only form collects customer contact information, appliance type, brand, complete model number, optional serial and part number, requested quantity, request category, and description. No parts purchase or payment is made through the form.
- The general inquiry form asks for a question topic and offers an optional previous-service date or invoice reference for warranty and repair follow-up questions.
- Each form tags its submission using `request_type` and `_subject`. **All three forms still use the same existing Formspree endpoint**. This means they go to the same Formspree form/account until you set up distinct endpoint IDs and notification rules.
- Redirect pages are now specific: `request-submitted.html` (repair), `parts-request-received.html` (parts), and `message-received.html` (inquiry), and are only displayed after the submission endpoint reports success. JavaScript errors leave the customer on the form with a call fallback. Without JavaScript, Formspree's default redirect/page will be used.
- **Photo attachments deliberately not activated:** Formspree file uploads require an eligible paid plan (Personal, Professional, or Business). We have not confirmed your plan; model-tag photos can be requested during follow-up instead. The parts form does not imply it accepts files. See https://help.formspree.io/articles/building-your-form/file-uploads.
- **Live test needed:** Verify that `https://formspree.io/f/mwvwgejn` is an active endpoint in your own Formspree account, that notifications reach your inbox, that all three subject labels show up, and that the confirmation pages appear after successful submissions on your actual domain. Do not test with real customer information until ready.
- **Privacy:** Avoid asking for credit card numbers or other payment details in these forms. A privacy policy/notice and retention practices should be confirmed before public launch.

## Booking and conversion optimization (Phase 3)

- Homepage: clear three-way choice between live Housecall Pro appointment selection, calling, and sending a non-booking repair request. All Book Online actions use the owner-supplied Housecall Pro URL.
- Booking page: preparation checklist, confirmed $89 diagnostic / $110–$210 flat-rate labor information, repair-specific 90-day warranty summary, and explanatory FAQs. Actual availability and booking confirmations are controlled by Housecall Pro.
- Repair contact form: more prominent alternative to select an available time via Housecall Pro; submitting the form remains **only a service request**, not a confirmed appointment.
- Lightweight analytics hooks: `assets/js/main.js` queues `hp_booking_link_click` and `hp_phone_link_click` in `window.dataLayer`; successful Formspree submissions produce `hp_form_success` on the correct confirmation page using a short-lived session marker. These hooks do NOT transmit data by themselves; connect a properly configured Google Tag Manager/analytics container to use them. No personal customer data is included in event payloads.
- A booking-link click does **not** prove an appointment was booked. A `tel:` tap does **not** prove that a phone call connected. Completed bookings and calls need measurement from Housecall Pro or a call tracking system, as appropriate.
- Site navigation, pricing, warranty, existing forms, and embedded Housecall Pro reviews are preserved.

### Launch verification: booking

1. On a phone, verify header menu and fixed Call Now / Book Online controls, including bottom safe-area spacing.
2. Follow at least one homepage booking CTA and the CTA on `book.html` to Housecall Pro; confirm the correct business, service area, and available slots. Do not create a fake customer appointment.
3. Verify `contact.html` form does not promise a confirmed booking. Submit a test request through your Formspree dashboard after deployment.
4. If adding analytics later, configure events as described above and verify them in GTM Preview/GA4 DebugView. Do not count click events as confirmed appointments.
5. Confirm FAQs and summary pricing/warranty copy still match current HonestPro policies.


## Phase 4: Local SEO and expanded service area (Nov 12, 2026)

- **Confirmed official domain:** `https://www.gethonestpro.com/`. The non-`www` version currently redirects to this domain. All public HTML pages include absolute canonical links and Open Graph URLs for this hostname.
- **Confirmed areas:** Buda, Kyle, Austin, San Marcos and Lockhart, plus surrounding communities subject to address confirmation. Sitewide coverage text, homepage links, utility strip and service-area page were updated.
- **New useful landing pages:** `appliance-repair-buda.html`, `appliance-repair-kyle.html`, `appliance-repair-austin.html`, `appliance-repair-san-marcos.html`, and `appliance-repair-lockhart.html`. Each contains different practical symptom guidance and a clear route to booking or calling, not fabricated local jobs or fake customer testimonials. Add genuine local case studies or real photos later when available.
- **Repair Tips preservation:** Added `repair-tips.html` with the owner-provided Soro embed. The existing live site has a Repair Tips page; this prevents it from being lost when deploying the redesigned package. Verify the Soro widget still loads and displays the right content. A third-party script can affect rendering and search indexing.
- **Technical SEO:** Added `sitemap.xml`, updated `robots.txt`, canonical tags, and `Organization` plus `WebSite` structured data. City pages also provide `Service` schema with location names and provider reference. No fictitious address, opening hours, review rating, Google Business Profile, or multiple storefronts were added. Since no physical business address was provided, we intentionally did not claim an address in LocalBusiness structured data; review/address details can be updated after business-profile verification.
- **Confirmation pages:** Three success pages are `noindex,follow` and excluded from the sitemap. Unlike robots disallowing these pages, they remain crawlable so search engines can see their noindex directives.
- **Google Search Console:** After uploading the complete site, create/verify a Search Console property covering `gethonestpro.com` (domain property preferred where supported). Submit `https://www.gethonestpro.com/sitemap.xml`, inspect the homepage, city hub, and each city page, and monitor indexing and performance. This package does **not** connect Search Console, Analytics, or a Google Business Profile automatically.
- **Deployment:** Back up the current live site. Upload the full zip contents to the web root, without an extra nested folder. Ensure `https://www.gethonestpro.com/repair-tips.html` works and old URLs still resolve. Confirm `https://gethonestpro.com/` redirects to the canonical `www` version with HTTPS. Test forms (Formspree), bookings (Housecall Pro) and review iframe (Housecall Pro) after deployment.
- **Quality guardrails:** Do not add city-specific claims such as actual storefront addresses, technician locations, average response time, or completed-job details unless verified. Local search rankings are not guaranteed simply by publishing new city pages. Avoid duplicating city page text at scale; Google warns against doorway pages created only to capture slight geographic query variants.
