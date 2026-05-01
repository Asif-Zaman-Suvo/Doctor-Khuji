import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays, Clock, Plus, Stethoscope } from "lucide-react";
import CancelButton from "./CancelButton";

const statusStyles: Record<string, string> = {
  PENDING:   "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  CONFIRMED: "bg-[#24AE7C]/10 text-[#24AE7C] border-[#24AE7C]/20",
  CANCELLED: "bg-red-500/10 text-red-400 border-red-500/20",
  COMPLETED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

export default async function PatientAppointmentsPage() {
  const session = await auth();
  const userId = session?.user?.id!;

  const appointments = await prisma.appointment.findMany({
    where: { patientId: userId },
    include: {
      doctor: { include: { doctorProfile: true } },
    },
    orderBy: { date: "desc" },
  });

  const upcoming = appointments.filter(a => a.status === "PENDING" || a.status === "CONFIRMED");
  const past = appointments.filter(a => a.status === "CANCELLED" || a.status === "COMPLETED");

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Appointments</h1>
          <p className="text-[#ABB8C4] mt-1">{upcoming.length} upcoming, {past.length} past</p>
        </div>
        <Link
          href="/dashboard/patient/appointments/new"
          className="flex items-center gap-2 bg-[#24AE7C] hover:bg-[#1d9268] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={16} /> Book New
        </Link>
      </div>

      {appointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <CalendarDays size={48} className="text-[#363A3D]" />
          <p className="text-[#76828D]">No appointments yet.</p>
          <Link href="/dashboard/patient/appointments/new" className="text-sm text-[#24AE7C] hover:underline font-medium">
            Book your first appointment →
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {upcoming.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">Upcoming</h2>
              <div className="space-y-3">
                {upcoming.map(appt => (
                  <AppointmentCard key={appt.id} appt={appt} showCancel />
                ))}
              </div>
            </div>
          )}
          {past.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">Past</h2>
              <div className="space-y-3">
                {past.map(appt => (
                  <AppointmentCard key={appt.id} appt={appt} showCancel={false} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AppointmentCard({ appt, showCancel }: { appt: any; showCancel: boolean }) {
  return (
    <div className="bg-[#161A1F] border border-[#1E2124] rounded-2xl p-5 flex items-center gap-4">
      <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border border-[#1E2124]">
        {appt.doctor.image
          ? <Image src={appt.doctor.image} alt={appt.doctor.name ?? ""} fill className="object-cover" />
          : <div className="w-full h-full bg-[#24AE7C]/10 flex items-center justify-center"><Stethoscope size={20} className="text-[#24AE7C]" /></div>
        }
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white">{appt.doctor.name}</p>
        <p className="text-sm text-[#24AE7C]">{appt.doctor.doctorProfile?.specialty}</p>
        <div className="flex items-center gap-4 mt-1.5 text-xs text-[#76828D]">
          <span className="flex items-center gap-1"><CalendarDays size={12} />{new Date(appt.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>
          <span className="flex items-center gap-1"><Clock size={12} />{appt.timeSlot}</span>
        </div>
        {appt.reason && <p className="text-xs text-[#76828D] mt-1 truncate">Reason: {appt.reason}</p>}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className={`text-xs font-semibold border rounded-full px-3 py-1 ${statusStyles[appt.status]}`}>
          {appt.status}
        </span>
        {showCancel && appt.status !== "CANCELLED" && (
          <CancelButton appointmentId={appt.id} />
        )}
      </div>
    </div>
  );
}
