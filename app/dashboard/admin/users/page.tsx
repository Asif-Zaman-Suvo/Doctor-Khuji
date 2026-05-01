import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import RoleSelect from "@/components/admin/RoleSelect";
import DeleteUserButton from "@/components/admin/DeleteUserButton";
import { Users, Search } from "lucide-react";

const roleColors: Record<string, string> = {
  ADMIN: "bg-purple-500/20 text-purple-400",
  DOCTOR: "bg-blue-500/20 text-blue-400",
  PATIENT: "bg-[#24AE7C]/20 text-[#24AE7C]",
};

export default async function AdminUsersPage() {
  const session = await auth();
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { doctorProfile: true, patientProfile: true, _count: { select: { patientAppointments: true } } },
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-app-text">User Management</h1>
          <p className="text-app-muted mt-1">{users.length} registered users</p>
        </div>
      </div>

      <div className="bg-app-surface border border-app-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-app-border flex items-center gap-3">
          <Search size={16} className="text-app-subtle" />
          <span className="text-sm text-app-subtle">All Users</span>
        </div>
        <div className="divide-y divide-app-border">
          {users.map(user => (
            <div key={user.id} className="flex items-center gap-4 px-6 py-4 hover:bg-app-surface-2 transition-colors">
              <div className="w-10 h-10 rounded-full bg-[#24AE7C]/10 flex items-center justify-center shrink-0">
                <span className="text-[#24AE7C] text-sm font-bold">{user.name?.charAt(0).toUpperCase() ?? "?"}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-app-text">{user.name ?? "—"}</p>
                <p className="text-xs text-app-subtle">{user.email}</p>
                {user.phone && <p className="text-xs text-app-subtle">{user.phone}</p>}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${roleColors[user.role]}`}>{user.role}</span>
                <span className="text-xs text-app-subtle">{user._count.patientAppointments} appts</span>
                <span className="text-xs text-app-subtle">{new Date(user.createdAt).toLocaleDateString()}</span>
                {user.id !== session?.user?.id && (
                  <>
                    <RoleSelect userId={user.id} currentRole={user.role} />
                    <DeleteUserButton userId={user.id} />
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
