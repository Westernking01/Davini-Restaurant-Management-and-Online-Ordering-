"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2, ChefHat, Terminal, ShieldCheck, Activity, Server } from "lucide-react";

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col justify-between font-sans selection:bg-amber-500 selection:text-slate-950 text-slate-100">
      
      {/* Split-Screen Main Content */}
      <main className="flex-1 flex min-h-screen">
        
        {/* LEFT SIDE: Dark Operational Brand Panel */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#090d16] via-[#0f172a] to-[#1e293b] p-12 xl:p-16 flex-col justify-between relative overflow-hidden border-r border-slate-800/80">
          {/* Grid & Tech Accents */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand & System Telemetry Header */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 border border-blue-400/30 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                <ChefHat className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-black text-2xl tracking-tight text-white block font-heading">
                  Davini&apos;s <span className="text-blue-400">OS</span>
                </span>
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400 block -mt-1">
                  Operations Command Center
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-emerald-400 text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>SYSTEM ONLINE</span>
            </div>
          </div>

          {/* Operational Storytelling Message */}
          <div className="relative z-10 max-w-lg space-y-6 my-auto py-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono font-bold uppercase tracking-wider backdrop-blur-md">
              <Terminal className="w-3.5 h-3.5 text-blue-400" /> Security Protocol
            </div>
            <h1 className="text-4xl xl:text-5xl font-black tracking-tight leading-[1.15] text-white font-heading">
              Staff Account Recovery.
            </h1>
            <p className="text-sm xl:text-base text-slate-300 leading-relaxed font-normal">
              Provide your authorized staff email address to dispatch an encrypted temporary access link. Administrative activity is logged for security audits.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 font-mono text-xs text-slate-400">
              <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center gap-3">
                <Activity className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <div>
                  <span className="block font-bold text-slate-200">Rapid Token Dispatch</span>
                  <span className="text-[10px] text-slate-500">Encrypted Email Delivery</span>
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center gap-3">
                <Server className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <div>
                  <span className="block font-bold text-slate-200">Session Protection</span>
                  <span className="text-[10px] text-slate-500">Automatic Old Token Expiry</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Security Footer */}
          <div className="relative z-10 pt-8 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono">
            <div className="flex items-center gap-2 text-slate-400 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>256-Bit Operational Encryption</span>
            </div>
            <span>AUTHORIZED STAFF ONLY</span>
          </div>
        </div>

        {/* RIGHT SIDE: Clean & Sharp Authentication Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 xl:p-20 bg-[#090d16] relative">
          
          {/* Mobile Top Brand */}
          <div className="absolute top-6 left-6 lg:hidden flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <ChefHat className="w-5 h-5" />
            </div>
            <span className="font-black text-lg tracking-tight text-white font-heading">
              Davini&apos;s <span className="text-blue-400">OS</span>
            </span>
          </div>

          <Link
            href="/login"
            className="absolute top-6 right-6 inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-400 hover:text-white transition-all bg-slate-900 hover:bg-slate-800 px-4 py-2.5 rounded-2xl border border-slate-800 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </Link>

          <div className="max-w-md w-full space-y-8 my-auto">
            
            {submitted ? (
              <div className="py-8 text-center space-y-6 animate-fade-in bg-slate-900/90 p-8 rounded-3xl border border-slate-800 shadow-xl">
                <div className="w-20 h-20 bg-blue-950 text-blue-400 border border-blue-800 rounded-3xl flex items-center justify-center mx-auto shadow-sm animate-bounce">
                  <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                </div>
                <div className="space-y-2">
                  <span className="text-[11px] font-mono font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800">
                    Dispatch Confirmed
                  </span>
                  <h3 className="text-3xl font-black text-white tracking-tight font-heading mt-2">Check your inbox</h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                    If <span className="font-bold text-white">{email}</span> is an active administrative staff account, recovery instructions have been dispatched. Please check your email inbox.
                  </p>
                </div>
                <div className="pt-4">
                  <Link href="/login" className="block">
                    <button className="w-full py-5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-xs transition-all cursor-pointer border border-slate-700 uppercase tracking-wider">
                      Return to Staff Login
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="space-y-2">
                  <span className="text-[11px] font-mono font-black uppercase tracking-widest text-blue-400 bg-blue-950/80 px-3 py-1 rounded-full border border-blue-800/80">
                    Staff Recovery
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-2 font-heading">
                    Forgot Password
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 font-normal">
                    Enter your work email address to receive secure password recovery instructions.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">
                      Staff Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="manager@davinisfoodbank.com"
                        className="w-full pl-11 pr-4 py-4 rounded-2xl border border-slate-800 bg-slate-900/90 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-semibold shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={!email}
                      className="w-full py-5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-black text-sm shadow-xl shadow-blue-600/20 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center uppercase tracking-wider font-mono active:scale-98"
                    >
                      Send reset link
                    </button>
                  </div>
                </form>

                <div className="pt-6 border-t border-slate-800/80 text-center">
                  <Link href="/login" className="text-xs font-mono text-slate-400 hover:text-white inline-flex items-center gap-1.5 transition-colors">
                    <ArrowLeft className="w-3.5 h-3.5" /> Return to Command Center Login
                  </Link>
                </div>
              </div>
            )}

          </div>

          <div className="absolute bottom-6 text-center text-[11px] font-mono text-slate-600">
            Davini&apos;s Food Bank OS &bull; Terminal ID: #DFB-ADM-01
          </div>
        </div>

      </main>
    </div>
  );
}
