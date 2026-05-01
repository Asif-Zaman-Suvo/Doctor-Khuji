import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { ClipboardList, FileText, Upload } from "lucide-react";

export default async function PatientRecordsPage() {
  const session = await auth();

  const appointments = await prisma.appointment.findMany({
    where: {
      patientId: session?.user?.id!,
      status: "COMPLETED",
    },
    include: { doctor: { include: { doctorProfile: true } } },
    orderBy: { date: "desc" },
  });

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Health Records</h1>
        <p className="text-[#ABB8C4] mt-1">Your consultation history and medical records</p>
      </div>

      {/* Upload Card */}
      <div className="bg-[#161A1F] border-2 border-dashed border-[#363A3D] rounded-2xl p-8 flex flex-col items-center gap-3 hover:border-[#24AE7C]/40 transition-colors cursor-pointer">
        <div className="w-14 h-14 rounded-2xl bg-[#24AE7C]/10 flex items-center justify-center">
          <Upload size={24} className="text-[#24AE7C]" />
        </div>
        <p className="text-base font-semibold text-white">Upload Medical Records</p>
        <p className="text-sm text-[#76828D] text-center max-w-sm">
          Upload prescriptions, lab results, or any health documents. Supported: PDF, JPG, PNG.
        </p>
        <span className="text-xs text-[#24AE7C] font-medium border border-[#24AE7C]/30 rounded-full px-4 py-1.5">Coming Soon</span>
      </div>

      {/* Consultation History */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <ClipboardList size={18} className="text-[#24AE7C]" />
          Consultation History
        </h2>

        {appointments.length === 0 ? (
          <div className="bg-[#161A1F] border border-[#1E2124] rounded-2xl p-12 flex flex-col items-center gap-3">
            <FileText size={36} className="text-[#363A3D]" />
            <p className="text-[#76828D] text-sm">No completed consultations yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map(appt => (
              <div key={appt.id} className="bg-[#161A1F] border border-[#1E2124] rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">{appt.doctor.name}</p>
                  <p className="text-sm text-[#24AE7C]">{appt.doctor.doctorProfile?.specialty}</p>
                  <p className="text-xs text-[#76828D] mt-1">
                    {new Date(appt.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} · {appt.timeSlot}
                  </p>
                </div>
                <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full px-3 py-1 font-medium">COMPLETED</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
