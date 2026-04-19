import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

const USERS_KEY = "travelbite-users";
const SESSION_KEY = "travelbite-session";
const MODE_KEY = "travelbite-mode";

const UserContext = createContext({
  mode: "balanced",
  setMode: () => {},
  currentUser: null,
  isAuthenticated: false,
  login: async () => ({ ok: false, message: "Unavailable" }),
  signup: async () => ({ ok: false, message: "Unavailable" }),
  logout: () => {}
});

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage failures in restricted environments.
  }
}

export function UserProvider({ children }) {
  const [mode, setModeState] = useState(() => {
    try {
      return localStorage.getItem(MODE_KEY) || "balanced";
    } catch {
      return "balanced";
    }
  });

  const [users, setUsers] = useState(() => readStorage(USERS_KEY, []));
  const [currentUser, setCurrentUser] = useState(() => readStorage(SESSION_KEY, null));

  const setMode = useCallback((nextMode) => {
    setModeState(nextMode);
    try {
      localStorage.setItem(MODE_KEY, nextMode);
    } catch {
      // Ignore storage failures in restricted environments.
    }
  }, []);

  const signup = useCallback(
    async ({ name, email, password }) => {
      const normalizedEmail = (email || "").trim().toLowerCase();
      const normalizedName = (name || "").trim();

      if (!normalizedName || !normalizedEmail || !password) {
        return { ok: false, message: "Please fill all fields." };
      }

      if (password.length < 6) {
        return { ok: false, message: "Password should be at least 6 characters." };
      }

      if (users.some((user) => user.email === normalizedEmail)) {
        return { ok: false, message: "Account already exists for this email." };
      }

      const createdUser = {
        id: `user-${Date.now()}`,
        name: normalizedName,
        email: normalizedEmail,
        password
      };

      const nextUsers = [...users, createdUser];
      setUsers(nextUsers);
      writeStorage(USERS_KEY, nextUsers);

      const sessionUser = { id: createdUser.id, name: createdUser.name, email: createdUser.email };
      setCurrentUser(sessionUser);
      writeStorage(SESSION_KEY, sessionUser);

      return { ok: true, message: "Signup successful." };
    },
    [users]
  );

  const login = useCallback(
    async ({ email, password }) => {
      const normalizedEmail = (email || "").trim().toLowerCase();
      const account = users.find((user) => user.email === normalizedEmail && user.password === password);

      if (!account) {
        return { ok: false, message: "Invalid email or password." };
      }

      const sessionUser = { id: account.id, name: account.name, email: account.email };
      setCurrentUser(sessionUser);
      writeStorage(SESSION_KEY, sessionUser);
      return { ok: true, message: "Login successful." };
    },
    [users]
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      // Ignore storage failures in restricted environments.
    }
  }, []);

  const value = useMemo(
    () => ({
      mode,
      setMode,
      users,
      currentUser,
      isAuthenticated: Boolean(currentUser),
      login,
      signup,
      logout
    }),
    [mode, setMode, users, currentUser, login, signup, logout]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUserMode() {
  return useContext(UserContext);
}
