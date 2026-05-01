import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { AvatarUpload } from "@/components/ui/avatar-upload";
import { ChangePasswordForm } from "@/components/ui/change-password-form";
import DoctorSettingsInfoForm from "@/components/doctor/DoctorSettingsInfoForm";

export default async function DoctorSettingsPage() {
  const session = await auth();
  const userId = session?.user?.id!;
  const user = await prisma.user.findUnique({ where: { id: userId } });

  return (
    <div className="p-8 max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-app-text">Account Settings</h1>
        <p className="text-app-muted mt-1">Update your personal information and password</p>
      </div>

      {/* Avatar */}
      <div className="bg-app-surface border border-app-border rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
        <AvatarUpload currentImage={user?.image} name={user?.name} size={96} />
        <div>
          <p className="text-base font-semibold text-app-text">{user?.name}</p>
          <p className="text-sm text-app-subtle">{user?.email}</p>
          <span className="mt-1 inline-block text-xs bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-full px-3 py-0.5 font-medium">DOCTOR</span>
        </div>
      </div>

      {/* Personal info form */}
      <DoctorSettingsInfoForm
        defaultValues={{ name: user?.name ?? "", phone: user?.phone ?? "" }}
      />

      {/* Change password */}
      <ChangePasswordForm />
    </div>
  );
}
