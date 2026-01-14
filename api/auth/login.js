export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

  const r = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await r.json();
  if (!r.ok) return res.status(r.status).json({ error: data?.error_description || "Login failed" });

  // Store access token in an HttpOnly cookie (simple MVP)
  res.setHeader(
    "Set-Cookie",
    `hp_token=${data.access_token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${data.expires_in}`
  );

  return res.status(200).json({ ok: true });
}
