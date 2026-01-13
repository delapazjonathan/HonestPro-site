// assets/js/auth.js
(function () {
  async function login(email, password) {
    return window.HPApi.post("/auth/login", { email, password });
  }

  async function logout() {
    return window.HPApi.post("/auth/logout", {});
  }

  async function me() {
    return window.HPApi.get("/me");
  }

  window.HPAuth = { login, logout, me };
})();
