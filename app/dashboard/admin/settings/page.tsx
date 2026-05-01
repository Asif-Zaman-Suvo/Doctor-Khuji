import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { ShieldCheck, Users, Stethoscope, CalendarDays } from "lucide-react";
import { AvatarUpload } from "@/components/ui/avatar-upload";
import { ChangePasswordForm } from "@/components/ui/change-password-form";

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
        <h1 className="text-2xl font-bold text-app-text">Admin Settings</h1>
        <p className="text-app-muted mt-1">Portal configuration and account management</p>
      </div>

      {/* Admin account + avatar */}
      <div className="bg-app-surface border border-app-border rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
        <AvatarUpload currentImage={user?.image} name={user?.name} size={96} />
        <div>
          <p className="text-lg font-semibold text-app-text">{user?.name}</p>
          <p className="text-sm text-app-subtle">{user?.email}</p>
          <span className="mt-1 inline-block text-xs bg-purple-500/10 text-purple-500 border border-purple-500/20 rounded-full px-3 py-0.5 font-medium">ADMIN</span>
        </div>
      </div>

      {/* Change password */}
      <ChangePasswordForm />

      {/* Platform Stats */}
      <div className="bg-app-surface border border-app-border rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-app-text flex items-center gap-2">
          <ShieldCheck size={18} className="text-[#24AE7C]" /> Platform Overview
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Users", value: totalUsers, icon: Users, color: "text-blue-500" },
            { label: "Doctors", value: totalDoctors, icon: Stethoscope, color: "text-purple-500" },
            { label: "Appointments", value: totalAppointments, icon: CalendarDays, color: "text-[#24AE7C]" },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-app-bg rounded-xl p-4 text-center space-y-2">
                <Icon size={20} className={`mx-auto ${s.color}`} />
                <p className="text-2xl font-bold text-app-text">{s.value}</p>
                <p className="text-xs text-app-subtle">{s.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Portal Config */}
      <div className="bg-app-surface border border-app-border rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-app-text">Portal Configuration</h2>
        <div className="space-y-3">
          {[
            { label: "Portal Name", value: "DoctorKhuji" },
            { label: "Authentication", value: "NextAuth v5 (JWT)" },
            { label: "Database", value: "PostgreSQL (Supabase)" },
            { label: "ORM", value: "Prisma v7" },
            { label: "Framework", value: "Next.js 15 (App Router)" },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-app-border last:border-0">
              <span className="text-sm text-app-muted">{item.label}</span>
              <span className="text-sm text-app-text font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
