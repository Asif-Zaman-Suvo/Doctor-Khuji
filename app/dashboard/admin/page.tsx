import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { Users, Stethoscope, UserRound, Clock } from "lucide-react";
import Image from "next/image";

async function getStats() {
  const [totalUsers, totalDoctors, totalPatients, pendingDoctors] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "DOCTOR" } }),
      prisma.user.count({ where: { role: "PATIENT" } }),
      prisma.user.count({
        where: {
          role: "DOCTOR",
          NOT: { doctorProfile: { isApproved: true } },
        },
      }),
    ]);
  return { totalUsers, totalDoctors, totalPatients, pendingDoctors };
}

async function getRecentUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
}

async function getApprovedDoctors() {
  return prisma.user.findMany({
    where: { role: "DOCTOR", doctorProfile: { isApproved: true } },
    include: { doctorProfile: { select: { specialty: true } } },
    orderBy: { name: "asc" },
  });
}

const roleColors: Record<string, string> = {
  ADMIN: "bg-purple-500/20 text-purple-400",
  DOCTOR: "bg-blue-500/20 text-blue-400",
  PATIENT: "bg-[#24AE7C]/20 text-[#24AE7C]",
};

export default async function AdminDashboardPage() {
  const session = await auth();
  const [stats, recentUsers, approvedDoctors] = await Promise.all([
    getStats(),
    getRecentUsers(),
    getApprovedDoctors(),
  ]);

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-blue-500/10 text-blue-400",
      bg: "bg-app-surface border border-app-border",
    },
    {
      label: "Doctors",
      value: stats.totalDoctors,
      icon: Stethoscope,
      color: "bg-purple-500/10 text-purple-400",
      bg: "bg-app-surface border border-app-border",
    },
    {
      label: "Patients",
      value: stats.totalPatients,
      icon: UserRound,
      color: "bg-[#24AE7C]/10 text-[#24AE7C]",
      bg: "bg-app-surface border border-app-border",
    },
    {
      label: "Pending Approvals",
      value: stats.pendingDoctors,
      icon: Clock,
      color: "bg-yellow-500/10 text-yellow-400",
      bg: "bg-app-surface border border-app-border",
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-app-text">
            Welcome back, {session?.user?.name} 👋
          </h1>
          <p className="text-app-muted mt-1">
            Here&apos;s what&apos;s happening on your portal today.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#24AE7C]/10 border border-[#24AE7C]/30 rounded-full px-4 py-2">
          <span className="w-2 h-2 rounded-full bg-[#24AE7C] animate-pulse" />
          <span className="text-sm text-[#24AE7C] font-medium">Live</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className={`stat-card ${card.bg}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                <Icon size={20} />
              </div>
              <div>
                <p className="text-3xl font-bold text-app-text">{card.value}</p>
                <p className="text-sm text-app-muted">{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Users */}
      <div className="bg-app-surface border border-app-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-app-border">
          <h2 className="text-lg font-semibold text-app-text">Recent Users</h2>
          <p className="text-sm text-app-muted">Latest registered users</p>
        </div>
        <div className="divide-y divide-app-border">
          {recentUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#24AE7C]/10 flex items-center justify-center shrink-0">
                  <span className="text-[#24AE7C] text-sm font-bold">
                    {user.name?.charAt(0).toUpperCase() ?? "?"}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-app-text">{user.name ?? "—"}</p>
                  <p className="text-xs text-app-subtle">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${roleColors[user.role]}`}>
                  {user.role}
                </span>
                <span className="text-xs text-app-subtle">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Approved Doctors */}
      <div className="bg-app-surface border border-app-border rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-app-text mb-4">
          Approved Doctors
          <span className="ml-2 text-sm font-normal text-app-subtle">({approvedDoctors.length})</span>
        </h2>
        {approvedDoctors.length === 0 ? (
          <p className="text-sm text-app-subtle text-center py-6">No approved doctors yet.</p>
        ) : (
          <div className="flex gap-4 flex-wrap">
            {approvedDoctors.map((dr) => (
              <div key={dr.id} className="flex flex-col items-center gap-2 w-20">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#24AE7C]/30 bg-app-surface-2 flex items-center justify-center shrink-0">
                  {dr.image ? (
                    <Image src={dr.image} alt={dr.name ?? "Doctor"} fill className="object-cover" />
                  ) : (
                    <span className="text-[#24AE7C] text-xl font-bold">
                      {dr.name?.charAt(0).toUpperCase() ?? "?"}
                    </span>
                  )}
                </div>
                <span className="text-xs text-app-subtle text-center leading-tight line-clamp-2">
                  {dr.name}
                </span>
                {dr.doctorProfile?.specialty && (
                  <span className="text-[10px] text-[#24AE7C] text-center leading-tight line-clamp-1">
                    {dr.doctorProfile.specialty}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
