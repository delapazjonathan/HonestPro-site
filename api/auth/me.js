export default async function handler(req, res) {
  const token = (req.headers.cookie || "")
    .split(";")
    .map(s => s.trim())
    .find(s => s.startsWith("hp_token="))
    ?.split("=")[1];

  if (!token) return res.status(401).json({ error: "Not logged in" });

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

  const r = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await r.json();
  if (!r.ok) return res.status(r.status).json({ error: "Invalid session" });

  return res.status(200).json({
    user: { id: data.id, email: data.email },
  });
}
