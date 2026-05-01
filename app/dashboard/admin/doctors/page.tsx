import { prisma } from "@/lib/db";
import Image from "next/image";
import DoctorApprovalButton from "@/components/admin/DoctorApprovalButton";
import { Stethoscope, Star, DollarSign, CalendarDays, UserPlus } from "lucide-react";

export default async function AdminDoctorsPage() {
  const doctors = await prisma.user.findMany({
    where: { role: "DOCTOR" },
    include: {
      doctorProfile: true,
      _count: { select: { doctorAppointments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const pending = doctors.filter(d => !d.doctorProfile?.isApproved);
  const approved = doctors.filter(d => d.doctorProfile?.isApproved);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-app-text">Doctor Management</h1>
        <p className="text-app-muted mt-1">{approved.length} approved · {pending.length} pending</p>
      </div>

      {pending.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-app-text flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            Pending Approval ({pending.length})
          </h2>
          <div className="space-y-3">
            {pending.map(doc => <DoctorCard key={doc.id} doc={doc} />)}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-app-text">All Doctors ({doctors.length})</h2>
        {doctors.length === 0 ? (
          <div className="bg-app-surface border border-app-border rounded-2xl flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#24AE7C]/10 flex items-center justify-center">
              <UserPlus size={32} className="text-[#24AE7C]" />
            </div>
            <div className="text-center">
              <p className="text-app-text font-semibold text-lg">No doctors registered yet</p>
              <p className="text-app-subtle text-sm mt-1">
                Doctors who register on the platform will appear here for approval.
              </p>
            </div>
            <div className="flex flex-col items-center gap-1 text-xs text-app-subtle bg-app-bg border border-app-border rounded-xl px-5 py-3">
              <span>Share the registration link with your doctors:</span>
              <span className="text-[#24AE7C] font-mono">/register → select Doctor role</span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {doctors.map(doc => <DoctorCard key={doc.id} doc={doc} />)}
          </div>
        )}
      </section>
    </div>
  );
}

function DoctorCard({ doc }: { doc: any }) {
  return (
    <div className="bg-app-surface border border-app-border rounded-2xl p-5 flex items-center gap-4">
      <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border border-app-border">
        {doc.image
          ? <Image src={doc.image} alt={doc.name ?? ""} fill className="object-cover" />
          : <div className="w-full h-full bg-[#24AE7C]/10 flex items-center justify-center"><Stethoscope size={20} className="text-[#24AE7C]" /></div>
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-app-text">{doc.name}</p>
        <p className="text-sm text-[#24AE7C]">{doc.doctorProfile?.specialty ?? "No specialty set"}</p>
        <p className="text-xs text-app-subtle">{doc.email}</p>
        <div className="flex items-center gap-4 mt-1.5 text-xs text-app-subtle">
          {doc.doctorProfile?.consultationFee && (
            <span className="flex items-center gap-1"><DollarSign size={11} />${doc.doctorProfile.consultationFee}</span>
          )}
          {doc.doctorProfile?.avgRating && (
            <span className="flex items-center gap-1"><Star size={11} className="text-yellow-400" />{doc.doctorProfile.avgRating}</span>
          )}
          <span className="flex items-center gap-1"><CalendarDays size={11} />{doc._count.doctorAppointments} appointments</span>
          {doc.doctorProfile?.experience && <span>{doc.doctorProfile.experience} yrs</span>}
        </div>
      </div>
      <div className="shrink-0">
        <DoctorApprovalButton userId={doc.id} isApproved={doc.doctorProfile?.isApproved ?? false} />
      </div>
    </div>
  );
}
