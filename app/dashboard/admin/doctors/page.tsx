import { prisma } from "@/lib/db";
import Image from "next/image";
import DoctorApprovalButton from "@/components/admin/DoctorApprovalButton";
import { Stethoscope, Star, DollarSign, CalendarDays } from "lucide-react";

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
        <h1 className="text-2xl font-bold text-white">Doctor Management</h1>
        <p className="text-[#ABB8C4] mt-1">{approved.length} approved · {pending.length} pending</p>
      </div>

      {pending.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            Pending Approval ({pending.length})
          </h2>
          <div className="space-y-3">
            {pending.map(doc => <DoctorCard key={doc.id} doc={doc} />)}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">All Doctors ({doctors.length})</h2>
        <div className="space-y-3">
          {doctors.map(doc => <DoctorCard key={doc.id} doc={doc} />)}
        </div>
      </section>
    </div>
  );
}

function DoctorCard({ doc }: { doc: any }) {
  return (
    <div className="bg-[#161A1F] border border-[#1E2124] rounded-2xl p-5 flex items-center gap-4">
      <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border border-[#1E2124]">
        {doc.image
          ? <Image src={doc.image} alt={doc.name ?? ""} fill className="object-cover" />
          : <div className="w-full h-full bg-[#24AE7C]/10 flex items-center justify-center"><Stethoscope size={20} className="text-[#24AE7C]" /></div>
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white">{doc.name}</p>
        <p className="text-sm text-[#24AE7C]">{doc.doctorProfile?.specialty ?? "No specialty set"}</p>
        <p className="text-xs text-[#76828D]">{doc.email}</p>
        <div className="flex items-center gap-4 mt-1.5 text-xs text-[#76828D]">
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
