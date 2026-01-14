// assets/js/guards.js
(function () {
  /**
   * Where to send people if they're not logged in or logged in as wrong role
   */
  const ROUTES = {
    login: "/pages/login.html",
    customerHome: "/dashboard/customer-dashboard.html",
    proHome: "/dashboard/pro-dashboard.html",
  };

  async function getMeSafe() {
    try {
      const data = await window.HPAuth.me(); // GET /me
      return { ok: true, data };
    } catch (err) {
      // 401/403 = not logged in / blocked
      return { ok: false, err };
    }
  }

  function redirect(to) {
    window.location.href = to;
  }

  /**
   * Require any logged-in user (customer OR pro)
   */
  async function requireAuth() {
    const result = await getMeSafe();
    if (!result.ok) {
      redirect(ROUTES.login);
      return null;
    }
    return result.data;
  }

  /**
   * Require a CUSTOMER account
   */
  async function requireCustomer() {
    const me = await requireAuth();
    if (!me) return null;

    const role = me?.user?.role;
    if (role !== "customer") {
      redirect(ROUTES.proHome);
      return null;
    }

    return me;
  }

  /**
   * Require a PRO account
   */
  async function requirePro() {
    const me = await requireAuth();
    if (!me) return null;

    const role = me?.user?.role;
    if (role !== "pro") {
      redirect(ROUTES.customerHome);
      return null;
    }

    return me;
  }

  window.HPGuards = {
    requireAuth,
    requireCustomer,
    requirePro,
  };
})();
