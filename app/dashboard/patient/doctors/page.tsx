import { prisma } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import { Star, Stethoscope, CalendarDays, DollarSign } from "lucide-react";

export default async function PatientDoctorsPage() {
  const doctors = await prisma.user.findMany({
    where: { role: "DOCTOR", doctorProfile: { isApproved: true } },
    include: { doctorProfile: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-app-text">Find a Doctor</h1>
          <p className="text-app-muted mt-1">{doctors.length} verified doctors available</p>
        </div>
      </div>

      {doctors.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Stethoscope size={48} className="text-app-border-2" />
          <p className="text-app-subtle">No approved doctors yet. Check back soon.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {doctors.map(doc => (
            <div key={doc.id} className="bg-app-surface border border-app-border rounded-2xl overflow-hidden hover:border-[#24AE7C]/30 transition-all group">
              {/* Header */}
              <div className="relative h-40 bg-gradient-to-br from-[#24AE7C]/10 to-app-border">
                {doc.image ? (
                  <Image src={doc.image} alt={doc.name ?? ""} fill className="object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Stethoscope size={40} className="text-app-border-2" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-app-surface to-transparent" />
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-semibold text-app-text">{doc.name}</h3>
                  <p className="text-sm text-[#24AE7C]">{doc.doctorProfile?.specialty}</p>
                </div>

                {doc.doctorProfile?.bio && (
                  <p className="text-xs text-app-subtle line-clamp-2">{doc.doctorProfile.bio}</p>
                )}

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {doc.doctorProfile?.experience && (
                    <div className="flex items-center gap-1.5 text-app-muted">
                      <CalendarDays size={13} className="text-[#24AE7C]" />
                      {doc.doctorProfile.experience} yrs exp
                    </div>
                  )}
                  {doc.doctorProfile?.consultationFee && (
                    <div className="flex items-center gap-1.5 text-app-muted">
                      <DollarSign size={13} className="text-[#24AE7C]" />
                      ${doc.doctorProfile.consultationFee} / visit
                    </div>
                  )}
                  {doc.doctorProfile?.avgRating && (
                    <div className="flex items-center gap-1.5 text-app-muted">
                      <Star size={13} className="text-yellow-400" fill="currentColor" />
                      {doc.doctorProfile.avgRating} ({doc.doctorProfile.totalReviews} reviews)
                    </div>
                  )}
                </div>

                {doc.doctorProfile?.availableDays && doc.doctorProfile.availableDays.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {doc.doctorProfile.availableDays.map(day => (
                      <span key={day} className="text-xs bg-app-bg border border-app-border text-app-muted rounded-full px-2 py-0.5">
                        {day.slice(0, 3)}
                      </span>
                    ))}
                  </div>
                )}

                <Link
                  href={`/dashboard/patient/appointments/new?doctorId=${doc.id}`}
                  className="block text-center bg-[#24AE7C] hover:bg-[#1d9268] text-white text-sm font-semibold rounded-xl py-2.5 transition-colors"
                >
                  Book Appointment
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
