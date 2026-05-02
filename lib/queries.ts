import { cache } from "react";
import { prisma } from "@/lib/db";

// React cache deduplicates identical calls within the same render pass

export const getApprovedDoctors = cache(async () => {
  return prisma.user.findMany({
    where: { role: "DOCTOR", doctorProfile: { isApproved: true } },
    include: { doctorProfile: { select: { specialty: true, avgRating: true } } },
    orderBy: { name: "asc" },
  });
});

export const getDashboardStats = cache(async () => {
  const [totalUsers, totalDoctors, totalPatients, pendingDoctors] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "DOCTOR" } }),
      prisma.user.count({ where: { role: "PATIENT" } }),
      prisma.user.count({
        where: {
          role: "DOCTOR",
          NOT: { doctorProfile: { isApproved: true } },
        },
      }),
    ]);
  return { totalUsers, totalDoctors, totalPatients, pendingDoctors };
});

export const getRecentUsers = cache(async () => {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
});
