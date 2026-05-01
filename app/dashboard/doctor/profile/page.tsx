import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import DoctorProfileForm from "@/components/doctor/DoctorProfileForm";
import { Stethoscope, CheckCircle, AlertCircle } from "lucide-react";

export default async function DoctorProfilePage() {
  const session = await auth();
  const userId = session?.user?.id!;

  const profile = await prisma.doctorProfile.findUnique({ where: { userId } });

  const defaultValues = {
    specialty: profile?.specialty ?? "",
    qualifications: profile?.qualifications ?? "",
    bio: profile?.bio ?? "",
    consultationFee: profile?.consultationFee ?? 0,
    experience: profile?.experience ?? 0,
    availableDays: profile?.availableDays ?? [],
  };

  return (
    <div className="p-8 max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">My Profile</h1>
        <p className="text-[#ABB8C4] mt-1">Complete your profile to start accepting patients.</p>
      </div>

      {/* Approval Status Banner */}
      {profile?.isApproved ? (
        <div className="flex items-center gap-3 bg-[#24AE7C]/10 border border-[#24AE7C]/30 rounded-xl px-4 py-3">
          <CheckCircle size={18} className="text-[#24AE7C]" />
          <div>
            <p className="text-sm font-semibold text-[#24AE7C]">Profile Approved</p>
            <p className="text-xs text-[#76828D]">Your profile is live and visible to patients.</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-4 py-3">
          <AlertCircle size={18} className="text-yellow-400" />
          <div>
            <p className="text-sm font-semibold text-yellow-400">Pending Admin Approval</p>
            <p className="text-xs text-[#76828D]">Complete your profile and submit — admin will review.</p>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-[#161A1F] border border-[#1E2124] rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Stethoscope size={20} className="text-blue-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Professional Details</h2>
            <p className="text-xs text-[#76828D]">Specialty, qualifications, fee, and availability</p>
          </div>
        </div>
        <DoctorProfileForm defaultValues={defaultValues} />
      </div>
    </div>
  );
}
