"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

type Props = {
  type: "per_listing" | "pro";
  label: string;
  className: string;
};

export default function CheckoutButton({ type, label, className }: Props) {
  const { user, mounted } = useAuth();
  const [loading, setLoading] = useState(false);

  // Not mounted or not a logged-in employer → link to signup
  if (!mounted || !user || user.role !== "employer") {
    return (
      <a href="/signup?role=employer" className={className}>
        {label}
      </a>
    );
  }

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
      else setLoading(false);
    } catch {
      setLoading(false);
    }
  }

  return (
    <button onClick={handleClick} disabled={loading} className={className}>
      {loading ? "Redirecting…" : label}
    </button>
  );
}
