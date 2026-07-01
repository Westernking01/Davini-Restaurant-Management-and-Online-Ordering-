"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, AlertCircle, ChefHat } from "lucide-react";
import { adminLoginAction } from "@/actions/auth-actions";
import { BrandLogo } from "@/components/ui/brand-logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await adminLoginAction(email, password);
      if (!res.success) {
        setError(res.errorMessage || "Login verification failed.");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("davinis_admin_logged_in", "true");
      if (res.role) {
        localStorage.setItem("davinis_admin_role", res.role);
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("A network error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: "#F9F7F4", fontFamily: "'Inter', sans-serif" }}
    >
      {/* LEFT — Brand panel */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 xl:p-16 relative overflow-hidden"
        style={{ backgroundColor: "#14110F" }}
      >
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(201,169,110,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(201,169,110,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Top brand */}
        <div className="relative z-10 flex items-start">
          <BrandLogo variant="gold" layout="vertical" iconSize={36} />
        </div>

        {/* Central message */}
        <div className="relative z-10 space-y-8 my-auto py-12">
          <div>
            <span
              className="inline-block text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded op-mono mb-4"
              style={{ backgroundColor: "rgba(201,169,110,0.12)", color: "#C9A96E", border: "1px solid rgba(201,169,110,0.2)" }}
            >
              Command Center v4.8
            </span>
            <h1
              className="davinis-wordmark text-[40px] xl:text-[48px] leading-[1.1]"
              style={{ color: "#F5EDD9" }}
            >
              Every order.
              <br />
              Every ticket.
              <br />
              Every shift.
            </h1>
            <p
              className="text-[14px] xl:text-[15px] leading-relaxed mt-4 max-w-sm"
              style={{ color: "#A09488" }}
            >
              Real-time kitchen display, live order management, inventory tracking, and financial reporting.
            </p>
          </div>

          {/* Capability bullets */}
          <ul className="space-y-3">
            {[
              "Sub-100ms order queue sync",
              "RBAC for Owner, Manager, Kitchen, Delivery",
              "Paystack-encrypted settlement ledger",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-[13px]" style={{ color: "#A09488" }}>
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: "#C9A96E" }}
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom footer */}
        <div
          className="relative z-10 flex items-center justify-between text-[11px] pt-6"
          style={{ borderTop: "1px solid #2A2420", color: "#5C4F44" }}
        >
          <span>Authorized Personnel Only</span>
          <span className="op-mono">TID: #DFB-ADM-01</span>
        </div>
      </div>

      {/* RIGHT — Auth form */}
      <div
        className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 xl:p-16 relative"
        style={{ backgroundColor: "#F9F7F4" }}
      >
        {/* Mobile brand */}
        <div className="absolute top-6 left-6 lg:hidden">
          <BrandLogo variant="dark" layout="horizontal" showTagline={false} iconSize={32} />
        </div>

        <div className="w-full max-w-sm space-y-6">
          {/* Form header */}
          <div>
            <p
              className="text-[11px] font-semibold uppercase tracking-widest op-mono mb-2"
              style={{ color: "#C9A96E" }}
            >
              Staff Authentication
            </p>
            <h2
              className="text-[28px] font-semibold"
              style={{ color: "#1C1917" }}
            >
              Sign in
            </h2>
            <p className="text-[13px] mt-1" style={{ color: "#9C948E" }}>
              Enter your credentials to access the operations dashboard.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              className="flex items-start gap-2.5 p-3.5 rounded-lg text-[12px] animate-fade-in"
              style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", color: "#7F1D1D" }}
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#DC2626" }} />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="op-label" htmlFor="email">Email address</label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: "#9C948E" }}
                />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="manager@davinisfoodbank.com"
                  className="op-input"
                  style={{ paddingLeft: "36px" }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="op-label" htmlFor="password" style={{ marginBottom: 0 }}>
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-medium hover:underline"
                  style={{ color: "#C9A96E" }}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: "#9C948E" }}
                />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="op-input"
                  style={{ paddingLeft: "36px" }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="op-btn-primary w-full justify-center py-3 mt-2 text-[14px] font-semibold"
            >
              {isLoading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          {/* Footer note */}
          <p
            className="text-center text-[11px] leading-relaxed"
            style={{ color: "#9C948E" }}
          >
            Restricted area. Unauthorized access attempts are logged and reported.
          </p>
        </div>
      </div>
    </div>
  );
}
