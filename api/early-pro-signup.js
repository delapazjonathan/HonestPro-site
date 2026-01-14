export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }

  try {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({ error: "SERVER_MISSING_ENV" });
    }

    const body = req.body || {};
    const email = (body.email || "").trim().toLowerCase();
    if (!email) return res.status(400).json({ error: "EMAIL_REQUIRED" });

    // Minimal sanitization (keep it simple for now)
    const payload = {
      business_name: (body.business_name || "").trim() || null,
      contact_name: (body.contact_name || "").trim() || null,
      email,
      phone: (body.phone || "").trim() || null,
      trade: (body.trade || "").trim() || null,
      base_zip: (body.base_zip || "").trim() || null,
      radius_miles: body.radius_miles ? Number(body.radius_miles) : null,
      website: (body.website || "").trim() || null,
      notes: (body.notes || "").trim() || null,
    };

    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/early_pro_signups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify(payload),
    });

    if (!insertRes.ok) {
      const txt = await insertRes.text();
      return res.status(500).json({ error: "SUPABASE_INSERT_FAILED", detail: txt });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: "SERVER_ERROR", detail: err?.message || String(err) });
  }
}
