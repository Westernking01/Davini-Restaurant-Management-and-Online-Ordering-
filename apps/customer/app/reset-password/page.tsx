"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { resetPasswordCustomer } from "@/lib/auth";
import { ArrowLeft, Lock, AlertCircle, CheckCircle2 } from "lucide-react";
import { BrandLogo } from "@/components/ui/brand-logo";
import { AuthVisualPanel } from "@/components/auth-visual-panel";

export default function CustomerResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passcodes do not match. Please ensure both fields match identically.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters in length.");
      return;
    }

    setIsLoading(true);

    try {
      const { error: authError } = await resetPasswordCustomer(password);
      if (authError) {
        setError(authError.message || "Failed to update security credentials. Your token may have expired.");
        setIsLoading(false);
        return;
      }
      setIsSuccess(true);
      setIsLoading(false);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setError("An unexpected network error occurred while updating your password.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans selection:bg-amber-200 selection:text-amber-900">
      <main className="flex-1 flex flex-col lg:flex-row min-h-screen">
        
        {/* LEFT SIDE: 50% Brand Storytelling Area (Desktop >= 1024px Only) */}
        <AuthVisualPanel
          bgImageUrl="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=80"
          quote="New security credentials"
          quoteHighlight="for your VIP dining account."
          subquote="Update your private dining password below. You will be redirected immediately to the executive login portal upon restoration."
          badges={["Enterprise Security", "Encrypted Registry", "Account Restoration"]}
        />

        {/* RIGHT SIDE: 50% Clean Authentication Form Container */}
        <div className="w-full lg:w-1/2 min-h-screen flex flex-col justify-between p-6 sm:p-10 xl:p-16 bg-[#FAF8F5] relative animate-slide-in-right">
          
          {/* Top Header: Logo (Mobile/Tablet < 1024px) + Return Link */}
          <div className="w-full flex items-center justify-between pb-4 lg:absolute lg:top-8 lg:right-10 lg:w-auto lg:pb-0 z-20">
            <div className="lg:hidden">
              <Link href="/">
                <BrandLogo variant="dark" layout="horizontal" showTagline={false} iconSize={32} />
              </Link>
            </div>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#4A443E] hover:text-[#1A1817] transition-colors bg-[#FFFFFF] px-4 py-2.5 rounded-lg border border-[#C5BEBA] hover:border-[#D97706] shadow-2xs ml-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Back to Login</span>
            </Link>
          </div>

          {/* Central Form Wrapper */}
          <div className="max-w-md w-full mx-auto my-auto py-8 space-y-7">
            <div>
              <span className="text-[11px] uppercase tracking-[0.22em] text-[#D97706] font-bold block">
                Security Restoration
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1817] tracking-tight mt-1.5">
                New Passcode
              </h2>
              <p className="text-xs sm:text-sm text-[#4A443E] mt-2 font-medium leading-relaxed">
                Choose a strong new password for your Davini&apos;s Food Bank account.
              </p>
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-[#FDF2F2] border border-[#F8B4B4] flex items-start gap-3 text-[#9B1C1C] text-xs font-semibold animate-scale-fade shadow-2xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#E02424]" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {isSuccess ? (
              <div className="p-6 rounded-xl bg-[#E8F0E9] border border-[#A6C4A9] space-y-4 animate-scale-fade shadow-sm">
                <div className="flex items-center gap-3 text-[#1E3F20]">
                  <CheckCircle2 className="w-6 h-6 text-[#1E3F20] shrink-0" />
                  <h3 className="font-serif text-xl font-bold">Password Successfully Updated</h3>
                </div>
                <p className="text-xs sm:text-sm text-[#2A4C2C] font-medium leading-relaxed">
                  Your credentials have been securely restored. You will be redirected to the executive login portal in a few seconds...
                </p>
                <div className="pt-2">
                  <Link
                    href="/login"
                    className="inline-block px-6 py-3.5 rounded-lg bg-[#1E3F20] hover:bg-[#142A15] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs"
                  >
                    Proceed to Sign In
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1A1817] uppercase tracking-wider block">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#7A726A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new secure password"
                      className="w-full pl-10 pr-4 py-3.5 rounded-lg border border-[#C5BEBA] bg-[#FFFFFF] text-[#1A1817] placeholder:text-[#7A726A] text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#D97706] focus:ring-2 focus:ring-[#D97706]/20 transition-all duration-200 shadow-2xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1A1817] uppercase tracking-wider block">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#7A726A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full pl-10 pr-4 py-3.5 rounded-lg border border-[#C5BEBA] bg-[#FFFFFF] text-[#1A1817] placeholder:text-[#7A726A] text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#D97706] focus:ring-2 focus:ring-[#D97706]/20 transition-all duration-200 shadow-2xs"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 text-xs uppercase tracking-[0.18em] font-bold bg-[#1A1817] hover:bg-[#D97706] text-[#FAF8F5] rounded-lg transition-all duration-300 active:scale-98 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {isLoading ? "Restoring Password..." : "Save New Password"}
                  </button>
                </div>
              </form>
            )}

            <div className="pt-6 border-t border-[#C5BEBA]/80 text-center">
              <p className="text-xs font-semibold text-[#4A443E]">
                Back to sign in?{" "}
                <Link href="/login" className="font-bold text-[#D97706] hover:text-[#92400E] hover:underline ml-1 transition-colors">
                  Login
                </Link>
              </p>
            </div>
          </div>

          {/* Bottom Footer Text with High Readability Contrast */}
          <div className="w-full pt-6 mt-auto text-center text-xs font-semibold text-[#4A443E] border-t border-[#C5BEBA]/80">
            © {new Date().getFullYear()} Davini&apos;s Food Bank. All rights reserved.
          </div>
        </div>

      </main>
    </div>
  );
}
