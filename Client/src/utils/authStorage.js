export const AUTH_KEYS = {
  token: "token",
  role: "role",
  adminToken: "adminToken",
  userToken: "userToken",
};

export const getScopedToken = (role) => {
  if (role === "admin") {
    return localStorage.getItem(AUTH_KEYS.adminToken) || localStorage.getItem(AUTH_KEYS.token);
  }

  if (role === "user") {
    return localStorage.getItem(AUTH_KEYS.userToken) || localStorage.getItem(AUTH_KEYS.token);
  }

  return localStorage.getItem(AUTH_KEYS.token);
};

export const persistLoginSession = ({ role, token, isFirstLogin, userName }) => {
  localStorage.setItem(AUTH_KEYS.token, token);
  localStorage.setItem(AUTH_KEYS.role, role);

  if (role === "admin") {
    localStorage.setItem(AUTH_KEYS.adminToken, token);
  }

  if (role === "user") {
    localStorage.setItem(AUTH_KEYS.userToken, token);

    if (typeof isFirstLogin === "boolean") {
      localStorage.setItem("isFirstLogin", String(isFirstLogin));
    }

    if (userName) {
      localStorage.setItem("userName", userName);
    }
  }
};

export const clearSessionForRole = (role) => {
  if (role === "admin") {
    const adminToken = localStorage.getItem(AUTH_KEYS.adminToken);
    if (localStorage.getItem(AUTH_KEYS.token) === adminToken) {
      localStorage.removeItem(AUTH_KEYS.token);
      localStorage.removeItem(AUTH_KEYS.role);
    }
    localStorage.removeItem(AUTH_KEYS.adminToken);
    return;
  }

  if (role === "user") {
    const userToken = localStorage.getItem(AUTH_KEYS.userToken);
    if (localStorage.getItem(AUTH_KEYS.token) === userToken) {
      localStorage.removeItem(AUTH_KEYS.token);
      localStorage.removeItem(AUTH_KEYS.role);
    }
    localStorage.removeItem(AUTH_KEYS.userToken);
    localStorage.removeItem("isFirstLogin");
    localStorage.removeItem("userName");
    localStorage.removeItem("userProfilePic");
  }
};

export const activateSessionForRole = (role) => {
  const scopedToken = getScopedToken(role);
  if (!scopedToken) return null;

  localStorage.setItem(AUTH_KEYS.token, scopedToken);
  localStorage.setItem(AUTH_KEYS.role, role);

  return scopedToken;
};
