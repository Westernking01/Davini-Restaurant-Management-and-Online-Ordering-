"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUpCustomer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Mail, Lock, User, Phone, AlertCircle, CheckCircle2 } from "lucide-react";
import { BrandLogo } from "@/components/ui/brand-logo";
import { AuthVisualPanel } from "@/components/auth-visual-panel";

export default function CustomerSignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters in length.");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error: authError } = await signUpCustomer(email, password, name, phone);
      if (authError) {
        setError(authError.message || "Could not register your profile. Please check your information.");
        return;
      }

      if (data?.user && !data?.session) {
        setSuccessMessage("Account created. Please check your email to verify your account.");
        return;
      }

      if (data?.user) {
        setSuccessMessage("Account created successfully");
        setTimeout(() => {
          router.push("/account");
          router.refresh();
        }, 1200);
        return;
      }
    } catch (err: any) {
      setError("An unexpected network error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError(null);
    setIsGoogleLoading(true);
    console.log("[OAuth] OAuth started for Google provider");
    try {
      const supabase = createClient();
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (googleError) {
        console.error("[OAuth] Error starting Google OAuth:", googleError.message);
        setError(googleError.message || "Google OAuth is currently unavailable.");
        setIsGoogleLoading(false);
      }
    } catch (err: any) {
      console.error("[OAuth] Failed to initialize Google signup:", err?.message || err);
      setError("Failed to initialize Google signup.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans selection:bg-amber-200 selection:text-amber-900">
      <main className="flex-1 flex flex-col lg:flex-row min-h-screen">
        
        {/* LEFT SIDE: 50% Brand Storytelling Area (Desktop >= 1024px Only) */}
        <AuthVisualPanel
          bgImageUrl="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1800&q=80"
          quote="Join the executive table"
          quoteHighlight="of authentic Lagos dining."
          subquote="Create your private dining profile today to access priority table reservations, express thermal delivery dispatch, and members-only culinary specials."
          badges={["Priority Dispatch", "Table Reservations", "Executive Dining"]}
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
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#4A443E] hover:text-[#1A1817] transition-colors bg-[#FFFFFF] px-4 py-2.5 rounded-lg border border-[#C5BEBA] hover:border-[#D97706] shadow-2xs ml-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Return to Menu</span>
            </Link>
          </div>

          {/* Central Form Wrapper */}
          <div className="max-w-md w-full mx-auto my-auto py-8 space-y-6">
            <div>
              <span className="text-[11px] uppercase tracking-[0.22em] text-[#D97706] font-bold block">
                Membership Registration
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1817] tracking-tight mt-1.5">
                Create Account
              </h2>
              <p className="text-xs sm:text-sm text-[#4A443E] mt-2 font-medium leading-relaxed">
                Register your dining profile for priority delivery and reservations.
              </p>
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-[#FDF2F2] border border-[#F8B4B4] flex items-start gap-3 text-[#9B1C1C] text-xs font-semibold animate-scale-fade shadow-2xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#E02424]" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-4 rounded-lg bg-[#E8F0E9] border border-[#A2D2A9] flex items-start gap-3 text-[#1E3F20] text-xs font-semibold animate-scale-fade shadow-2xs">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#2E7D32]" />
                <span className="leading-relaxed">{successMessage}</span>
              </div>
            )}

            <div className="space-y-4">
              <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={isGoogleLoading || isLoading}
                className="w-full py-3.5 px-4 rounded-lg border border-[#C5BEBA] bg-[#FFFFFF] hover:bg-[#F4F0EA] text-[#1A1817] font-bold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all duration-200 active:scale-98 cursor-pointer shadow-2xs disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{isGoogleLoading ? "Connecting..." : "Sign up with Google"}</span>
              </button>

              <div className="relative flex items-center justify-center py-1">
                <div className="border-t border-[#C5BEBA] w-full" />
                <span className="bg-[#FAF8F5] px-3 text-[10px] font-bold text-[#4A443E] uppercase tracking-wider absolute">
                  or register with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1A1817] uppercase tracking-wider block">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#7A726A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Adewale Adeleke"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#C5BEBA] bg-[#FFFFFF] text-[#1A1817] placeholder:text-[#7A726A] text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#D97706] focus:ring-2 focus:ring-[#D97706]/20 transition-all duration-200 shadow-2xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1A1817] uppercase tracking-wider block">
                  Telephone Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#7A726A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 803 000 0000"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#C5BEBA] bg-[#FFFFFF] text-[#1A1817] placeholder:text-[#7A726A] text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#D97706] focus:ring-2 focus:ring-[#D97706]/20 transition-all duration-200 shadow-2xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1A1817] uppercase tracking-wider block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#7A726A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="adewale@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#C5BEBA] bg-[#FFFFFF] text-[#1A1817] placeholder:text-[#7A726A] text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#D97706] focus:ring-2 focus:ring-[#D97706]/20 transition-all duration-200 shadow-2xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1A1817] uppercase tracking-wider block">
                  Password (6+ characters)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#7A726A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#C5BEBA] bg-[#FFFFFF] text-[#1A1817] placeholder:text-[#7A726A] text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#D97706] focus:ring-2 focus:ring-[#D97706]/20 transition-all duration-200 shadow-2xs"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading || isGoogleLoading || !!successMessage}
                  className="w-full py-4 text-xs uppercase tracking-[0.18em] font-bold bg-[#1A1817] hover:bg-[#D97706] text-[#FAF8F5] rounded-lg transition-all duration-300 active:scale-98 cursor-pointer shadow-md disabled:opacity-50"
                >
                  {isLoading ? "Creating Profile..." : successMessage ? "Account Created" : "Create Account"}
                </button>
              </div>
            </form>

            <div className="pt-5 border-t border-[#C5BEBA]/80 text-center">
              <p className="text-xs font-semibold text-[#4A443E]">
                Already registered?{" "}
                <Link href="/login" className="font-bold text-[#D97706] hover:text-[#92400E] hover:underline ml-1 transition-colors">
                  Sign In
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
