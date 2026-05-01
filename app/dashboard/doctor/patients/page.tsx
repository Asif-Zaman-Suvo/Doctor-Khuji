import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { UserRound, CalendarDays } from "lucide-react";

export default async function DoctorPatientsPage() {
  const session = await auth();
  const userId = session?.user?.id!;

  const appointments = await prisma.appointment.findMany({
    where: { doctorId: userId, status: { not: "CANCELLED" } },
    include: { patient: { include: { patientProfile: true } } },
    orderBy: { createdAt: "desc" },
  });

  // Deduplicate patients
  const patientMap = new Map<string, { patient: typeof appointments[0]["patient"]; lastVisit: Date; totalVisits: number }>();
  for (const appt of appointments) {
    const existing = patientMap.get(appt.patientId);
    if (existing) {
      existing.totalVisits++;
      if (new Date(appt.date) > existing.lastVisit) existing.lastVisit = new Date(appt.date);
    } else {
      patientMap.set(appt.patientId, { patient: appt.patient, lastVisit: new Date(appt.date), totalVisits: 1 });
    }
  }
  const patients = [...patientMap.values()];

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Patients</h1>
        <p className="text-[#ABB8C4] mt-1">{patients.length} unique patients</p>
      </div>

      {patients.length === 0 ? (
        <div className="flex flex-col items-center py-20 gap-3">
          <UserRound size={40} className="text-[#363A3D]" />
          <p className="text-[#76828D]">No patients yet. Appointments will appear here.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {patients.map(({ patient, lastVisit, totalVisits }) => (
            <div key={patient.id} className="bg-[#161A1F] border border-[#1E2124] rounded-2xl p-5 space-y-3 hover:border-[#24AE7C]/20 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#24AE7C]/10 flex items-center justify-center shrink-0">
                  <span className="text-[#24AE7C] text-lg font-bold">{patient.name?.charAt(0).toUpperCase()}</span>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-white truncate">{patient.name}</p>
                  <p className="text-xs text-[#76828D] truncate">{patient.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {patient.patientProfile?.bloodGroup && (
                  <div className="bg-[#0D0F10] rounded-lg px-3 py-2">
                    <p className="text-[#76828D]">Blood Group</p>
                    <p className="text-white font-medium">{patient.patientProfile.bloodGroup}</p>
                  </div>
                )}
                {patient.patientProfile?.gender && (
                  <div className="bg-[#0D0F10] rounded-lg px-3 py-2">
                    <p className="text-[#76828D]">Gender</p>
                    <p className="text-white font-medium">{patient.patientProfile.gender}</p>
                  </div>
                )}
                <div className="bg-[#0D0F10] rounded-lg px-3 py-2">
                  <p className="text-[#76828D]">Visits</p>
                  <p className="text-white font-medium">{totalVisits}</p>
                </div>
                <div className="bg-[#0D0F10] rounded-lg px-3 py-2">
                  <p className="text-[#76828D]">Last Visit</p>
                  <p className="text-white font-medium">{lastVisit.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
