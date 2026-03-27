"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

// ── Types ──────────────────────────────────────────────────────────────────

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "seeker" | "employer";
  company?: string;
  avatarUrl?: string;
};

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
  login(email: string, password: string): Promise<AuthResult>;
  signup(data: SignupData): Promise<AuthResult>;
  logout(): Promise<void>;
  updateAvatar(url: string): void;
};

// ── Context ────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ───────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [mounted, setMounted] = useState(false);

  async function loadProfile(userId: string, email: string): Promise<AuthUser | null> {
    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("name, role, company, avatar_url")
      .eq("id", userId)
      .single();
    if (!data) return null;
    return {
      id: userId,
      name: data.name,
      email,
      role: data.role as "seeker" | "employer",
      company: data.company ?? undefined,
      avatarUrl: data.avatar_url ?? undefined,
    };
  }

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;

    async function init() {
      try {
        const supabase = createClient();

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) console.error("[AuthContext] getSession error:", sessionError);

        if (session?.user) {
          const profile = await loadProfile(session.user.id, session.user.email!);
          setUser(profile);
        }

        const { data } = supabase.auth.onAuthStateChange(
          async (event, sess) => {
            if (sess?.user) {
              const profile = await loadProfile(sess.user.id, sess.user.email!);
              setUser(profile);
            } else {
              setUser(null);
            }
          }
        );
        subscription = data.subscription;
      } catch (err) {
        console.error("[AuthContext] init failed:", err);
      } finally {
        setMounted(true);
      }
    }

    init();

    return () => subscription?.unsubscribe();
  }, []);

  async function login(email: string, password: string): Promise<AuthResult> {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { error: error.message, role: null };

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    return { error: null, role: (profile?.role as "seeker" | "employer") ?? null };
  }

  async function signup(data: SignupData): Promise<AuthResult> {
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          name: data.name,
          role: data.role,
          company: data.company,
        },
      },
    });
    if (error) return { error: error.message, role: null };

    // Profile row is created automatically by the on_auth_user_created trigger

    // Return role: null → caller redirects to /verify-email
    return { error: null, role: null };
  }

  function updateAvatar(url: string): void {
    setUser((u) => (u ? { ...u, avatarUrl: url } : null));
  }

  async function logout(): Promise<void> {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, mounted, login, signup, logout, updateAvatar }}>
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
