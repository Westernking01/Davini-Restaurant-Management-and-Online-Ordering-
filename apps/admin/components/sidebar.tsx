"use client";

import React from "react";
import { useAdmin, AdminTab, AdminRole } from "@/lib/context/admin-context";
import {
  LayoutDashboard,
  ClipboardList,
  ChefHat,
  UtensilsCrossed,
  Boxes,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  ShieldCheck,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { adminLogoutAction } from "@/actions/auth-actions";
import { BrandLogo } from "@/components/ui/brand-logo";

interface NavItem {
  id: AdminTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  allowedRoles: AdminRole[];
  badge?: "orders";
}

const NAV_GROUPS = [
  {
    label: "Operations",
    items: [
      { id: "dashboard" as AdminTab, label: "Dashboard", icon: LayoutDashboard, allowedRoles: ["ADMIN", "MANAGER"] as AdminRole[] },
      { id: "orders" as AdminTab, label: "Orders", icon: ClipboardList, allowedRoles: ["ADMIN", "MANAGER", "STAFF", "DELIVERY"] as AdminRole[], badge: "orders" as const },
      { id: "kds" as AdminTab, label: "Kitchen Display", icon: ChefHat, allowedRoles: ["ADMIN", "MANAGER", "STAFF"] as AdminRole[] },
    ],
  },
  {
    label: "Management",
    items: [
      { id: "menu" as AdminTab, label: "Menu", icon: UtensilsCrossed, allowedRoles: ["ADMIN", "MANAGER", "STAFF"] as AdminRole[] },
      { id: "inventory" as AdminTab, label: "Inventory", icon: Boxes, allowedRoles: ["ADMIN", "MANAGER"] as AdminRole[] },
      { id: "customers" as AdminTab, label: "Customers", icon: Users, allowedRoles: ["ADMIN", "MANAGER"] as AdminRole[] },
      { id: "payments" as AdminTab, label: "Payments", icon: CreditCard, allowedRoles: ["ADMIN", "MANAGER"] as AdminRole[] },
    ],
  },
  {
    label: "Reporting",
    items: [
      { id: "reports" as AdminTab, label: "Analytics", icon: BarChart3, allowedRoles: ["ADMIN"] as AdminRole[] },
      { id: "settings" as AdminTab, label: "Settings", icon: Settings, allowedRoles: ["ADMIN"] as AdminRole[] },
    ],
  },
];

const ROLE_LABELS: Record<AdminRole, string> = {
  ADMIN: "Administrator",
  MANAGER: "Manager",
  STAFF: "Kitchen Staff",
  DELIVERY: "Delivery",
};

export const AdminSidebar: React.FC = () => {
  const { activeTab, setActiveTab, userRole, setUserRole, activeOrdersCount, realtimeStatus } = useAdmin();
  const router = useRouter();

  const handleLogout = async () => {
    await adminLogoutAction();
    localStorage.removeItem("davinis_admin_logged_in");
    localStorage.removeItem("davinis_admin_role");
    router.push("/login");
    router.refresh();
  };

  return (
    <aside
      style={{ backgroundColor: "#14110F", borderRight: "1px solid #2A2420" }}
      className="w-60 flex flex-col flex-shrink-0 h-screen sticky top-0 z-40 select-none"
    >
      {/* Brand */}
      <div style={{ borderBottom: "1px solid #2A2420" }} className="px-4 py-4.5">
        <BrandLogo variant="gold" layout="horizontal" taglineText="Operations Portal" iconSize={34} />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {NAV_GROUPS.map((group) => {
          const visibleItems = group.items.filter((item) =>
            item.allowedRoles.includes(userRole)
          );
          if (visibleItems.length === 0) return null;

          return (
            <div key={group.label}>
              <p
                className="px-2 mb-1.5 text-[10px] font-semibold tracking-widest uppercase"
                style={{ color: "#5C4F44" }}
              >
                {group.label}
              </p>
              <div className="space-y-0.5">
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  const showBadge = item.badge === "orders" && activeOrdersCount > 0;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded text-[13px] font-medium transition-all cursor-pointer"
                      style={{
                        backgroundColor: isActive ? "#2A2420" : "transparent",
                        color: isActive ? "#EDD9AA" : "#A09488",
                        borderLeft: isActive ? "2px solid #C9A96E" : "2px solid transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          (e.currentTarget as HTMLButtonElement).style.color = "#D4C4B5";
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1E1914";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          (e.currentTarget as HTMLButtonElement).style.color = "#A09488";
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                        }
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className="w-4 h-4 flex-shrink-0"
                          style={{ color: isActive ? "#C9A96E" : "#6B5E55" }}
                        />
                        <span>{item.label}</span>
                      </div>
                      {showBadge && (
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded op-mono"
                          style={{
                            backgroundColor: isActive ? "#C9A96E" : "#D97706",
                            color: "#1C1917",
                          }}
                        >
                          {activeOrdersCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #2A2420" }} className="px-4 py-4 space-y-3">
        {/* Role + Status */}
        <div
          className="flex items-center justify-between px-2.5 py-2 rounded"
          style={{ backgroundColor: "#1E1914" }}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5" style={{ color: "#C9A96E" }} />
            <div>
              <p className="text-[11px] font-semibold" style={{ color: "#D4C4B5" }}>
                {ROLE_LABELS[userRole]}
              </p>
              <p className="text-[10px]" style={{ color: "#5C4F44" }}>
                {userRole}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {realtimeStatus === "CONNECTED" ? (
              <Wifi className="w-3.5 h-3.5" style={{ color: "#059669" }} />
            ) : (
              <WifiOff className="w-3.5 h-3.5" style={{ color: "#D97706" }} />
            )}
          </div>
        </div>

        {/* Role switcher (dev only) */}
        <select
          value={userRole}
          onChange={(e) => {
            const newRole = e.target.value as AdminRole;
            setUserRole(newRole);
            localStorage.setItem("davinis_admin_role", newRole);
            const allItems = NAV_GROUPS.flatMap((g) => g.items);
            const allowed = allItems.filter((i) => i.allowedRoles.includes(newRole));
            if (!allowed.some((i) => i.id === activeTab)) {
              setActiveTab(allowed[0]?.id || "orders");
            }
          }}
          className="w-full text-[11px] font-medium py-1.5 px-2 rounded cursor-pointer"
          style={{
            backgroundColor: "#1E1914",
            color: "#A09488",
            border: "1px solid #2A2420",
            outline: "none",
          }}
          title="Switch role (testing only)"
        >
          <option value="ADMIN">ADMIN</option>
          <option value="MANAGER">MANAGER</option>
          <option value="STAFF">STAFF</option>
          <option value="DELIVERY">DELIVERY</option>
        </select>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-2.5 py-2 rounded text-[12px] font-medium cursor-pointer transition-all"
          style={{ color: "#6B5E55", backgroundColor: "transparent" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "#DC2626";
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1E1914";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "#6B5E55";
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
          }}
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
};
