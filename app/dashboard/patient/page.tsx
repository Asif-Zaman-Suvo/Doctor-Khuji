import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { CalendarDays, Stethoscope, ClipboardList, HeartPulse, CheckCircle, AlertCircle } from "lucide-react";
import Image from "next/image";

const doctors = [
  { name: "Dr. Cameron", img: "/assets/images/dr-cameron.png", specialty: "Cardiologist" },
  { name: "Dr. Cruz", img: "/assets/images/dr-cruz.png", specialty: "Pediatrician" },
  { name: "Dr. Green", img: "/assets/images/dr-green.png", specialty: "Orthopedic" },
  { name: "Dr. Lee", img: "/assets/images/dr-lee.png", specialty: "Neurologist" },
];

export default async function PatientDashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const profile = await prisma.patientProfile.findUnique({
    where: { userId },
  });

  const profileFields = [
    { label: "Date of Birth", done: !!profile?.dateOfBirth },
    { label: "Blood Group", done: !!profile?.bloodGroup },
    { label: "Gender", done: !!profile?.gender },
    { label: "Address", done: !!profile?.address },
  ];
  const completedFields = profileFields.filter((f) => f.done).length;
  const completionPct = Math.round((completedFields / profileFields.length) * 100);

  const [totalAppts, uniqueDoctors, completedAppts] = await Promise.all([
    prisma.appointment.count({ where: { patientId: userId, status: { in: ["PENDING", "CONFIRMED"] } } }),
    prisma.appointment.findMany({ where: { patientId: userId }, select: { doctorId: true }, distinct: ["doctorId"] }).then(r => r.length),
    prisma.appointment.count({ where: { patientId: userId, status: "COMPLETED" } }),
  ]);

  const statCards = [
    { label: "Upcoming", value: totalAppts, icon: CalendarDays, color: "bg-blue-500/10 text-blue-400" },
    { label: "My Doctors", value: uniqueDoctors, icon: Stethoscope, color: "bg-purple-500/10 text-purple-400" },
    { label: "Consultations", value: completedAppts, icon: ClipboardList, color: "bg-[#24AE7C]/10 text-[#24AE7C]" },
    { label: "Health Score", value: completionPct + "%", icon: HeartPulse, color: "bg-red-500/10 text-red-400" },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Hello, {session?.user?.name} 👋
        </h1>
        <p className="text-[#ABB8C4] mt-1">Your health dashboard — stay on top of your appointments.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="stat-card bg-[#161A1F] border border-[#1E2124]">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                <Icon size={20} />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{card.value}</p>
                <p className="text-sm text-[#ABB8C4]">{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="bg-[#161A1F] border border-[#1E2124] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Upcoming Appointments</h2>
            <a href="/dashboard/patient/appointments" className="text-xs text-[#24AE7C] hover:underline">
              View all
            </a>
          </div>
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <Image src="/assets/icons/appointments.svg" alt="no appointments" width={48} height={48} className="opacity-30" />
            <p className="text-[#76828D] text-sm">No upcoming appointments.</p>
            <a
              href="/dashboard/patient/doctors"
              className="text-sm text-[#24AE7C] hover:underline font-medium"
            >
              Book an appointment →
            </a>
          </div>
        </div>

        {/* Profile Completion */}
        <div className="bg-[#161A1F] border border-[#1E2124] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Health Profile</h2>
            <span className="text-2xl font-bold text-[#24AE7C]">{completionPct}%</span>
          </div>
          <div className="w-full h-2 bg-[#1E2124] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#24AE7C] rounded-full"
              style={{ width: `${completionPct}%` }}
            />
          </div>
          <div className="space-y-2 pt-2">
            {profileFields.map((field) => (
              <div key={field.label} className="flex items-center gap-2 text-sm">
                {field.done ? (
                  <CheckCircle size={15} className="text-[#24AE7C]" />
                ) : (
                  <AlertCircle size={15} className="text-yellow-400" />
                )}
                <span className={field.done ? "text-white" : "text-[#ABB8C4]"}>{field.label}</span>
              </div>
            ))}
          </div>
          <a
            href="/dashboard/patient/settings"
            className="block text-center text-sm text-[#24AE7C] hover:underline font-medium pt-2"
          >
            Complete your profile →
          </a>
        </div>
      </div>

      {/* Available Doctors */}
      <div className="bg-[#161A1F] border border-[#1E2124] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">Available Doctors</h2>
          <a href="/dashboard/patient/doctors" className="text-xs text-[#24AE7C] hover:underline">
            See all
          </a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {doctors.map((doctor) => (
            <div
              key={doctor.name}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#0D0F10] border border-[#1E2124] hover:border-[#24AE7C]/30 transition-colors cursor-pointer"
            >
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#24AE7C]/30">
                <Image src={doctor.img} alt={doctor.name} fill className="object-cover" />
              </div>
              <p className="text-sm font-medium text-white text-center">{doctor.name}</p>
              <span className="text-xs text-[#76828D] text-center">{doctor.specialty}</span>
              <button className="text-xs text-[#24AE7C] hover:underline font-medium">Book</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
