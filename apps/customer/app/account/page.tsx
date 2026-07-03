"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { logoutCustomer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";
import { fetchAccountDashboardDataAction, updateAccountProfileAction } from "@/actions/auth-actions";
import { formatCurrency } from "@/lib/utils";
import { 
  User, 
  LogOut, 
  Package, 
  Award, 
  Calendar, 
  DollarSign, 
  MapPin, 
  Phone, 
  Mail, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  X, 
  ShoppingBag, 
  ArrowLeft,
  Sparkles,
  Truck,
  Utensils
} from "lucide-react";

function AccountDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<"profile" | "orders">(activeTabParam === "orders" ? "orders" : "profile");

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Edit Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Order Details Modal State
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  useEffect(() => {
    if (activeTabParam === "orders" || activeTabParam === "profile") {
      setTimeout(() => setActiveTab(activeTabParam as any), 0);
    }
  }, [activeTabParam]);

  useEffect(() => {
    async function loadAccount() {
      setLoading(true);
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session || !session.user) {
        router.push("/login?redirect=/account");
        return;
      }

      const userId = session.user.id;
      const email = session.user.email;
      const fullName = session.user.user_metadata?.full_name;
      const phone = session.user.user_metadata?.phone;
      const avatarUrl = session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture;

      const res = await fetchAccountDashboardDataAction(userId, email, fullName, phone, avatarUrl);
      if (res.success && res.data) {
        setDashboardData(res.data);
        setEditName(res.data.profile.name || "");
        setEditPhone(res.data.profile.phone || "");
        setEditAddress(res.data.profile.address || "");
      } else {
        setError(res.error || "Failed to load dashboard profile.");
      }
      setLoading(false);
    }
    loadAccount();
  }, [router]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dashboardData) return;
    setIsSaving(true);
    setSaveSuccess(false);

    const res = await updateAccountProfileAction(dashboardData.profile.id, {
      name: editName,
      phone: editPhone,
      address: editAddress,
    });

    setIsSaving(false);
    if (res.success) {
      setDashboardData({
        ...dashboardData,
        profile: {
          ...dashboardData.profile,
          name: editName,
          phone: editPhone,
          address: editAddress,
        },
      });
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      alert("Failed to update profile: " + res.error);
    }
  };

  const handleTabChange = (tab: "profile" | "orders") => {
    setActiveTab(tab);
    router.push(`/account?tab=${tab}`, { scroll: false });
  };

  const handleLogout = async () => {
    await logoutCustomer();
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] bg-[#FAF8F5] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-3 border-[#C86D3B] border-t-transparent rounded-full animate-spin" />
        <p className="font-serif text-sm font-semibold text-[#6B6560] animate-pulse">Entering VIP Lounge Portal...</p>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-[70vh] bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#FDF2F2] text-[#DC2626] flex items-center justify-center mx-auto">
          <X className="w-8 h-8" />
        </div>
        <h2 className="font-serif font-bold text-2xl text-[#1A1817]">Unable to Access Membership Record</h2>
        <p className="text-xs text-[#6B6560] max-w-md">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 rounded bg-[#1A1817] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#C86D3B] transition-colors"
        >
          Retry Access
        </button>
      </div>
    );
  }

  const { profile, orders, summary } = dashboardData;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#E8F0E9] text-[#1E3F20] uppercase tracking-wider"><CheckCircle2 className="w-3 h-3" /> Delivered</span>;
      case "DISPATCHED":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FEF3C7] text-[#92400E] uppercase tracking-wider"><Truck className="w-3 h-3 animate-pulse" /> On Route</span>;
      case "PREPARING":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#E0E7FF] text-[#3730A3] uppercase tracking-wider"><Utensils className="w-3 h-3 animate-spin" /> Chef Preparation</span>;
      case "CANCELLED":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FDF2F2] text-[#DC2626] uppercase tracking-wider">Cancelled</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#F3F4F6] text-[#4B5563] uppercase tracking-wider"><Clock className="w-3 h-3" /> Pending</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E6E1DA]">
          <Link href="/" className="inline-flex items-center gap-2 text-[#6B6560] hover:text-[#1A1817] font-semibold text-xs transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Menu Catalog
          </Link>
          {saveSuccess && (
            <span className="text-xs font-bold text-[#1E3F20] bg-[#E8F0E9] px-3 py-1 rounded-full animate-fade-in flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Profile Updated Successfully
            </span>
          )}
        </div>

        {/* Mobile Top Profile Card (Hidden on Desktop) */}
        <div className="lg:hidden bg-[#1A1817] rounded-xl p-6 text-[#FAF8F5] shadow-lg border border-[#1A1817] relative overflow-hidden animate-fade-in">
          <Sparkles className="w-24 h-24 text-[#C86D3B]/15 absolute -bottom-4 -right-4 pointer-events-none" />
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-full bg-[#C86D3B] text-[#FAF8F5] flex items-center justify-center font-serif font-bold text-xl shrink-0 shadow-md border-2 border-[#FAF8F5]/20 overflow-hidden">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                profile.name?.charAt(0) || "V"
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-xl font-bold tracking-tight text-[#FAF8F5] truncate">{profile.name}</h1>
              </div>
              <p className="text-[#C5BEBA] text-xs font-mono truncate">{profile.email}</p>
              <span className="inline-flex items-center gap-1 mt-1 text-[10px] uppercase tracking-widest text-[#C86D3B] font-semibold bg-[#FAF8F5]/10 px-2 py-0.5 rounded">
                <Award className="w-3 h-3" /> VIP Executive Member
              </span>
            </div>
          </div>

          {/* Mobile Tab Switcher */}
          <div className="grid grid-cols-2 gap-2 mt-6 pt-5 border-t border-[#FAF8F5]/10">
            <button
              type="button"
              onClick={() => handleTabChange("profile")}
              className={`py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === "profile"
                  ? "bg-[#C86D3B] text-[#FAF8F5] shadow-sm"
                  : "bg-transparent text-[#C5BEBA] hover:bg-[#FAF8F5]/10"
              }`}
            >
              <User className="w-3.5 h-3.5" /> My Profile
            </button>
            <button
              type="button"
              onClick={() => handleTabChange("orders")}
              className={`py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === "orders"
                  ? "bg-[#C86D3B] text-[#FAF8F5] shadow-sm"
                  : "bg-transparent text-[#C5BEBA] hover:bg-[#FAF8F5]/10"
              }`}
            >
              <Package className="w-3.5 h-3.5" /> My Orders ({summary.totalOrders})
            </button>
          </div>
        </div>

        {/* Layout Grid: Desktop Sidebar + Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Desktop Left Profile Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 bg-[#FFFFFF] rounded-2xl border border-[#E6E1DA] shadow-sm overflow-hidden sticky top-28 animate-fade-in">
            {/* Header Banner */}
            <div className="bg-[#1A1817] p-6 text-center relative overflow-hidden">
              <Sparkles className="w-20 h-20 text-[#C86D3B]/15 absolute -bottom-2 -right-2 pointer-events-none" />
              <div className="w-20 h-20 rounded-full bg-[#C86D3B] text-[#FAF8F5] flex items-center justify-center font-serif font-bold text-3xl mx-auto shadow-md border-3 border-[#FAF8F5]/20 mb-3 animate-subtle-zoom overflow-hidden">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  profile.name?.charAt(0) || "V"
                )}
              </div>
              <h3 className="font-serif font-bold text-lg text-[#FAF8F5] truncate">{profile.name}</h3>
              <p className="text-[11px] text-[#C5BEBA] font-mono truncate mt-0.5">{profile.email}</p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF8F5]/10 text-[#C86D3B] text-[10px] font-bold uppercase tracking-widest">
                <Award className="w-3 h-3" /> VIP Member
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="p-3 space-y-1">
              <button
                type="button"
                onClick={() => handleTabChange("profile")}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  activeTab === "profile"
                    ? "bg-[#1A1817] text-[#FAF8F5] shadow-2xs"
                    : "text-[#6B6560] hover:bg-[#F4F0EA] hover:text-[#1A1817]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <User className={`w-4 h-4 ${activeTab === "profile" ? "text-[#C86D3B]" : "text-[#8C827A]"}`} />
                  <span>My Profile</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>

              <button
                type="button"
                onClick={() => handleTabChange("orders")}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  activeTab === "orders"
                    ? "bg-[#1A1817] text-[#FAF8F5] shadow-2xs"
                    : "text-[#6B6560] hover:bg-[#F4F0EA] hover:text-[#1A1817]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package className={`w-4 h-4 ${activeTab === "orders" ? "text-[#C86D3B]" : "text-[#8C827A]"}`} />
                  <span>My Orders</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === "orders" ? "bg-[#C86D3B] text-white" : "bg-[#F4F0EA] text-[#1A1817]"}`}>
                  {summary.totalOrders}
                </span>
              </button>
            </nav>

            {/* Logout Footer */}
            <div className="p-3 border-t border-[#E6E1DA]/80">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-[#DC2626] hover:bg-[#FDF2F2] transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-3 space-y-8 animate-fade-in">
            
            {activeTab === "profile" ? (
              <div className="space-y-8">
                
                {/* Profile Header & Edit Action */}
                <div className="bg-[#FFFFFF] rounded-2xl p-6 sm:p-8 border border-[#E6E1DA] shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E6E1DA]">
                    <div>
                      <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#1A1817]">My Profile</h2>
                      <p className="text-xs text-[#6B6560] mt-1">Manage your executive contact information and dining delivery preferences.</p>
                    </div>
                    {!isEditing ? (
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1A1817] hover:bg-[#C86D3B] text-[#FAF8F5] text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F4F0EA] hover:bg-[#E6E1DA] text-[#1A1817] text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shrink-0"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  {/* Profile Form / View */}
                  {!isEditing ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                      <div className="space-y-1.5 p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E1DA]/60">
                        <span className="text-[10px] font-bold text-[#6B6560] uppercase tracking-widest flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-[#C86D3B]" /> Full Name
                        </span>
                        <p className="font-serif font-bold text-base text-[#1A1817]">{profile.name}</p>
                      </div>

                      <div className="space-y-1.5 p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E1DA]/60">
                        <span className="text-[10px] font-bold text-[#6B6560] uppercase tracking-widest flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-[#C86D3B]" /> Email Address
                        </span>
                        <p className="font-mono text-xs font-medium text-[#1A1817]">{profile.email}</p>
                      </div>

                      <div className="space-y-1.5 p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E1DA]/60">
                        <span className="text-[10px] font-bold text-[#6B6560] uppercase tracking-widest flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-[#C86D3B]" /> Phone Number
                        </span>
                        <p className="font-sans text-sm font-semibold text-[#1A1817]">
                          {profile.phone || <span className="text-[#8C827A] italic font-normal">Not configured</span>}
                        </p>
                      </div>

                      <div className="space-y-1.5 p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E1DA]/60">
                        <span className="text-[10px] font-bold text-[#6B6560] uppercase tracking-widest flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#C86D3B]" /> Saved Delivery Address
                        </span>
                        <p className="font-sans text-sm font-semibold text-[#1A1817]">
                          {profile.address || <span className="text-[#8C827A] italic font-normal">No delivery address saved yet</span>}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSaveProfile} className="pt-6 space-y-5 animate-fade-in">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-[#1A1817] block mb-1.5">Full Name</label>
                          <input
                            type="text"
                            required
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full text-xs p-3.5 rounded-lg border border-[#E6E1DA] bg-[#FAF8F5] text-[#1A1817] font-semibold focus:outline-none focus:border-[#C86D3B] focus:ring-2 focus:ring-[#C86D3B]/20"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-[#1A1817] block mb-1.5">Phone Number</label>
                          <input
                            type="text"
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                            placeholder="+234 803 000 0000"
                            className="w-full text-xs p-3.5 rounded-lg border border-[#E6E1DA] bg-[#FAF8F5] text-[#1A1817] font-semibold focus:outline-none focus:border-[#C86D3B] focus:ring-2 focus:ring-[#C86D3B]/20"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-[#1A1817] block mb-1.5">Delivery Address</label>
                        <input
                          type="text"
                          value={editAddress}
                          onChange={(e) => setEditAddress(e.target.value)}
                          placeholder="House No, Street, Victoria Island / Lekki, Lagos"
                          className="w-full text-xs p-3.5 rounded-lg border border-[#E6E1DA] bg-[#FAF8F5] text-[#1A1817] font-semibold focus:outline-none focus:border-[#C86D3B] focus:ring-2 focus:ring-[#C86D3B]/20"
                        />
                      </div>
                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="px-6 py-3 rounded-lg bg-[#C86D3B] hover:bg-[#1A1817] text-[#FAF8F5] text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
                        >
                          {isSaving ? "Saving Updates..." : "Save Profile Changes"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* Account Summary Card */}
                <div className="bg-[#1A1817] rounded-2xl p-6 sm:p-8 text-[#FAF8F5] shadow-md border border-[#1A1817] relative overflow-hidden">
                  <Sparkles className="w-32 h-32 text-[#C86D3B]/10 absolute -bottom-6 -right-6 pointer-events-none" />
                  <h3 className="font-serif font-bold text-xl text-[#FAF8F5] pb-4 border-b border-[#FAF8F5]/10 flex items-center justify-between">
                    <span>Executive Account Summary</span>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#C86D3B]">Davini Membership Tier</span>
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-widest text-[#C5BEBA] font-semibold block flex items-center gap-1">
                        <ShoppingBag className="w-3.5 h-3.5 text-[#C86D3B]" /> Total Orders
                      </span>
                      <p className="font-serif font-bold text-2xl sm:text-3xl text-[#FAF8F5]">{summary.totalOrders}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-widest text-[#C5BEBA] font-semibold block flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-[#C86D3B]" /> Total Spent
                      </span>
                      <p className="font-serif font-bold text-xl sm:text-2xl text-[#C86D3B]">{formatCurrency(summary.totalSpent)}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-widest text-[#C5BEBA] font-semibold block flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#C86D3B]" /> Member Since
                      </span>
                      <p className="font-sans font-bold text-base text-[#FAF8F5] mt-1">{profile.memberSince}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-widest text-[#C5BEBA] font-semibold block flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-[#C86D3B]" /> Loyalty Points
                      </span>
                      <p className="font-serif font-bold text-2xl sm:text-3xl text-[#FAF8F5] flex items-center gap-1.5">
                        {profile.loyaltyPoints} <span className="text-xs font-sans text-[#C86D3B]">PTS</span>
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              /* Orders Tab */
              <div className="space-y-6">
                <div className="bg-[#FFFFFF] rounded-2xl p-6 sm:p-8 border border-[#E6E1DA] shadow-xs">
                  <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#1A1817]">Recent Orders</h2>
                  <p className="text-xs text-[#6B6560] mt-1">Track live preparations and review historical culinary receipts.</p>

                  <div className="mt-6 space-y-4">
                    {orders.length === 0 ? (
                      <div className="py-16 text-center space-y-4 bg-[#FAF8F5] rounded-xl border border-dashed border-[#E6E1DA]">
                        <Package className="w-12 h-12 text-[#C5BEBA] mx-auto animate-subtle-zoom" />
                        <div className="space-y-1">
                          <h4 className="font-serif font-bold text-xl text-[#1A1817]">No Orders Recorded Yet</h4>
                          <p className="text-xs text-[#6B6560] max-w-sm mx-auto">Explore our authentic menu and place your first royal feast.</p>
                        </div>
                        <Link
                          href="/#menu"
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#1A1817] hover:bg-[#C86D3B] text-[#FAF8F5] text-xs font-bold uppercase tracking-widest transition-all shadow-sm"
                        >
                          Browse Executive Menu
                        </Link>
                      </div>
                    ) : (
                      orders.map((order: any) => {
                        const firstItem = order.order_items && order.order_items[0];
                        const itemCount = order.order_items?.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0) || 1;
                        const displayImg = firstItem?.image_url || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80";

                        return (
                          <div
                            key={order.id}
                            className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E6E1DA] hover:border-[#C86D3B] transition-all duration-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-4">
                              <img
                                src={displayImg}
                                alt="Dish preview"
                                className="w-16 h-16 rounded-lg object-cover bg-[#FAF8F5] shrink-0 border border-[#E6E1DA]"
                              />
                              <div className="space-y-1">
                                <div className="flex items-center gap-2.5 flex-wrap">
                                  <span className="font-mono font-bold text-xs text-[#C86D3B] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E6E1DA]">
                                    #{order.order_number || order.id.slice(0, 8).toUpperCase()}
                                  </span>
                                  {getStatusBadge(order.status)}
                                </div>
                                <h4 className="font-serif font-bold text-base text-[#1A1817]">
                                  {firstItem ? `${firstItem.product_name} ${itemCount > 1 ? `+ ${itemCount - 1} more` : ""}` : `${itemCount} Gourmet Dish(es)`}
                                </h4>
                                <p className="text-[11px] text-[#6B6560] font-medium">
                                  Ordered on {new Date(order.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                                </p>
                              </div>
                            </div>

                            <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-[#E6E1DA]/60">
                              <span className="font-serif font-bold text-lg text-[#1A1817]">
                                {formatCurrency(order.total_amount)}
                              </span>
                              <button
                                type="button"
                                onClick={() => setSelectedOrder(order)}
                                className="mt-1 px-4 py-2 rounded-lg bg-[#FAF8F5] hover:bg-[#1A1817] hover:text-[#FAF8F5] text-[#1A1817] text-xs font-bold uppercase tracking-wider border border-[#E6E1DA] transition-all cursor-pointer"
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedOrder(null)}>
            <div className="w-full max-w-lg bg-[#FFFFFF] rounded-2xl border border-[#E6E1DA] shadow-2xl overflow-hidden animate-scale-fade" onClick={(e) => e.stopPropagation()}>
              <div className="bg-[#1A1817] p-6 text-[#FAF8F5] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#C86D3B] font-semibold block">Feast Receipt</span>
                  <h3 className="font-serif font-bold text-xl text-[#FAF8F5]">Order #{selectedOrder.order_number || selectedOrder.id.slice(0, 8).toUpperCase()}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 rounded-lg bg-[#FAF8F5]/10 hover:bg-[#FAF8F5]/20 text-[#FAF8F5] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="flex justify-between items-center pb-4 border-b border-[#E6E1DA]">
                  <span className="text-xs font-semibold text-[#6B6560]">Fulfillment Status</span>
                  {getStatusBadge(selectedOrder.status)}
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1817]">Ordered Dishes</h4>
                  <div className="space-y-2.5">
                    {selectedOrder.order_items?.map((item: any) => (
                      <div key={item.id} className="flex justify-between items-center p-3 rounded-lg bg-[#FAF8F5] border border-[#E6E1DA]/60">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded bg-[#1A1817] text-[#FAF8F5] flex items-center justify-center font-bold text-xs shrink-0">
                            {item.quantity}x
                          </span>
                          <div>
                            <p className="font-serif font-bold text-sm text-[#1A1817]">{item.product_name}</p>
                            {item.selected_options && Array.isArray(item.selected_options) && item.selected_options.length > 0 && (
                              <p className="text-[10px] text-[#C86D3B] font-medium">+ {item.selected_options.map((o: any) => o.name || o).join(", ")}</p>
                            )}
                          </div>
                        </div>
                        <span className="font-serif font-bold text-sm text-[#1A1817]">{formatCurrency(item.unit_price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 bg-[#FAF8F5] p-4 rounded-xl border border-[#E6E1DA] text-xs">
                  <div className="flex justify-between text-[#6B6560]">
                    <span>Fulfillment Method</span>
                    <span className="font-bold text-[#1A1817] uppercase">{selectedOrder.order_type}</span>
                  </div>
                  {selectedOrder.delivery_address && (
                    <div className="flex justify-between text-[#6B6560]">
                      <span>Delivery Address</span>
                      <span className="font-medium text-[#1A1817] text-right max-w-[200px]">{selectedOrder.delivery_address}</span>
                    </div>
                  )}
                  {selectedOrder.notes && (
                    <div className="flex justify-between text-[#6B6560] pt-1">
                      <span>Kitchen Notes</span>
                      <span className="font-medium text-[#C86D3B] italic">{selectedOrder.notes}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-sm text-[#1A1817] pt-2 border-t border-[#E6E1DA]">
                    <span>Total Amount Paid</span>
                    <span className="font-serif text-base text-[#C86D3B]">{formatCurrency(selectedOrder.total_amount)}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#FAF8F5] border-t border-[#E6E1DA] text-center">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="w-full py-3 rounded-lg bg-[#1A1817] hover:bg-[#C86D3B] text-[#FAF8F5] text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-sm"
                >
                  Close Receipt
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function CustomerAccountPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-[#C86D3B] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AccountDashboardContent />
    </Suspense>
  );
}
