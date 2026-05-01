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
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-[#ABB8C4] mt-1">{users.length} registered users</p>
        </div>
      </div>

      <div className="bg-[#161A1F] border border-[#1E2124] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1E2124] flex items-center gap-3">
          <Search size={16} className="text-[#76828D]" />
          <span className="text-sm text-[#76828D]">All Users</span>
        </div>
        <div className="divide-y divide-[#1E2124]">
          {users.map(user => (
            <div key={user.id} className="flex items-center gap-4 px-6 py-4 hover:bg-[#1A1D21] transition-colors">
              <div className="w-10 h-10 rounded-full bg-[#24AE7C]/10 flex items-center justify-center shrink-0">
                <span className="text-[#24AE7C] text-sm font-bold">{user.name?.charAt(0).toUpperCase() ?? "?"}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{user.name ?? "—"}</p>
                <p className="text-xs text-[#76828D]">{user.email}</p>
                {user.phone && <p className="text-xs text-[#76828D]">{user.phone}</p>}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${roleColors[user.role]}`}>{user.role}</span>
                <span className="text-xs text-[#76828D]">{user._count.patientAppointments} appts</span>
                <span className="text-xs text-[#76828D]">{new Date(user.createdAt).toLocaleDateString()}</span>
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
