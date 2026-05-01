import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import PatientProfileForm from "@/components/patient/PatientProfileForm";
import { UserRound, ShieldCheck } from "lucide-react";

export default async function PatientSettingsPage() {
  const session = await auth();
  const userId = session?.user?.id!;

  const [user, profile] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.patientProfile.findUnique({ where: { userId } }),
  ]);

  const defaultValues = {
    name: user?.name ?? "",
    phone: user?.phone ?? "",
    dateOfBirth: profile?.dateOfBirth
      ? new Date(profile.dateOfBirth).toISOString().split("T")[0]
      : "",
    bloodGroup: profile?.bloodGroup ?? "",
    gender: profile?.gender ?? "",
    address: profile?.address ?? "",
  };

  return (
    <div className="p-8 max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
        <p className="text-[#ABB8C4] mt-1">Keep your health information up to date.</p>
      </div>

      {/* Account Card */}
      <div className="bg-[#161A1F] border border-[#1E2124] rounded-2xl p-6 space-y-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#24AE7C]/10 flex items-center justify-center">
            <UserRound size={20} className="text-[#24AE7C]" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Personal Information</h2>
            <p className="text-xs text-[#76828D]">Update your name, phone, and health details</p>
          </div>
        </div>
        <PatientProfileForm defaultValues={defaultValues} />
      </div>

      {/* Security info */}
      <div className="bg-[#161A1F] border border-[#1E2124] rounded-2xl p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
          <ShieldCheck size={20} className="text-blue-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Account Email</p>
          <p className="text-sm text-[#76828D]">{user?.email}</p>
        </div>
        <span className="ml-auto text-xs bg-[#24AE7C]/10 text-[#24AE7C] border border-[#24AE7C]/20 rounded-full px-3 py-1 font-medium">Verified</span>
      </div>
    </div>
  );
}
