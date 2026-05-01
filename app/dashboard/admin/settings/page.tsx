import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { ShieldCheck, Users, Stethoscope, CalendarDays } from "lucide-react";

export default async function AdminSettingsPage() {
  const session = await auth();
  const user = await prisma.user.findUnique({ where: { id: session?.user?.id! } });

  const [totalUsers, totalDoctors, totalAppointments] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "DOCTOR" } }),
    prisma.appointment.count(),
  ]);

  return (
    <div className="p-8 max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Settings</h1>
        <p className="text-[#ABB8C4] mt-1">Portal configuration and account overview</p>
      </div>

      {/* Admin account */}
      <div className="bg-[#161A1F] border border-[#1E2124] rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center">
            <span className="text-purple-400 text-2xl font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <p className="text-lg font-semibold text-white">{user?.name}</p>
            <p className="text-sm text-[#76828D]">{user?.email}</p>
            <span className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full px-3 py-0.5 font-medium">ADMIN</span>
          </div>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="bg-[#161A1F] border border-[#1E2124] rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <ShieldCheck size={18} className="text-[#24AE7C]" /> Platform Overview
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Users", value: totalUsers, icon: Users, color: "text-blue-400" },
            { label: "Doctors", value: totalDoctors, icon: Stethoscope, color: "text-purple-400" },
            { label: "Appointments", value: totalAppointments, icon: CalendarDays, color: "text-[#24AE7C]" },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-[#0D0F10] rounded-xl p-4 text-center space-y-2">
                <Icon size={20} className={`mx-auto ${s.color}`} />
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-[#76828D]">{s.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Portal Config */}
      <div className="bg-[#161A1F] border border-[#1E2124] rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-white">Portal Configuration</h2>
        <div className="space-y-3">
          {[
            { label: "Portal Name", value: "DoctorKhuji" },
            { label: "Authentication", value: "NextAuth v5 (JWT)" },
            { label: "Database", value: "PostgreSQL (Supabase)" },
            { label: "ORM", value: "Prisma v7" },
            { label: "Framework", value: "Next.js 15 (App Router)" },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-[#1E2124] last:border-0">
              <span className="text-sm text-[#ABB8C4]">{item.label}</span>
              <span className="text-sm text-white font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
