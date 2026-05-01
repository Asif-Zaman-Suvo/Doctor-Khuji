import { prisma } from "@/lib/db";
import BookAppointmentForm from "@/components/patient/BookAppointmentForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewAppointmentPage({
  searchParams,
}: {
  searchParams: Promise<{ doctorId?: string }>;
}) {
  const { doctorId } = await searchParams;

  const doctors = await prisma.user.findMany({
    where: { role: "DOCTOR", doctorProfile: { isApproved: true } },
    include: { doctorProfile: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-8 max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/patient/doctors" className="text-app-muted hover:text-app-text transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-app-text">Book Appointment</h1>
          <p className="text-app-muted mt-0.5">Choose a doctor, date, and time slot</p>
        </div>
      </div>

      <div className="bg-app-surface border border-app-border rounded-2xl p-6">
        <BookAppointmentForm doctors={doctors} preselectedId={doctorId} />
      </div>
    </div>
  );
}
