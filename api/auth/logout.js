export default async function handler(req, res) {
  // Clear cookie
  res.setHeader("Set-Cookie", "hp_token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0");
  return res.status(200).json({ ok: true });
}
