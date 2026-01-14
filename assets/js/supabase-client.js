// assets/js/supabase-client.js
(function () {
  // Put these in your Vercel env as PUBLIC values, or hardcode temporarily.
  // For static sites, these are safe to be public *because RLS protects your data*.
  const SUPABASE_URL = window.HP_SUPABASE_URL;
  const SUPABASE_ANON_KEY = window.HP_SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn("[HonestPro] Missing Supabase env vars (HP_SUPABASE_URL / HP_SUPABASE_ANON_KEY).");
    return;
  }

  // Uses global `supabase` from CDN
  window.HPSupabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true }
  });
})();
