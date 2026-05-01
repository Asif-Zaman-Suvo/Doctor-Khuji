import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { CalendarDays, Users, Star, CheckCircle, Clock, AlertCircle } from "lucide-react";
import Image from "next/image";

export default async function DoctorDashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const profile = await prisma.doctorProfile.findUnique({
    where: { userId },
  });

  const profileFields = [
    { label: "Specialty", value: profile?.specialty, done: !!profile?.specialty },
    { label: "Qualifications", value: profile?.qualifications, done: !!profile?.qualifications },
    { label: "Bio", value: profile?.bio, done: !!profile?.bio },
    { label: "Consultation Fee", value: profile?.consultationFee ? `$${profile.consultationFee}` : null, done: !!profile?.consultationFee },
    { label: "Experience", value: profile?.experience ? `${profile.experience} years` : null, done: !!profile?.experience },
    { label: "Available Days", value: profile?.availableDays?.join(", "), done: (profile?.availableDays?.length ?? 0) > 0 },
  ];

  const completedFields = profileFields.filter((f) => f.done).length;
  const completionPct = Math.round((completedFields / profileFields.length) * 100);

  const statCards = [
    { label: "Appointments Today", value: 0, icon: CalendarDays, color: "bg-blue-500/10 text-blue-400" },
    { label: "Total Patients", value: 0, icon: Users, color: "bg-purple-500/10 text-purple-400" },
    { label: "Avg. Rating", value: profile?.avgRating?.toFixed(1) ?? "—", icon: Star, color: "bg-yellow-500/10 text-yellow-400" },
    { label: "Total Reviews", value: profile?.totalReviews ?? 0, icon: CheckCircle, color: "bg-[#24AE7C]/10 text-[#24AE7C]" },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-app-text">
            Welcome, Dr. {session?.user?.name} 👨‍⚕️
          </h1>
          <p className="text-app-muted mt-1">Manage your appointments and patient records.</p>
        </div>
        {profile?.isApproved ? (
          <div className="flex items-center gap-2 bg-[#24AE7C]/10 border border-[#24AE7C]/30 rounded-full px-4 py-2">
            <CheckCircle size={14} className="text-[#24AE7C]" />
            <span className="text-sm text-[#24AE7C] font-medium">Approved</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-4 py-2">
            <Clock size={14} className="text-yellow-400" />
            <span className="text-sm text-yellow-400 font-medium">Pending Approval</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="stat-card bg-app-surface border border-app-border">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Completion */}
        <div className="bg-app-surface border border-app-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-app-text">Profile Completion</h2>
            <span className="text-2xl font-bold text-[#24AE7C]">{completionPct}%</span>
          </div>
          <div className="w-full h-2 bg-app-border rounded-full overflow-hidden">
            <div
              className="h-full bg-[#24AE7C] rounded-full transition-all"
              style={{ width: `${completionPct}%` }}
            />
          </div>
          <div className="space-y-2 pt-2">
            {profileFields.map((field) => (
              <div key={field.label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {field.done ? (
                    <CheckCircle size={15} className="text-[#24AE7C]" />
                  ) : (
                    <AlertCircle size={15} className="text-yellow-400" />
                  )}
                  <span className="text-app-muted">{field.label}</span>
                </div>
                <span className={field.done ? "text-app-text text-xs" : "text-app-subtle text-xs"}>
                  {field.done ? field.value : "Not set"}
                </span>
              </div>
            ))}
          </div>
          {completionPct < 100 && (
            <a
              href="/dashboard/doctor/profile"
              className="block text-center text-sm text-[#24AE7C] hover:underline font-medium pt-2"
            >
              Complete your profile →
            </a>
          )}
        </div>

        {/* Upcoming Appointments Placeholder */}
        <div className="bg-app-surface border border-app-border rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-app-text">Upcoming Appointments</h2>
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Image src="/assets/icons/appointments.svg" alt="no appointments" width={48} height={48} className="opacity-30" />
            <p className="text-app-subtle text-sm text-center">No upcoming appointments yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
