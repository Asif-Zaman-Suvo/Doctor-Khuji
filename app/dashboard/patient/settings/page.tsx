import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import PatientProfileForm from "@/components/patient/PatientProfileForm";
import { AvatarUpload } from "@/components/ui/avatar-upload";
import { ChangePasswordForm } from "@/components/ui/change-password-form";
import { ShieldCheck } from "lucide-react";

export default async function PatientSettingsPage() {
  const session = await auth();
  const userId = session?.user?.id ?? "";

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
        <h1 className="text-2xl font-bold text-app-text">Profile Settings</h1>
        <p className="text-app-muted mt-1">Keep your health information up to date.</p>
      </div>

      {/* Avatar */}
      <div className="bg-app-surface border border-app-border rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
        <AvatarUpload currentImage={user?.image} name={user?.name} size={96} />
        <div>
          <p className="text-base font-semibold text-app-text">{user?.name}</p>
          <p className="text-sm text-app-subtle">{user?.email}</p>
          <span className="mt-1 inline-block text-xs bg-[#24AE7C]/10 text-[#24AE7C] border border-[#24AE7C]/20 rounded-full px-3 py-0.5 font-medium">PATIENT</span>
        </div>
      </div>

      {/* Profile form */}
      <div className="bg-app-surface border border-app-border rounded-2xl p-6 space-y-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#24AE7C]/10 flex items-center justify-center">
            <ShieldCheck size={20} className="text-[#24AE7C]" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-app-text">Personal Information</h2>
            <p className="text-xs text-app-subtle">Update your name, phone, and health details</p>
          </div>
        </div>
        <PatientProfileForm defaultValues={defaultValues} />
      </div>

      {/* Change password */}
      <ChangePasswordForm />
    </div>
  );
}
