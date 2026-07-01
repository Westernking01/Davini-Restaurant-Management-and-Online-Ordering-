"use client";

import React, { useState } from "react";
import { Lock, CheckCircle2, ChefHat, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminResetPasswordPage() {
  const [password, setPassword]               = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError]                     = useState("");
  const [success, setSuccess]                 = useState(false);
  const [isLoading, setIsLoading]             = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify your entries.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setError("");
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
    }, 1000);
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
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(201,169,110,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(201,169,110,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative z-10 flex items-center gap-3">
          <div
            className="w-9 h-9 rounded flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "#C9A96E" }}
          >
            <ChefHat className="w-4.5 h-4.5" style={{ color: "#1C1917" }} />
          </div>
          <div>
            <span
              className="davinis-wordmark block text-[18px] leading-tight"
              style={{ color: "#EDD9AA" }}
            >
              Davini&apos;s
            </span>
            <span
              className="text-[10px] font-medium tracking-widest uppercase block"
              style={{ color: "#5C4F44", marginTop: "-2px" }}
            >
              Operations Platform
            </span>
          </div>
        </div>

        <div className="relative z-10 space-y-6 my-auto py-12">
          <span
            className="inline-block text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded op-mono"
            style={{ backgroundColor: "rgba(201,169,110,0.12)", color: "#C9A96E", border: "1px solid rgba(201,169,110,0.2)" }}
          >
            Security Protocol
          </span>
          <h1
            className="davinis-wordmark text-[40px] xl:text-[48px] leading-[1.1]"
            style={{ color: "#F5EDD9" }}
          >
            Update your
            <br />
            credentials.
          </h1>
          <p
            className="text-[14px] leading-relaxed max-w-sm"
            style={{ color: "#A09488" }}
          >
            Create a new encrypted passphrase. All POS terminal and KDS access will require these credentials.
          </p>
          <ul className="space-y-3">
            {[
              "Bcrypt hashed — zero plaintext storage",
              "Old sessions terminated immediately",
              "All active tokens revoked on update",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-[13px]" style={{ color: "#A09488" }}>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: "#C9A96E" }} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div
          className="relative z-10 flex items-center justify-between text-[11px] pt-6"
          style={{ borderTop: "1px solid #2A2420", color: "#5C4F44" }}
        >
          <span>Authorized Personnel Only</span>
          <span className="op-mono">TID: #DFB-ADM-01</span>
        </div>
      </div>

      {/* RIGHT — Form */}
      <div
        className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 xl:p-16 relative"
        style={{ backgroundColor: "#F9F7F4" }}
      >
        {/* Mobile brand */}
        <div className="absolute top-6 left-6 lg:hidden flex items-center gap-2.5">
          <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: "#14110F" }}>
            <ChefHat className="w-4 h-4" style={{ color: "#C9A96E" }} />
          </div>
          <span className="davinis-wordmark text-[16px]" style={{ color: "#14110F" }}>Davini&apos;s</span>
        </div>

        <Link
          href="/login"
          className="absolute top-6 right-6 flex items-center gap-1.5 text-[12px] font-medium hover:opacity-80 transition-opacity"
          style={{ color: "#9C948E" }}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to login
        </Link>

        <div className="w-full max-w-sm">
          {success ? (
            <div className="text-center space-y-5 animate-fade-in">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto"
                style={{ backgroundColor: "#ECFDF5", border: "1px solid #A7F3D0" }}
              >
                <CheckCircle2 className="w-8 h-8" style={{ color: "#059669" }} />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest op-mono mb-2" style={{ color: "#059669" }}>
                  Password Updated
                </p>
                <h3 className="text-[24px] font-semibold" style={{ color: "#1C1917" }}>
                  Credentials updated.
                </h3>
                <p className="text-[13px] mt-2" style={{ color: "#9C948E" }}>
                  Your staff portal credentials have been updated successfully.
                </p>
              </div>
              <Link href="/login" className="block">
                <button className="op-btn-primary w-full justify-center py-3 text-[14px] font-semibold">
                  Continue to login
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest op-mono mb-2" style={{ color: "#C9A96E" }}>
                  Credential Update
                </p>
                <h2 className="text-[28px] font-semibold" style={{ color: "#1C1917" }}>
                  Reset Password
                </h2>
                <p className="text-[13px] mt-1" style={{ color: "#9C948E" }}>
                  Enter and confirm your new staff password.
                </p>
              </div>

              {error && (
                <div
                  className="flex items-start gap-2.5 p-3.5 rounded-lg text-[12px] animate-fade-in"
                  style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", color: "#7F1D1D" }}
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#DC2626" }} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="op-label" htmlFor="password">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "#9C948E" }} />
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

                <div>
                  <label className="op-label" htmlFor="confirm">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "#9C948E" }} />
                    <input
                      id="confirm"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="op-input"
                      style={{ paddingLeft: "36px" }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !password || !confirmPassword}
                  className="op-btn-primary w-full justify-center py-3 mt-2 text-[14px] font-semibold"
                >
                  {isLoading ? "Updating…" : "Update Password"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
