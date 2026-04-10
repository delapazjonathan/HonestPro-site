// Pro-only access guard
document.addEventListener("DOMContentLoaded", async () => {
  // Supabase must exist
  if (!window.HPSupabase) {
    console.warn("[HonestPro] Supabase missing, redirecting to login");
    window.location.href = "/pages/login.html";
    return;
  }

  try {
    const { data } = await window.HPSupabase.auth.getUser();
    const user = data?.user;

    // Must be logged in
    if (!user) {
      window.location.href = "/pages/login.html";
      return;
    }

    // Must be a pro
    const role = user.user_metadata?.role;
    if (role !== "pro") {
      window.location.href = "/pages/login.html";
      return;
    }

    // Guard passed
    document.body.classList.add("hp-auth-ready");
    console.log("[HonestPro] Pro guard passed");
  } catch (err) {
    console.error("[HonestPro] Pro guard error:", err);
    window.location.href = "/pages/login.html";
  }
});
