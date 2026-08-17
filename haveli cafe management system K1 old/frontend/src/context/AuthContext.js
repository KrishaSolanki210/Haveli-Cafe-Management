import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import {
  fetchProfile,
  loginAdmin,
  loginStaff,
  loginUser,
  registerAdmin,
  registerStaff,
  registerUser
} from "../services/authService";

const AuthContext = createContext(null);
const TOKEN_KEY = "haveli_token";
const USER_KEY = "haveli_user";
const allowedRolesByMode = {
  default: ["customer", "staff", "admin"],
  admin: ["admin"],
  staff: ["staff", "admin"]
};

function getStoredUser() {
  const savedUser = localStorage.getItem(USER_KEY);

  if (!savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser);
  } catch (error) {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    const syncProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetchProfile();
        setUser(response.data.data);
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.data));
      } catch (error) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    syncProfile();
  }, [token]);

  const persistSession = (authData) => {
    localStorage.setItem(TOKEN_KEY, authData.token);
    localStorage.setItem(USER_KEY, JSON.stringify(authData.user));
    setToken(authData.token);
    setUser(authData.user);
  };

  const assertRoleForMode = (mode, role) => {
    const allowedRoles = allowedRolesByMode[mode] || allowedRolesByMode.default;
    if (!allowedRoles.includes(role)) {
      throw new Error(`This account is not allowed for ${mode} portal login`);
    }
  };

  const login = async (payload, mode = "default") => {
    const loginRequest =
      mode === "admin" ? loginAdmin : mode === "staff" ? loginStaff : loginUser;

    let response;
    try {
      response = await loginRequest(payload);
    } catch (error) {
      const routeMissing = error?.response?.status === 404;
      if (routeMissing && mode !== "default") {
        response = await loginUser(payload);
      } else {
        throw error;
      }
    }

    assertRoleForMode(mode, response.data.data.user.role);
    persistSession(response.data.data);
    return response.data;
  };

  const register = async (payload, mode = "default") => {
    const registerRequest =
      mode === "admin" ? registerAdmin : mode === "staff" ? registerStaff : registerUser;
    const response = await registerRequest(payload);
    assertRoleForMode(mode, response.data.data.user.role);
    persistSession(response.data.data);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({
    token,
    user,
    loading,
    isAuthenticated: Boolean(token),
    login,
    register,
    logout
  }), [token, user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
