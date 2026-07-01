"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logoutCustomer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";
import { User, LogOut, Package, ShieldCheck, ArrowLeft } from "lucide-react";

export default function CustomerAccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login?redirect=/account");
      } else {
        setUser(session.user);
      }
      setLoading(false);
    };
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    await logoutCustomer();
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#1A1817] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E6E1DA]">
          <Link href="/" className="inline-flex items-center gap-2 text-[#6B6560] hover:text-[#1A1817] font-semibold text-xs transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Menu Catalog
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded bg-[#FFFFFF] hover:bg-[#FDF2F2] text-[#DC2626] border border-[#E6E1DA] font-semibold text-xs transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>

        {/* Header Profile Card */}
        <div className="bg-[#1A1817] rounded-lg p-8 text-[#FAF8F5] shadow-sm border border-[#1A1817]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded bg-[#C86D3B] flex items-center justify-center text-[#FAF8F5]">
                <User className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-[#C86D3B] font-semibold block">
                  Registered Member
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#FAF8F5]">
                  {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Dining Guest"}
                </h1>
                <p className="text-[#C5BEBA] text-xs font-mono">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#FFFFFF] p-6 rounded-lg border border-[#E6E1DA] shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 text-[#1A1817] font-serif font-bold text-lg">
                <Package className="w-5 h-5 text-[#C86D3B]" /> Active Orders & Tracking
              </div>
              <p className="text-[#6B6560] text-xs leading-relaxed">
                Your gourmet feast dispatches, live delivery pipeline, and past order ledger are synchronized with your profile.
              </p>
            </div>
            <div className="pt-2">
              <Link href="/#tracking" className="inline-block px-5 py-2.5 rounded bg-[#1A1817] text-[#FAF8F5] font-semibold text-xs uppercase tracking-wider hover:bg-[#C86D3B] transition-colors">
                View Live Orders →
              </Link>
            </div>
          </div>

          <div className="bg-[#FFFFFF] p-6 rounded-lg border border-[#E6E1DA] shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 text-[#1A1817] font-serif font-bold text-lg">
                <ShieldCheck className="w-5 h-5 text-[#1E3F20]" /> Security & Profile ID
              </div>
              <p className="text-[#6B6560] text-xs leading-relaxed">
                Your account is protected by encrypted row-level security protocols ensuring privacy across all dining channels.
              </p>
            </div>
            <div className="text-[11px] font-mono bg-[#FAF8F5] p-3 rounded border border-[#E6E1DA] text-[#6B6560] break-all">
              UID: {user?.id}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
