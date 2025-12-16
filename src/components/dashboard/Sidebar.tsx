"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  UserCog,
  Calendar,
  ClipboardList,
  FileText,
  Settings,
  LogOut,
  Building2,
  Stethoscope,
  Clock,
  Heart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const adminNavItems: NavItem[] = [
  { name: "Dashboard", href: "/admin", icon: <LayoutDashboard className="h-5 w-5" /> },
  { name: "Doctors", href: "/admin/doctors", icon: <Stethoscope className="h-5 w-5" /> },
  { name: "Patients", href: "/admin/patients", icon: <Users className="h-5 w-5" /> },
  { name: "Appointments", href: "/admin/appointments", icon: <Calendar className="h-5 w-5" /> },
  { name: "Departments", href: "/admin/departments", icon: <Building2 className="h-5 w-5" /> },
  { name: "Reports", href: "/admin/reports", icon: <ClipboardList className="h-5 w-5" /> },
  { name: "Settings", href: "/admin/settings", icon: <Settings className="h-5 w-5" /> },
];

const doctorNavItems: NavItem[] = [
  { name: "Dashboard", href: "/doctor", icon: <LayoutDashboard className="h-5 w-5" /> },
  { name: "Appointments", href: "/doctor/appointments", icon: <Calendar className="h-5 w-5" /> },
  { name: "My Patients", href: "/doctor/patients", icon: <Users className="h-5 w-5" /> },
  { name: "Prescriptions", href: "/doctor/prescriptions", icon: <FileText className="h-5 w-5" /> },
  { name: "Medical Records", href: "/doctor/records", icon: <ClipboardList className="h-5 w-5" /> },
  { name: "Schedule", href: "/doctor/schedule", icon: <Clock className="h-5 w-5" /> },
];

const patientNavItems: NavItem[] = [
  { name: "Dashboard", href: "/patient", icon: <LayoutDashboard className="h-5 w-5" /> },
  { name: "Book Appointment", href: "/patient/book", icon: <Calendar className="h-5 w-5" /> },
  { name: "My Appointments", href: "/patient/appointments", icon: <Clock className="h-5 w-5" /> },
  { name: "Prescriptions", href: "/patient/prescriptions", icon: <FileText className="h-5 w-5" /> },
  { name: "Medical Records", href: "/patient/records", icon: <ClipboardList className="h-5 w-5" /> },
  { name: "Profile", href: "/patient/profile", icon: <UserCog className="h-5 w-5" /> },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);

  const userType = session?.user?.type;
  const navItems =
    userType === "admin"
      ? adminNavItems
      : userType === "doctor"
      ? doctorNavItems
      : patientNavItems;

  const basePath = `/${userType}`;

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-slate-900 text-white transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-blue-500" />
            <span className="text-lg font-bold">
              {session?.user?.hospitalName || "Hospital"}
            </span>
          </div>
        )}
        {collapsed && <Heart className="h-8 w-8 text-blue-500 mx-auto" />}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors",
            collapsed && "mx-auto mt-2"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== basePath && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white",
                collapsed && "justify-center"
              )}
              title={collapsed ? item.name : undefined}
            >
              {item.icon}
              {!collapsed && <span className="font-medium">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-800">
        <div
          className={cn(
            "flex items-center gap-3 mb-3",
            collapsed && "justify-center"
          )}
        >
          <Avatar
            fallback={session?.user?.name || "U"}
            size={collapsed ? "sm" : "md"}
          />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {session?.user?.name}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {session?.user?.email}
              </p>
            </div>
          )}
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className={cn(
            "flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors",
            collapsed && "justify-center"
          )}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
