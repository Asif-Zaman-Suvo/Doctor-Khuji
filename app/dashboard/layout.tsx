import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) redirect("/login");

  const role = session.user.role as "ADMIN" | "DOCTOR" | "PATIENT";
  const name = session.user.name ?? "User";
  const email = session.user.email ?? "";

  return (
    <div className="flex min-h-screen bg-app-bg">
      <Sidebar role={role} name={name} email={email} />
      <main className="flex-1 overflow-y-auto bg-app-bg">{children}</main>
    </div>
  );
}
