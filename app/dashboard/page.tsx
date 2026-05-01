import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  const role = session?.user?.role;

  const redirectMap: Record<string, string> = {
    ADMIN: "/dashboard/admin",
    DOCTOR: "/dashboard/doctor",
    PATIENT: "/dashboard/patient",
  };

  redirect(redirectMap[role as string] ?? "/login");
}
