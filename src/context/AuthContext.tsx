"use client";
import { createContext, useContext, useEffect, useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "seeker" | "employer";
  company?: string;
};

export type AuthUser = Omit<StoredUser, "password">;

type SignupData = {
  name: string;
  email: string;
  password: string;
  role: "seeker" | "employer";
  company?: string;
};

export type AuthResult = {
  error: string | null;
  role: "seeker" | "employer" | null;
};

type AuthContextValue = {
  user: AuthUser | null;
  mounted: boolean;
  login(email: string, password: string): AuthResult;
  signup(data: SignupData): AuthResult;
  logout(): void;
};

// ── Context ────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Helpers ────────────────────────────────────────────────────────────────

function getUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem("onpoint_users") ?? "[]");
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem("onpoint_users", JSON.stringify(users));
}

function toAuthUser(u: StoredUser): AuthUser {
  const { password: _pw, ...rest } = u;
  return rest;
}

// ── Provider ──────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const sessionId = localStorage.getItem("onpoint_session");
    if (sessionId) {
      const users = getUsers();
      const found = users.find((u) => u.id === sessionId);
      if (found) setUser(toAuthUser(found));
    }
    setMounted(true);
  }, []);

  function login(email: string, password: string): AuthResult {
    const users = getUsers();
    const found = users.find(
      (u) => u.email === email.toLowerCase().trim() && u.password === password
    );
    if (!found) return { error: "Invalid email or password", role: null };
    localStorage.setItem("onpoint_session", found.id);
    setUser(toAuthUser(found));
    return { error: null, role: found.role };
  }

  function signup(data: SignupData): AuthResult {
    const users = getUsers();
    const email = data.email.toLowerCase().trim();
    if (users.some((u) => u.email === email)) {
      return { error: "An account with this email already exists", role: null };
    }
    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      name: data.name,
      email,
      password: data.password,
      role: data.role,
      ...(data.company ? { company: data.company } : {}),
    };
    saveUsers([...users, newUser]);
    localStorage.setItem("onpoint_session", newUser.id);
    setUser(toAuthUser(newUser));
    return { error: null, role: newUser.role };
  }

  function logout() {
    localStorage.removeItem("onpoint_session");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, mounted, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
