"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  CalendarDays,
  Settings,
  LogOut,
  UserCheck,
  ClipboardList,
  HeartPulse,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface SidebarProps {
  role: "ADMIN" | "DOCTOR" | "PATIENT";
  name: string;
  email: string;
}

const navItems = {
  ADMIN: [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Doctors", href: "/dashboard/admin/doctors", icon: Stethoscope },
    { label: "Appointments", href: "/dashboard/admin/appointments", icon: CalendarDays },
    { label: "Settings", href: "/dashboard/admin/settings", icon: Settings },
  ],
  DOCTOR: [
    { label: "Overview", href: "/dashboard/doctor", icon: LayoutDashboard },
    { label: "Appointments", href: "/dashboard/doctor/appointments", icon: CalendarDays },
    { label: "Patients", href: "/dashboard/doctor/patients", icon: Users },
    { label: "My Profile", href: "/dashboard/doctor/profile", icon: UserCheck },
    { label: "Settings", href: "/dashboard/doctor/settings", icon: Settings },
  ],
  PATIENT: [
    { label: "Overview", href: "/dashboard/patient", icon: LayoutDashboard },
    { label: "Appointments", href: "/dashboard/patient/appointments", icon: CalendarDays },
    { label: "My Doctors", href: "/dashboard/patient/doctors", icon: Stethoscope },
    { label: "Health Records", href: "/dashboard/patient/records", icon: ClipboardList },
    { label: "Vitals", href: "/dashboard/patient/vitals", icon: HeartPulse },
    { label: "Settings", href: "/dashboard/patient/settings", icon: Settings },
  ],
};

const roleColors: Record<string, string> = {
  ADMIN: "bg-purple-500/20 text-purple-400",
  DOCTOR: "bg-blue-500/20 text-blue-400",
  PATIENT: "bg-[#24AE7C]/20 text-[#24AE7C]",
};

export default function Sidebar({ role, name, email }: SidebarProps) {
  const pathname = usePathname();
  const items = navItems[role];

  return (
    <aside className="w-64 shrink-0 flex flex-col h-screen bg-app-surface border-r border-app-border sticky top-0 shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-app-border">
        <Image src="/assets/icons/logo-icon.svg" alt="logo" width={32} height={32} />
        <span className="text-lg font-bold text-app-text">DoctorKhuji</span>
      </div>

      {/* Role Badge */}
      <div className="px-6 py-4">
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${roleColors[role]}`}>
          {role}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-[#24AE7C] text-white"
                  : "text-app-muted hover:bg-app-surface-2 hover:text-app-text"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User + Sign Out */}
      <div className="px-4 py-4 border-t border-app-border space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-[#24AE7C]/20 flex items-center justify-center shrink-0">
            <span className="text-[#24AE7C] text-sm font-bold">
              {name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-app-text truncate">{name}</p>
            <p className="text-xs text-app-subtle truncate">{email}</p>
          </div>
        </div>
        <ThemeToggle />
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-app-muted hover:bg-red-500/10 hover:text-red-400 transition-all cursor-pointer"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
