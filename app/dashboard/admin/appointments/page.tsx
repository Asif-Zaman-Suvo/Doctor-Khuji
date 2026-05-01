import { prisma } from "@/lib/db";
import Image from "next/image";
import AppointmentStatusButton from "@/components/admin/AppointmentStatusButton";
import { CalendarDays, Clock, Stethoscope } from "lucide-react";

const statusStyles: Record<string, string> = {
  PENDING:   "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  CONFIRMED: "bg-[#24AE7C]/10 text-[#24AE7C] border-[#24AE7C]/20",
  CANCELLED: "bg-red-500/10 text-red-400 border-red-500/20",
  COMPLETED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

export default async function AdminAppointmentsPage() {
  const appointments = await prisma.appointment.findMany({
    include: {
      patient: true,
      doctor: { include: { doctorProfile: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const counts = {
    PENDING: appointments.filter(a => a.status === "PENDING").length,
    CONFIRMED: appointments.filter(a => a.status === "CONFIRMED").length,
    COMPLETED: appointments.filter(a => a.status === "COMPLETED").length,
    CANCELLED: appointments.filter(a => a.status === "CANCELLED").length,
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">All Appointments</h1>
        <p className="text-[#ABB8C4] mt-1">{appointments.length} total across all users</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.entries(counts).map(([status, count]) => (
          <div key={status} className={`rounded-xl border px-4 py-3 ${statusStyles[status]}`}>
            <p className="text-2xl font-bold">{count}</p>
            <p className="text-xs font-medium mt-0.5 opacity-80">{status}</p>
          </div>
        ))}
      </div>

      {appointments.length === 0 ? (
        <div className="flex flex-col items-center py-20 gap-3">
          <CalendarDays size={40} className="text-[#363A3D]" />
          <p className="text-[#76828D]">No appointments yet.</p>
        </div>
      ) : (
        <div className="bg-[#161A1F] border border-[#1E2124] rounded-2xl overflow-hidden">
          <div className="divide-y divide-[#1E2124]">
            {appointments.map(appt => (
              <div key={appt.id} className="flex items-center gap-4 px-6 py-4 hover:bg-[#1A1D21] transition-colors">
                {/* Doctor */}
                <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-[#1E2124]">
                  {appt.doctor.image
                    ? <Image src={appt.doctor.image} alt="" fill className="object-cover" />
                    : <div className="w-full h-full bg-blue-500/10 flex items-center justify-center"><Stethoscope size={14} className="text-blue-400" /></div>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-white">{appt.doctor.name}</p>
                    <span className="text-xs text-[#76828D]">→</span>
                    <p className="text-sm text-[#ABB8C4]">{appt.patient.name}</p>
                  </div>
                  <p className="text-xs text-[#24AE7C]">{appt.doctor.doctorProfile?.specialty}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-[#76828D]">
                    <span className="flex items-center gap-1"><CalendarDays size={11} />{new Date(appt.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    <span className="flex items-center gap-1"><Clock size={11} />{appt.timeSlot}</span>
                    {appt.reason && <span className="truncate max-w-[200px]">{appt.reason}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-xs font-semibold border rounded-full px-3 py-1 ${statusStyles[appt.status]}`}>{appt.status}</span>
                  <AppointmentStatusButton appointmentId={appt.id} status={appt.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
